"""
Module: generate_dataset.py
Description: Generates synthetic ChatML dataset for KEYWORD_RESEARCH and CONTENT_BRIEF tasks.
Supports crash-resilient streaming, automatic resume from existing files, and multi-key rotation.
"""

import argparse
import json
import os
import random
import sys
import time
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

TARGET_PER_TASK = 900
EN_RATIO = 0.65
VI_RATIO = 0.35
MISSING_CONTEXT_PROB = 0.25

NICHES = [
    "Mother & Baby",
    "Skincare & Beauty",
    "Fashion & Apparel",
    "Kitchen & Home",
    "Eco Living",
    "Pet Care",
    "Fitness & Supplements",
    "Electronics & Accessories",
    "Coffee & Specialty Food",
    "Jewelry & Gifts",
    "Bedding & Sleep",
    "Outdoor & Travel",
    "Home Decor",
    "Vietnamese Local Brands",
]

INTENT_ENUM = ["Informational", "Commercial", "Transactional", "Navigational"]
FUNNEL_ENUM = ["TOFU", "MOFU", "BOFU"]
CONTENT_TYPE_ENUM = ["Informational", "Buyer's guide", "How-to", "FAQ"]
STYLE_ENUM = ["Informative", "Analytical", "Instructive", "Persuasive", "Conversational"]
TONE_ENUM = ["Authoritative", "Caring", "Friendly", "Informative", "Formal", "Conversational"]

SYSTEM_KW = """You are an expert SEO & GEO (Generative Engine Optimization) analyst for Shopify e-commerce blogs.
Given a niche, language, and optional business context, return ONLY a JSON object (no markdown, no explanation) in this exact schema:
{
  "keywords": [
    { "keyword": "<string>", "intent": "Informational | Commercial | Transactional | Navigational" }
  ]
}
Rules:
- Return 5-10 keyword objects.
- keyword: 1-6 words, real search query style.
- intent: exactly one of the four enum values.
- No volume, KD, or CPC fields — only keyword + intent.
- Language of keywords must match the language parameter."""

SYSTEM_CB = """You are an expert SEO & GEO content strategist for Shopify e-commerce blogs.
Given a primary keyword and optional context, return ONLY a JSON object (no markdown, no explanation) in this exact schema:
{
  "primary_keyword": "<string>",
  "secondary_keywords": ["<string>", ...],
  "dominant_intent": "Informational | Commercial | Transactional | Navigational",
  "funnel_stage": "TOFU | MOFU | BOFU",
  "recommended_content_type": "Informational | Buyer's guide | How-to | FAQ",
  "recommended_style": "Informative | Analytical | Instructive | Persuasive | Conversational",
  "recommended_tone": "Authoritative | Caring | Friendly | Informative | Formal | Conversational",
  "target_audience": "<string>",
  "key_talking_points": ["<string with E-E-A-T: stat or credential>", ...],
  "geo_blueprint": {
    "answer_block_focus": "<string>",
    "comparison_table_idea": "<string>",
    "faq_questions": ["<question>", "<question>"]
  },
  "suggested_cta": "<string>"
}
Rules:
- secondary_keywords: 2-4 items.
- key_talking_points: 3-5 items, each must include at least one E-E-A-T signal (statistic, certification, expert quote, clinical study, etc.).
- faq_questions: exactly 2-4 items.
- All enum fields must use exactly one of the listed values.
- Language of text fields must match the language parameter."""

EN_BUSINESSES = [
    ("We sell organic baby skincare products made in Vietnam.", "New mothers aged 25-35 concerned about natural ingredients."),
    ("Premium Shopify store for eco-friendly home goods.", "Environmentally conscious millennials."),
    ("Specialty coffee roastery shipping nationwide.", "Coffee enthusiasts and home baristas."),
    ("", ""),
]

VI_BUSINESSES = [
    ("Chúng tôi bán mỹ phẩm thuần chay cho phụ nữ Việt.", "Phụ nữ 20-40 tuổi quan tâm đến làm đẹp an toàn."),
    ("Shop thời trang local brand cho giới trẻ Hà Nội.", "Gen Z và Millennials yêu thích phong cách đường phố."),
    ("", ""),
]

EN_KW_SEEDS = [
    "best organic baby lotion", "eco-friendly water bottle", "how to make cold brew coffee",
    "buy sustainable yoga mat", "top rated air purifier", "pet grooming tips at home",
    "keto meal prep ideas", "best laptops under 1000", "gold necklace for women",
    "organic cotton bedding", "camping gear checklist", "minimalist home decor ideas",
]

VI_KW_SEEDS = [
    "kem dưỡng da trẻ em an toàn", "đồ gia dụng thân thiện môi trường",
    "cách pha cà phê cold brew tại nhà", "mua thảm yoga chính hãng",
    "máy lọc không khí tốt nhất", "chăm sóc thú cưng tại nhà",
    "thực đơn ăn kiêng lành mạnh", "laptop tốt giá dưới 15 triệu",
    "vòng cổ vàng nữ cao cấp", "ga gối cotton hữu cơ",
]


