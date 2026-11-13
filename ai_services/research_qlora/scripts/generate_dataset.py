"""
Module: generate_dataset.py
Description: Generates synthetic ChatML dataset for KEYWORD_RESEARCH and CONTENT_BRIEF tasks.
"""

import argparse
import json
import os
import random
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


def call_openai(client, system: str, user: str, model: str = "gpt-4o-mini") -> str:
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.8,
        max_tokens=800,
        response_format={"type": "json_object"},
    )
    return resp.choices[0].message.content


def call_gemini(system: str, user: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system,
        generation_config={"response_mime_type": "application/json", "temperature": 0.8},
    )
    resp = model.generate_content(user)
    return resp.text


def generate(task: str, out_path: Path, provider: str = "openai"):
    client = None
    if provider == "openai":
        if OpenAI is None:
            raise ImportError("OpenAI SDK is not installed. Run 'pip install openai'.")
        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    system = SYSTEM_KW if task == "KEYWORD_RESEARCH" else SYSTEM_CB
    out_path.parent.mkdir(parents=True, exist_ok=True)

    total_target = int(TARGET_PER_TASK * 1.22)
    en_count = int(total_target * EN_RATIO)
    vi_count = total_target - en_count

    samples = []
    plan = [("en", en_count), ("vi", vi_count)]

    for lang, count in plan:
        lang_label = "English (US)" if lang == "en" else "Vietnamese"
        print(f"[INFO] Task {task}: generating {count} samples for {lang_label}...")

        for i in range(count):
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
                    assistant_raw = call_openai(client, system, user_msg)
                else:
                    assistant_raw = call_gemini(system, user_msg)

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
                samples.append(record)

                if (i + 1) % 50 == 0:
                    print(f"[INFO] Progress: {i + 1}/{count} samples generated")

                time.sleep(0.3)

            except Exception as e:
                print(f"[WARN] Sample {i} skipped due to error: {e}")
                continue

    with out_path.open("w", encoding="utf-8") as f:
        for s in samples:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    print(f"[SUCCESS] Wrote {len(samples)} raw samples to {out_path}")
    return samples


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic dataset for QLoRA fine-tuning")
    parser.add_argument("--task", choices=["KEYWORD_RESEARCH", "CONTENT_BRIEF", "ALL"], default="ALL")
    parser.add_argument("--out", default="../data/raw/", help="Output directory or file path")
    parser.add_argument("--provider", choices=["openai", "gemini"], default="openai")
    args = parser.parse_args()

    out = Path(args.out)

    if args.task == "ALL":
        generate("KEYWORD_RESEARCH", out / "keyword_research_raw.jsonl", args.provider)
        generate("CONTENT_BRIEF", out / "content_brief_raw.jsonl", args.provider)
    elif args.task == "KEYWORD_RESEARCH":
        file = out if out.suffix == ".jsonl" else out / "keyword_research_raw.jsonl"
        generate("KEYWORD_RESEARCH", file, args.provider)
    else:
        file = out if out.suffix == ".jsonl" else out / "content_brief_raw.jsonl"
        generate("CONTENT_BRIEF", file, args.provider)
