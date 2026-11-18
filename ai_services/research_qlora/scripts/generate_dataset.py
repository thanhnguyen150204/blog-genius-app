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

TARGET_PER_TASK = 1350
EN_RATIO = 0.50
VI_RATIO = 0.50
MISSING_CONTEXT_PROB = 0.20

NICHES = [
    # --- Existing (giữ nguyên) ---
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
    # --- New niches (mở rộng) ---
    "Ergonomic Office & Workspace",        # Ghế công thái học, bàn đứng
    "Mechanical Keyboards & Peripherals",  # Bàn phím cơ, chuột gaming
    "Gaming Gear & Accessories",           # Gear gaming toàn diện
    "Sports & Active Lifestyle",           # Thể thao, running, yoga
    "Organic & Health Food",               # Thực phẩm sức khỏe
    "Bags & Luggage",                      # Túi xách, va ly
    "Watches & Accessories",              # Đồng hồ, phụ kiện
    "Books & Stationery",                  # Sách, văn phòng phẩm
    "Tools & DIY Hardware",                # Dụng cụ, đồ thủ công
    "Air Quality & Smart Home",            # Máy lọc không khí, smart home
    "Cycling & E-Bikes",                   # Xe đạp điện
    "Hair Care & Styling",                 # Tóc, máy sấy, lược
    "Men's Grooming",                      # Chăm sóc râu, da nam
    "Kids & Educational Toys",             # Đồ chơi giáo dục
    "Photography & Camera Gear",           # Máy ảnh, phụ kiện
    "Wireless Audio & Earbuds",            # Tai nghe không dây
    "Plant & Gardening",                   # Cây cảnh, làm vườn
    "Cooking Appliances",                  # Nồi chiên không khí, máy ép
    "Supplements & Vitamins",              # Thực phẩm bổ sung
    "Local Handicrafts Vietnam",           # Thủ công mỹ nghệ Việt
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

STRICT Intent Classification Rules (must follow exactly):
- Transactional: User wants to BUY NOW or take immediate action.
  → Triggers: mua, bán, giá, đặt hàng, order, ship, checkout, buy, price, deal, discount, coupon, add to cart, free shipping, promo, giá rẻ, giá tốt, giảm giá, khuyến mãi, chính hãng + giá.
  → Examples (EN): "buy ergonomic chair online", "mechanical keyboard price under 100", "order blue switch keyboard".
  → Examples (VI): "mua ghế công thái học giá rẻ", "giá bàn phím cơ cherry mx", "đặt mua tai nghe bluetooth chính hãng".

- Commercial: User is RESEARCHING before buying — comparison, reviews, top lists, recommendations.
  → Triggers: best, top, review, compare, vs, versus, recommended, worth it, đánh giá, so sánh, nên mua, tốt nhất, có nên, top các, phân loại, loại nào tốt.
  → Examples (EN): "best mechanical keyboard for programmers", "top ergonomic chairs under 500", "gaming headset vs earbuds comparison".
  → Examples (VI): "bàn phím cơ tốt nhất cho lập trình viên", "ghế công thái học loại nào tốt", "đánh giá tai nghe Sony WH-1000XM5".

- Informational: User wants to LEARN or understand — tutorials, guides, how-to, definitions.
  → Triggers: how to, what is, why, guide, tips, tutorial, cách, hướng dẫn, là gì, kinh nghiệm, tại sao, lý do, bí quyết, có lợi không, an toàn không.
  → Examples (EN): "how to set up ergonomic workstation", "what is mechanical keyboard actuation point", "tips for choosing gaming chair".
  → Examples (VI): "cách chọn ghế ngồi làm việc đúng tư thế", "bàn phím cơ là gì", "hướng dẫn căn chỉnh ghế công thái học".

- Navigational: User is looking for a SPECIFIC brand, store, or website.
  → Triggers: official site, brand name + store/shop/website/chính hãng, cửa hàng, trang chủ, địa chỉ mua.
  → Examples (EN): "Keychron official store", "IKEA ergonomic chair website", "Logitech Vietnam dealer".
  → Examples (VI): "cửa hàng ghế Herman Miller tại Hà Nội", "website chính hãng DXRacer", "địa chỉ mua bàn phím Durgod Việt Nam".

BALANCE RULE: Each response MUST include at least 1 keyword per intent category:
  - 2 Transactional, 2 Commercial, 2 Informational, 1 Navigational (minimum).

Additional Rules:
- keyword: 2-7 words, realistic search query style (as people actually type).
- Language of keywords must STRICTLY match the language parameter.
- If language is Vietnamese: ALL keywords must use proper Vietnamese diacritics (ệ, ổ, ắ, etc.). Do NOT output keywords in English when Vietnamese is requested."""

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

Intent → Funnel → Content Type Mapping (MUST follow strictly):
  - Informational  → TOFU → content_type: "Informational" or "How-to"       | style: "Informative" or "Instructive"  | tone: "Friendly" or "Informative"
  - Commercial     → MOFU → content_type: "Buyer's guide" or "FAQ"          | style: "Analytical" or "Persuasive"    | tone: "Authoritative" or "Formal"
  - Transactional  → BOFU → content_type: "Buyer's guide"                   | style: "Persuasive"                    | tone: "Authoritative" or "Conversational"
  - Navigational   → MOFU → content_type: "Informational" or "FAQ"          | style: "Conversational"                | tone: "Friendly"

Rules:
- secondary_keywords: 2-4 items, semantically related to the primary keyword.
- key_talking_points: 3-5 items, each must include at least one E-E-A-T signal (statistic, certification, expert quote, clinical study, test result).
- faq_questions: exactly 2-4 items, conversational questions real users would ask in AI chatbots.
- All enum fields must use exactly one of the listed values.
- Language of text fields must STRICTLY match the language parameter.
- If language is Vietnamese: ALL text fields must use proper Vietnamese diacritics. Do NOT mix English and Vietnamese."""

EN_BUSINESSES = [
    ("We sell organic baby skincare products made in Vietnam.", "New mothers aged 25-35 concerned about natural ingredients."),
    ("Premium Shopify store for eco-friendly home goods.", "Environmentally conscious millennials."),
    ("Specialty coffee roastery shipping nationwide.", "Coffee enthusiasts and home baristas."),
    ("Online store for mechanical keyboards and peripherals.", "Programmers, writers, and gaming enthusiasts who value tactile feedback."),
    ("Ergonomic office furniture Shopify store.", "Remote workers and office professionals aged 28-45 with back pain concerns."),
    ("Gaming gear and accessories e-commerce store.", "PC and console gamers aged 15-30 looking for performance upgrades."),
    ("Wireless audio and earbuds store.", "Commuters, students and music lovers who value sound quality and comfort."),
    ("Premium supplements and vitamins online store.", "Health-conscious adults aged 25-50 focused on fitness and wellness."),
    ("Vietnamese handcrafts and artisan goods.", "International buyers and domestic shoppers interested in cultural, locally-made products."),
    ("", ""),
]

VI_BUSINESSES = [
    ("Chúng tôi bán mỹ phẩm thuần chay cho phụ nữ Việt.", "Phụ nữ 20-40 tuổi quan tâm đến làm đẹp an toàn."),
    ("Shop thời trang local brand cho giới trẻ Hà Nội.", "Gen Z và Millennials yêu thích phong cách đường phố."),
    ("Cửa hàng bàn phím cơ và phụ kiện gaming chính hãng.", "Lập trình viên, game thủ và dân văn phòng yêu thích bàn phím cơ."),
    ("Shop ghế công thái học và nội thất văn phòng.", "Nhân viên văn phòng và người làm việc tại nhà có vấn đề về cột sống."),
    ("Thực phẩm bổ sung và vitamin cho sức khỏe.", "Người trưởng thành 25-50 tuổi quan tâm đến sức khỏe và thể lực."),
    ("Cửa hàng tai nghe không dây và âm thanh cao cấp.", "Sinh viên, dân văn phòng và audiophile tại Việt Nam."),
    ("Shop thú cưng và phụ kiện chó mèo.", "Chủ nuôi chó mèo tại các thành phố lớn Việt Nam."),
    ("Cửa hàng đồ gia dụng thông minh và thiết bị nhà bếp.", "Nội trợ và gia đình trẻ quan tâm đến tiện nghi và chất lượng cuộc sống."),
    ("", ""),
]

EN_KW_SEEDS = [
    # Mother & Baby
    "best organic baby lotion", "are bamboo diapers safe",
    # Ergonomic / Office
    "best ergonomic chair for programmers", "how to set up ergonomic workstation",
    "buy ergonomic chair under 500", "standing desk vs sitting desk",
    # Mechanical Keyboards
    "best mechanical keyboard for coding", "mechanical keyboard switch comparison",
    "buy tkl mechanical keyboard online", "keychron k2 review",
    # Gaming
    "best gaming headset under 100", "gaming mouse dpi settings guide",
    "buy gaming chair with lumbar support", "top gaming monitors 2026",
    # Electronics & Audio
    "best wireless earbuds for commuting", "sony wh-1000xm5 vs airpods pro",
    "how to pair bluetooth headphones", "best noise cancelling headphones",
    # Fitness
    "best protein powder for beginners", "how to start strength training",
    "buy sustainable yoga mat online", "top pre-workout supplements ranked",
    # Eco / Pet / Coffee
    "eco-friendly water bottle review", "pet grooming tips at home",
    "how to make cold brew coffee", "best specialty coffee beans 2026",
    # Fashion / Jewelry / Bedding
    "gold necklace for women gift idea", "best organic cotton bedding review",
    "how to style minimalist outfit", "top rated air purifier 2026",
]

VI_KW_SEEDS = [
    # Ghế công thái học
    "ghế công thái học tốt nhất cho dân văn phòng",
    "cách chỉnh ghế ngồi đúng tư thế",
    "mua ghế công thái học giá dưới 5 triệu",
    "ghế ergonomic loại nào tốt nhất hiện nay",
    # Bàn phím cơ
    "bàn phím cơ tốt nhất cho lập trình viên",
    "so sánh switch cherry mx đỏ và nâu",
    "mua bàn phím cơ 65% chính hãng",
    "cách bảo quản bàn phím cơ đúng cách",
    # Tai nghe
    "tai nghe không dây tốt nhất dưới 2 triệu",
    "so sánh tai nghe Sony WF-1000XM5 vs Samsung Galaxy Buds",
    "cách kết nối tai nghe bluetooth với laptop",
    "mua tai nghe chống ồn chính hãng giá rẻ",
    # Gaming
    "chuột gaming tốt nhất cho game bắn súng",
    "màn hình gaming 144hz loại nào đáng mua",
    "mua ghế gaming chính hãng Việt Nam",
    # Sức khỏe & Thực phẩm
    "collagen loại nào tốt nhất cho phụ nữ",
    "cách uống protein shake đúng cách",
    "mua thực phẩm bổ sung vitamin D chính hãng",
    # Chung
    "kem dưỡng da trẻ em an toàn cho bé sơ sinh",
    "máy lọc không khí tốt nhất 2026",
    "kinh nghiệm nuôi mèo cho người mới",
    "cách pha cà phê cold brew tại nhà",
]


def build_user_kw(niche: str, lang: str, business_desc: str = "", target_customer: str = "") -> str:
    lang_full = "Vietnamese" if lang == "vi" else "English (US)"
    parts = [f"Niche: {niche}", f"Language: {lang_full}"]
    if business_desc:
        parts.append(f"Business description: {business_desc}")
    if target_customer:
        parts.append(f"Target customer: {target_customer}")
    # Seed hint for diversity (randomly added)
    if random.random() < 0.4:
        seed = random.choice(VI_KW_SEEDS if lang == "vi" else EN_KW_SEEDS)
        parts.append(f"Seed topic hint: {seed}")
    parts.append("Generate a diverse keyword list for this niche. Include at least 2 Transactional, 2 Commercial, 2 Informational, and 1 Navigational keyword.")
    return "\n".join(parts)


def build_user_cb(keyword: str, niche: str, lang: str, known_intent: str = "",
                  business_desc: str = "", target_customer: str = "") -> str:
    lang_full = "Vietnamese" if lang == "vi" else "English (US)"
    parts = [f"Primary keyword: {keyword}", f"Niche: {niche}", f"Language: {lang_full}"]
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
        self.model_name = "gemini-2.0-flash-lite"  # Latest free-tier model
        self._client = None
        self._init_model()

    def _init_model(self):
        current_key = self.keys[self.current_idx].strip()
        print(f"[INFO] Initializing Gemini Key {self.current_idx + 1}/{len(self.keys)} (Model: {self.model_name})...", flush=True)
        try:
            # Try new google.genai SDK first
            from google import genai
            from google.genai import types
            self._client = genai.Client(api_key=current_key)
            self._use_new_sdk = True
        except ImportError:
            # Fallback to deprecated google.generativeai
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=current_key, transport="rest")
            self._legacy_model = genai_legacy.GenerativeModel(
                model_name="models/gemini-1.5-flash",
                system_instruction=self.system,
                generation_config={"response_mime_type": "application/json", "temperature": 0.8},
            )
            self._use_new_sdk = False

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
                if self._use_new_sdk:
                    from google.genai import types
                    resp = self._client.models.generate_content(
                        model=self.model_name,
                        contents=user_msg,
                        config=types.GenerateContentConfig(
                            system_instruction=self.system,
                            response_mime_type="application/json",
                            temperature=0.8,
                        ),
                    )
                    return resp.text
                else:
                    resp = self._legacy_model.generate_content(user_msg, request_options={"timeout": 30})
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
                    user_msg = build_user_kw(niche, lang, biz_desc, target_cust)
                else:
                    kw = pick_keyword(lang)
                    # Provide known_intent 60% of the time to teach the mapping explicitly
                    known_intent = random.choice(INTENT_ENUM) if random.random() < 0.60 else ""
                    user_msg = build_user_cb(kw, niche, lang, known_intent, biz_desc, target_cust)

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