def build_user_kw(niche: str, lang: str, business_desc: str = "", target_customer: str = "") -> str:
    parts = [f"Niche: {niche}", f"Language: {lang}"]
    if business_desc:
        parts.append(f"Business description: {business_desc}")
    if target_customer:
        parts.append(f"Target customer: {target_customer}")
    parts.append("Generate a keyword list for this niche.")
    return "\n".join(parts)


def build_user_cb(keyword: str, niche: str, lang: str, known_intent: str = "",
                  business_desc: str = "", target_customer: str = "") -> str:
    parts = [f"Primary keyword: {keyword}", f"Niche: {niche}", f"Language: {lang}"]
    if known_intent:
        parts.append(f"Known intent: {known_intent}")
    if business_desc:
        parts.append(f"Business description: {business_desc}")
    if target_customer:
        parts.append(f"Target customer: {target_customer}")
    parts.append("Generate a content brief.")
    return "\n".join(parts)


def pick_business(lang: str):
    pool = EN_BUSINESSES if lang == "en" else VI_BUSINESSES
    biz = random.choice(pool)
    if random.random() < MISSING_CONTEXT_PROB:
        return "", ""
    return biz


def pick_keyword(lang: str) -> str:
    pool = EN_KW_SEEDS if lang == "en" else VI_KW_SEEDS
    return random.choice(pool)


def call_openai_with_retry(client, system: str, user: str, max_retries: int = 4) -> str:
    for attempt in range(max_retries):
        try:
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.8,
                max_tokens=800,
                response_format={"type": "json_object"},
            )
            return resp.choices[0].message.content
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            wait_time = (attempt + 1) * 3
            print(f"[WARN] OpenAI error: {e}. Retrying in {wait_time}s...", flush=True)
            time.sleep(wait_time)


class GeminiKeyManager:
    def __init__(self, keys: list[str], system: str):
        self.keys = keys
        self.current_idx = 0
        self.system = system
        self.model_name = "models/gemini-flash-lite-latest"
        self._init_model()

    def _init_model(self):
        import google.generativeai as genai
        current_key = self.keys[self.current_idx].strip()
        print(f"[INFO] Initializing Gemini Key {self.current_idx + 1}/{len(self.keys)} (Model: {self.model_name})...", flush=True)
        genai.configure(api_key=current_key, transport="rest")
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=self.system,
            generation_config={"response_mime_type": "application/json", "temperature": 0.8},
        )

    def rotate_to_next_key(self) -> bool:
        if self.current_idx + 1 < len(self.keys):
            self.current_idx += 1
            print(f"\n[INFO] Switching to next Gemini API Key ({self.current_idx + 1}/{len(self.keys)})...", flush=True)
            self._init_model()
            return True
        return False

    def generate_content(self, user_msg: str, max_retries: int = 5) -> str:
        for attempt in range(max_retries):
            try:
                resp = self.model.generate_content(user_msg, request_options={"timeout": 30})
                return resp.text
            except Exception as e:
                err_str = str(e).lower()
                if "quota exceeded" in err_str and "requests per day" in err_str:
                    print(f"\n[WARN] Current Key {self.current_idx + 1} reached daily limit (500).", flush=True)
                    if self.rotate_to_next_key():
                        continue
                    raise e

                if attempt == max_retries - 1:
                    raise e
                wait_time = 15 if "429" in err_str or "quota" in err_str or "resource" in err_str else (attempt + 1) * 3
                print(f"[WARN] Gemini temporary limit/error: {e}. Waiting {wait_time}s before retry {attempt + 1}/{max_retries}...", flush=True)
                time.sleep(wait_time)


def count_existing_samples(file_path: Path):
    if not file_path.exists():
        return 0, 0, 0
    en_count = 0
    vi_count = 0
    total = 0
    with file_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
                meta = rec.get("_meta", {})
                lang = meta.get("lang", "")
                if lang == "en":
                    en_count += 1
                elif lang == "vi":
                    vi_count += 1
                total += 1
            except Exception:
                pass
    return total, en_count, vi_count


def generate(task: str, out_path: Path, provider: str = "openai") -> bool:
    client = None
    gemini_mgr = None

    if provider == "openai":
        if OpenAI is None:
            raise ImportError("OpenAI SDK is not installed. Run 'pip install openai'.")
        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    else:
        raw_keys = os.environ.get("GEMINI_API_KEYS") or os.environ.get("GEMINI_API_KEY")
        if not raw_keys:
            raise ValueError("GEMINI_API_KEY or GEMINI_API_KEYS environment variable is not set.")
        key_list = [k.strip() for k in raw_keys.split(",") if k.strip()]
        system = SYSTEM_KW if task == "KEYWORD_RESEARCH" else SYSTEM_CB
        gemini_mgr = GeminiKeyManager(key_list, system)

    system = SYSTEM_KW if task == "KEYWORD_RESEARCH" else SYSTEM_CB
    out_path.parent.mkdir(parents=True, exist_ok=True)

    total_target = int(TARGET_PER_TASK * 1.22)
    target_en = int(total_target * EN_RATIO)
    target_vi = total_target - target_en

    existing_total, existing_en, existing_vi = count_existing_samples(out_path)
    if existing_total > 0:
        print(f"[INFO] Found existing data in {out_path.name}: {existing_total} samples (EN: {existing_en}, VI: {existing_vi}). Resuming...", flush=True)

    plan = [
        ("en", target_en, existing_en),
        ("vi", target_vi, existing_vi),
    ]
    sleep_between = 4.0 if provider == "gemini" else 0.5
    total_written = existing_total

    with out_path.open("a", encoding="utf-8") as f_out:
        for lang, count, already_done in plan:
            remaining = count - already_done
            lang_label = "English (US)" if lang == "en" else "Vietnamese"

            if remaining <= 0:
                print(f"[INFO] Task {task} [{lang}]: Already completed ({already_done}/{count}). Skipping.", flush=True)
                continue

            print(f"\n[INFO] Task {task}: generating {remaining} remaining samples for {lang_label} (already have {already_done}/{count})...", flush=True)

            for i in range(already_done, count):
                niche = random.choice(NICHES)
                biz_desc, target_cust = pick_business(lang)

                if task == "KEYWORD_RESEARCH":
                    user_msg = build_user_kw(niche, lang_label, biz_desc, target_cust)
                else:
                    kw = pick_keyword(lang)
                    known_intent = random.choice(INTENT_ENUM) if random.random() < 0.33 else ""
                    user_msg = build_user_cb(kw, niche, lang_label, known_intent, biz_desc, target_cust)

                try:
                    if provider == "openai":
                        assistant_raw = call_openai_with_retry(client, system, user_msg)
                    else:
                        assistant_raw = gemini_mgr.generate_content(user_msg)

                    json.loads(assistant_raw)

                    record = {
                        "messages": [
                            {"role": "system", "content": system},
                            {"role": "user", "content": user_msg},
                            {"role": "assistant", "content": assistant_raw},
                        ],
                        "_meta": {
                            "task": task,
                            "lang": lang,
                            "niche": niche,
                        }
                    }

                    f_out.write(json.dumps(record, ensure_ascii=False) + "\n")
                    f_out.flush()
                    total_written += 1

                    if (i + 1) % 5 == 0 or (i + 1) == count:
                        print(f"[INFO] Task {task} [{lang}]: {i + 1}/{count} samples (Total saved: {total_written})", flush=True)

                    time.sleep(sleep_between)

                except Exception as e:
                    err_msg = str(e)
                    if "quota exceeded" in err_msg.lower() and "requests per day" in err_msg.lower():
                        print(f"\n[ERROR] All provided Gemini API keys have reached daily limit: {e}", flush=True)
                        print(f"[INFO] Progress safely saved up to sample {total_written}. Provide additional keys to continue.", flush=True)
                        return False
                    print(f"[WARN] Sample {i} skipped due to error: {e}", flush=True)
                    continue

    print(f"\n[SUCCESS] Task {task} complete! Total {total_written} raw samples saved in {out_path}", flush=True)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic dataset for QLoRA fine-tuning")
    parser.add_argument("--task", choices=["KEYWORD_RESEARCH", "CONTENT_BRIEF", "ALL"], default="ALL")
    parser.add_argument("--out", default="../data/raw/", help="Output directory or file path")
    parser.add_argument("--provider", choices=["openai", "gemini"], default="gemini")
    args = parser.parse_args()

    out = Path(args.out)

    if args.task == "ALL":
        success_kw = generate("KEYWORD_RESEARCH", out / "keyword_research_raw.jsonl", args.provider)
        if not success_kw:
            print("\n[STOP] Task KEYWORD_RESEARCH stopped before completing. Halting pipeline until new API key is provided.")
            sys.exit(1)
        success_cb = generate("CONTENT_BRIEF", out / "content_brief_raw.jsonl", args.provider)
        if not success_cb:
            print("\n[STOP] Task CONTENT_BRIEF stopped before completing. Halting pipeline until new API key is provided.")
            sys.exit(1)
    elif args.task == "KEYWORD_RESEARCH":
        file = out if out.suffix == ".jsonl" else out / "keyword_research_raw.jsonl"
        generate("KEYWORD_RESEARCH", file, args.provider)
    else:
        file = out if out.suffix == ".jsonl" else out / "content_brief_raw.jsonl"
        generate("CONTENT_BRIEF", file, args.provider)
