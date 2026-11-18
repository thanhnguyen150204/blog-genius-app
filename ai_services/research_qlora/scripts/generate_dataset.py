"""
Module: generate_dataset.py (v2 — Clean, Zero-Mismatch, Task1->Task2 Pipeline)
Description: Generates high-purity bilingual (50% EN / 50% VI) ChatML dataset for:
  - Task 1: KEYWORD_RESEARCH (diverse topics, strict intent rules, balanced 4 intents)
  - Task 2: CONTENT_BRIEF (draws unique primary keywords & true intents directly from Task 1)
Features:
  - Matched NICHE_PROFILES (100% alignment between Niche/Topic, Business Desc, and Target Customer)
  - Teacher-to-Student prompt distillation (detailed generation rules for Gemini; concise identical prompt for Qwen2.5-1.5B)
  - Real-time quality gate (blocks English bleed in VI, invalid enums, and Intent<->Funnel contradictions)
  - Dual-key round-robin rotation + crash-resilient auto-resume
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

# ==============================================================================
# CONFIGURATION
# ==============================================================================
TARGET_PER_TASK = 1200   # 1200 KW + 1200 CB = 2400 clean bilingual samples
EN_RATIO = 0.50          # 600 EN per task
VI_RATIO = 0.50          # 600 VI per task
MISSING_CONTEXT_PROB = 0.50  # 50% without biz context (matches real UI usage)

INTENT_ENUM = ["Informational", "Commercial", "Transactional", "Navigational"]
FUNNEL_ENUM = ["TOFU", "MOFU", "BOFU"]
CONTENT_TYPE_ENUM = ["Informational", "Buyer's guide", "How-to", "FAQ"]
STYLE_ENUM = ["Informative", "Analytical", "Instructive", "Persuasive", "Conversational"]
TONE_ENUM = ["Authoritative", "Caring", "Friendly", "Informative", "Formal", "Conversational"]

VI_DIACRITICS = set(
    "àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹỵ"
    "ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỶỸỴ"
)

# ==============================================================================
# STUDENT SYSTEM PROMPTS (Saved in train_v2.jsonl AND used verbatim in serve.py)
# ==============================================================================
SYSTEM_KW = """You are an expert SEO & GEO (Generative Engine Optimization) analyst for Shopify e-commerce blogs.
Given a niche or topic, language, and optional business context, return ONLY a JSON object (no markdown, no explanation) in this exact schema:
{
  "keywords": [
    { "keyword": "<string>", "intent": "Informational | Commercial | Transactional | Navigational" }
  ]
}
Rules:
- Return 6-9 keyword objects covering diverse search intents.
- keyword: 2-7 words, natural search query style with accurate spelling and full diacritics.
- intent must strictly follow these rules:
  * Transactional: explicit buying, ordering, pricing, or deal intent (buy, order, price, deal, discount, mua, bán, giá, đặt mua, khuyến mãi, báo giá).
  * Commercial: comparing, reviewing, or researching products before buying (best, top, review, vs, compare, đánh giá, so sánh, tốt nhất, nên mua, loại nào tốt, product + audience/budget).
  * Informational: learning, how-to guides, tips, definitions, troubleshooting (how to, what is, why, tips, guide, cách, hướng dẫn, là gì, tại sao, kinh nghiệm, bảo quản).
  * Navigational: searching for a specific brand, official website, or store location (official store, website, login, cửa hàng, đại lý chính hãng, trang chủ + brand name).
- No volume, KD, or CPC fields — only keyword + intent.
- Language of keywords must strictly match the Language parameter."""

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
- secondary_keywords: 2-4 semantically related keywords.
- key_talking_points: 3-5 items, each containing an E-E-A-T signal (stat, study, certification, or expert benchmark).
- faq_questions: 2-4 conversational AI-search questions.
- Intent-to-Funnel alignment: Informational->TOFU, Commercial->MOFU, Transactional->BOFU, Navigational->MOFU or BOFU.
- If Known intent is provided, dominant_intent must match it.
- All enum fields must use exactly one listed value.
- Language of all text fields must strictly match the Language parameter with accurate spelling and diacritics."""

# ==============================================================================
# TEACHER EXTRA INSTRUCTIONS (Sent ONLY to Gemini API for ultra-clean generation)
# ==============================================================================
TEACHER_KW_EXTRA = """

ADDITIONAL GENERATION INSTRUCTIONS (Teacher Guidance):
- Produce exactly 7-8 keyword objects per response.
- Distribution per response MUST include:
  * 2 Transactional keywords (must clearly contain buy/order/price/deal or mua/giá/đặt mua/báo giá/khuyến mãi)
  * 2 Commercial keywords (must be review/compare/top/best/product+audience, e.g. "bàn phím cơ cho lập trình viên", "best ergonomic chair under 500")
  * 2 Informational keywords (must be how-to/what-is/guide/tips/cách/hướng dẫn/là gì/kinh nghiệm sử dụng)
  * 1-2 Navigational keywords (MUST include a real, recognizable brand name + store/official/website/cửa hàng/trang chủ, e.g. "cửa hàng ghế Sihoo chính hãng", "Keychron official store"). NEVER label a generic product phrase as Navigational!
- Every single keyword must be directly relevant to the exact Niche/Topic provided.
- If Language is Vietnamese: 100% natural, accurate Vietnamese spelling with complete diacritics. Zero typos, zero missing accents, zero unaccented text."""

TEACHER_CB_EXTRA = """

ADDITIONAL GENERATION INSTRUCTIONS (Teacher Guidance):
- Strictly enforce Intent -> Funnel -> ContentType mapping:
  * Informational -> TOFU -> "Informational" or "How-to" (style: Informative/Instructive, tone: Friendly/Informative)
  * Commercial -> MOFU -> "Buyer's guide" or "FAQ" (style: Analytical/Persuasive, tone: Authoritative/Informative)
  * Transactional -> BOFU -> "Buyer's guide" (style: Persuasive, tone: Authoritative/Conversational)
  * Navigational -> MOFU or BOFU -> "Informational" or "FAQ" (style: Conversational/Informative, tone: Friendly/Formal)
- Keep all text concise, specific, and high-value (~220-320 words total across all JSON fields so the brief is crisp and scannable).
- If Language is Vietnamese: write ALL text fields (secondary_keywords, target_audience, key_talking_points, geo_blueprint, suggested_cta) in 100% natural, idiomatic Vietnamese with accurate diacritics. Keep enum values in exact English as specified in the schema."""

# ==============================================================================
# 30 ALIGNED NICHE PROFILES (Matched Topics + Matched Business & Target Customer)
# ==============================================================================
NICHE_PROFILES = [
    {
        "id": "ergonomic_office",
        "en_topics": ["Ergonomic Office Chair", "Standing Desk", "Ergonomic Workspace Setup", "Monitor Arm & Desk Accessories", "Lumbar Support Cushion"],
        "vi_topics": ["Ghế công thái học", "Bàn nâng hạ thông minh", "Góc làm việc công thái học", "Giá đỡ màn hình công thái học", "Đệm tựa lưng văn phòng"],
        "en_biz": [
            ("Ergonomic office furniture Shopify store focused on posture health.", "Remote workers, software engineers, and office professionals aged 25-45."),
            ("Modern home-office gear brand with 5-year structural warranty.", "Work-from-home professionals seeking back-pain relief."),
        ],
        "vi_biz": [
            ("Cửa hàng ghế công thái học và bàn nâng hạ chính hãng bảo hành 5 năm.", "Lập trình viên, nhân viên văn phòng 24-40 tuổi ngồi làm việc trên 8 tiếng/ngày."),
            ("Thương hiệu nội thất văn phòng chuẩn Ergonomic tại Việt Nam.", "Người làm việc tại nhà (WFH) quan tâm bảo vệ cột sống và cổ vai gáy."),
        ],
    },
    {
        "id": "mechanical_keyboards",
        "en_topics": ["Mechanical Keyboard", "Wireless Mechanical Keyboard", "Custom Keycaps & Switches", "Ergonomic Split Keyboard", "Low-Profile Mechanical Keyboard"],
        "vi_topics": ["Bàn phím cơ không dây", "Bàn phím không dây", "Bàn phím cơ cho lập trình viên", "Keycap và switch bàn phím cơ", "Chuột công thái học không dây"],
        "en_biz": [
            ("Specialty store for custom mechanical keyboards, switches, and PBT keycaps.", "Programmers, writers, and keyboard enthusiasts valuing typing feel."),
            ("Wireless desk-setup peripherals brand for productivity.", "Tech professionals and Mac/Windows power users."),
        ],
        "vi_biz": [
            ("Shop chuyên bàn phím cơ custom, bàn phím bluetooth và phụ kiện setup.", "Lập trình viên, designer và dân văn phòng yêu thích cảm giác gõ phím."),
            ("Cửa hàng phân phối bàn phím không dây Keychron, Akko, Logitech chính hãng.", "Sinh viên IT và nhân viên văn phòng trẻ 20-35 tuổi."),
        ],
    },
    {
        "id": "wireless_audio",
        "en_topics": ["Noise Cancelling Headphones", "True Wireless Earbuds", "Bluetooth Speaker", "Studio Monitoring Headphones", "Bone Conduction Earphones"],
        "vi_topics": ["Tai nghe chống ồn chủ động", "Tai nghe bluetooth không dây", "Loa bluetooth di động", "Tai nghe chụp tai cho dân văn phòng", "Tai nghe thể thao chống nước"],
        "en_biz": [
            ("Hi-Fi wireless audio and ANC headphones Shopify store.", "Commuters, audiophiles, and remote workers needing deep focus."),
        ],
        "vi_biz": [
            ("Cửa hàng âm thanh chính hãng chuyên tai nghe chống ồn và loa di động.", "Dân văn phòng, sinh viên và người yêu nhạc tại các thành phố lớn."),
        ],
    },
    {
        "id": "gaming_gear",
        "en_topics": ["Wireless Gaming Mouse", "Gaming Headset", "144Hz Gaming Monitor", "Gaming Chair", "RGB Desk Mat & Accessories"],
        "vi_topics": ["Chuột gaming không dây", "Tai nghe chơi game có mic", "Màn hình gaming 144Hz", "Ghế gaming chống đau lưng", "Phụ kiện gaming gear"],
        "en_biz": [
            ("Competitive esports gaming peripherals e-commerce store.", "PC gamers aged 16-32 looking for ultra-low latency hardware."),
        ],
        "vi_biz": [
            ("Shop Gaming Gear chính hãng cho game thủ FPS và MOBA.", "Game thủ PC, streamer và học sinh sinh viên 16-30 tuổi."),
        ],
    },
    {
        "id": "skincare_beauty",
        "en_topics": ["Vegan Skincare", "Mineral Sunscreen for Oily Skin", "Retinol Anti-Aging Serum", "Gentle Hydrating Cleanser", "Niacinamide Serum"],
        "vi_topics": ["Kem chống nắng cho da dầu mụn", "Mỹ phẩm thuần chay", "Serum phục hồi da nhạy cảm", "Sữa rửa mặt dịu nhẹ", "Kem dưỡng ẩm cho da khô"],
        "en_biz": [
            ("Dermatologist-tested vegan skincare brand made with botanical actives.", "Women aged 22-40 with sensitive or acne-prone skin."),
        ],
        "vi_biz": [
            ("Thương hiệu mỹ phẩm thuần chay an toàn lành tính cho làn da Việt.", "Phụ nữ 20-38 tuổi quan tâm chăm sóc da khoa học, không kích ứng."),
        ],
    },
    {
        "id": "mother_baby",
        "en_topics": ["Organic Baby Lotion", "Bamboo Compostable Diapers", "Electric Breast Pump", "Lightweight Baby Stroller", "Organic Cotton Newborn Onesies"],
        "vi_topics": ["Tã bỉm hữu cơ cho bé sơ sinh", "Kem dưỡng ẩm cho trẻ sơ sinh", "Máy hút sữa điện rảnh tay", "Xe đẩy gấp gọn cho bé", "Quần áo cotton hữu cơ cho bé"],
        "en_biz": [
            ("GOTS & OEKO-TEX certified organic baby care Shopify store.", "Expectant and new parents aged 25-38 prioritizing non-toxic baby essentials."),
        ],
        "vi_biz": [
            ("Cửa hàng mẹ và bé chuyên sản phẩm hữu cơ đạt chứng nhận an toàn quốc tế.", "Mẹ bầu và mẹ bỉm sữa 25-36 tuổi kỹ tính trong việc chọn đồ cho trẻ sơ sinh."),
        ],
    },
    {
        "id": "kitchen_appliances",
        "en_topics": ["Air Fryer", "Espresso Coffee Machine", "Cold Press Juicer", "Cast Iron Cookware", "Electric Gooseneck Kettle"],
        "vi_topics": ["Nồi chiên không dầu", "Máy ép chậm hoa quả", "Máy pha cà phê espresso gia đình", "Chảo gang chống dính tự nhiên", "Máy làm sữa hạt đa năng"],
        "en_biz": [
            ("Modern kitchen appliances Shopify store for healthy home cooking.", "Busy families and home cooks aged 28-48."),
        ],
        "vi_biz": [
            ("Cửa hàng gia dụng nhà bếp thông minh chuẩn Châu Âu.", "Gia đình trẻ và người nội trợ yêu thích nấu ăn lành mạnh, tiết kiệm thời gian."),
        ],
    },
    {
        "id": "smart_home_air",
        "en_topics": ["HEPA Air Purifier", "Robot Vacuum & Mop", "Smart LED Desk Lamp", "Dehumidifier for Bedroom", "Smart Home Security Camera"],
        "vi_topics": ["Máy lọc không khí gia đình", "Robot hút bụi lau nhà tự động", "Máy hút ẩm phòng ngủ", "Đèn bàn học chống cận thông minh", "Camera an ninh wifi trong nhà"],
        "en_biz": [
            ("Smart home appliances brand specializing in indoor air quality and automation.", "Urban homeowners and parents living in high-pollution cities."),
        ],
        "vi_biz": [
            ("Hệ thống bán lẻ thiết bị nhà thông minh và máy lọc không khí HEPA.", "Các hộ gia đình chung cư tại Hà Nội và TP.HCM quan tâm sức khỏe hô hấp."),
        ],
    },
    {
        "id": "coffee_tea",
        "en_topics": ["Specialty Arabica Coffee Beans", "Cold Brew Coffee Maker", "Ceremonial Matcha Powder", "Vietnamese Robusta Coffee", "Organic Herbal Tea"],
        "vi_topics": ["Cà phê rang xay nguyên chất", "Cách pha cà phê cold brew", "Bột trà xanh matcha Nhật Bản", "Cà phê đặc sản Arabica Cầu Đất", "Trà thảo mộc giúp ngủ ngon"],
        "en_biz": [
            ("Small-batch specialty coffee roastery shipping freshly roasted beans nationwide.", "Home baristas and specialty coffee lovers aged 24-45."),
        ],
        "vi_biz": [
            ("Xưởng rang cà phê đặc sản Việt Nam rang mới mỗi ngày từ nông trại Đà Lạt.", "Người yêu cà phê pha máy, pha phin và pour-over tại nhà."),
        ],
    },
    {
        "id": "fitness_supplements",
        "en_topics": ["Whey Protein Isolate", "Creatine Monohydrate", "Sustainable Yoga Mat", "Adjustable Dumbbells", "Collagen Peptides Supplement"],
        "vi_topics": ["Whey protein tăng cơ giảm mỡ", "Thảm tập yoga chống trượt", "Thực phẩm bổ sung collagen cho nữ", "Vitamin tổng hợp tăng đề kháng", "Dây kháng lực tập gym tại nhà"],
        "en_biz": [
            ("Clean-label sports nutrition and home workout gear Shopify store.", "Gym-goers, runners, and fitness beginners aged 20-45."),
        ],
        "vi_biz": [
            ("Cửa hàng thực phẩm bổ sung thể hình và dụng cụ tập gym chính hãng.", "Người tập gym, yoga và chạy bộ 20-40 tuổi quan tâm vóc dáng và sức khỏe."),
        ],
    },
    {
        "id": "fashion_local_brand",
        "en_topics": ["Linen Summer Clothing", "Minimalist Streetwear Hoodie", "Sustainable Bamboo T-Shirt", "Tailored Office Trousers", "Waterproof Windbreaker Jacket"],
        "vi_topics": ["Áo thun local brand chất dày", "Quần áo vải linen thoáng mát", "Áo khoác gió chống nước", "Thời trang công sở tối giản", "Áo polo nam cao cấp"],
        "en_biz": [
            ("Direct-to-consumer sustainable fashion brand using OEKO-TEX natural fabrics.", "Style-conscious millennials seeking timeless capsule wardrobe pieces."),
        ],
        "vi_biz": [
            ("Thương hiệu thời trang local brand thiết kế tối giản sản xuất tại Việt Nam.", "Gen Z và Millennials 18-32 tuổi yêu thích phong cách năng động, bền vững."),
        ],
    },
    {
        "id": "bedding_sleep",
        "en_topics": ["Organic Cotton Bedding", "Natural Latex Pillow", "Cooling Bamboo Bed Sheets", "Weighted Blanket for Anxiety", "Memory Foam Mattress Topper"],
        "vi_topics": ["Chăn ga gối tencel mát lạnh", "Gối cao su thiên nhiên chống đau cổ", "Đệm cao su non cho người đau lưng", "Ga giường cotton hữu cơ", "Chăn hè thoáng khí"],
        "en_biz": [
            ("Luxury sleep essentials brand crafting breathable organic bedding.", "Hot sleepers and couples investing in deeper restorative sleep."),
        ],
        "vi_biz": [
            ("Thương hiệu chăn ga gối đệm thiên nhiên tối ưu giấc ngủ sâu.", "Gia đình trẻ và người thường xuyên mất ngủ, đau mỏi vai gáy."),
        ],
    },
    {
        "id": "pet_care",
        "en_topics": ["Grain-Free Cat Food", "Automatic Pet Feeder", "Self-Cleaning Cat Litter Box", "Hypoallergenic Dog Shampoo", "Interactive Dog Chew Toys"],
        "vi_topics": ["Thức ăn hạt cho mèo triệt sản", "Cát vệ sinh cho mèo khử mùi", "Máy cho thú cưng ăn tự động", "Sữa tắm cho chó lông trắng", "Pate dinh dưỡng cho mèo con"],
        "en_biz": [
            ("Holistic pet nutrition and smart pet-care accessories Shopify store.", "Devoted dog and cat owners aged 22-45 in urban apartments."),
        ],
        "vi_biz": [
            ("Pet shop chuyên thức ăn dinh dưỡng và phụ kiện chăm sóc chó mèo nhập khẩu.", "Chủ nuôi thú cưng trẻ tuổi tại các đô thị lớn coi thú cưng như thành viên gia đình."),
        ],
    },
    {
        "id": "eco_living",
        "en_topics": ["Insulated Stainless Water Bottle", "Reusable Beeswax Food Wraps", "Zero-Waste Dishwashing Kit", "Bamboo Toothbrush Set", "Compostable Trash Bags"],
        "vi_topics": ["Bình giữ nhiệt inox 304", "Ống hút tre và đồ dùng thân thiện môi trường", "Nước rửa chén hữu cơ an toàn da tay", "Túi vải canvas tái sử dụng", "Bàn chải đánh răng bằng tre"],
        "en_biz": [
            ("Plastic-free eco-living Shopify store curated for zero-waste households.", "Environmentally conscious millennials and Gen Z shoppers."),
        ],
        "vi_biz": [
            ("Cửa hàng lối sống xanh chuyên đồ gia dụng tái sử dụng và sản phẩm hữu cơ.", "Người tiêu dùng trẻ 22-38 tuổi hướng tới giảm thiểu rác thải nhựa."),
        ],
    },
    {
        "id": "outdoor_travel",
        "en_topics": ["Ultralight Camping Tent", "Waterproof Hiking Backpack", "Carry-On Hardshell Luggage", "Portable Camping Stove", "Trail Running Shoes"],
        "vi_topics": ["Lều cắm trại tự bung chống mưa", "Balo du lịch chống nước", "Vali kéo cabin siêu nhẹ", "Giày leo núi chống trơn trượt", "Bàn ghế gấp gọn đi cắm trại"],
        "en_biz": [
            ("Technical outdoor gear and adventure travel equipment store.", "Weekend campers, backpackers, and frequent travelers aged 22-45."),
        ],
        "vi_biz": [
            ("Cửa hàng đồ cắm trại glamping và phụ kiện du lịch phượt chính hãng.", "Giới trẻ yêu thích trekking, camping cuối tuần và du lịch trải nghiệm."),
        ],
    },
    {
        "id": "home_decor",
        "en_topics": ["Soy Wax Scented Candles", "Minimalist Wall Art Prints", "Ceramic Vase & Tableware", "Indoor Low-Light Plants", "Nordic Floor Lamp"],
        "vi_topics": ["Nến thơm tinh dầu thiên nhiên", "Đồ gốm sứ thủ công trang trí", "Đèn ngủ để bàn phong cách tối giản", "Tranh canvas treo tường phòng khách", "Cây cảnh lọc không khí trong nhà"],
        "en_biz": [
            ("Artisan home decor and natural fragrance Shopify store.", "Apartment dwellers and homeowners decorating modern minimalist spaces."),
        ],
        "vi_biz": [
            ("Tiệm decor nhà cửa và nến thơm thủ công phong cách tối giản Bắc Âu.", "Người trẻ 23-38 tuổi thích trang trí căn hộ và tạo không gian sống thư giãn."),
        ],
    },
    {
        "id": "jewelry_gifts",
        "en_topics": ["925 Sterling Silver Necklace", "Personalized Birthstone Ring", "Minimalist Gold Hoop Earrings", "Handcrafted Leather Wallet", "Luxury Corporate Gift Box"],
        "vi_topics": ["Dây chuyền bạc 925 nữ", "Quà tặng sinh nhật cho bạn gái", "Ví da thật thủ công cho nam", "Vòng tay phong thủy tự nhiên", "Set quà tặng doanh nghiệp cao cấp"],
        "en_biz": [
            ("Fine demi-jewelry and personalized gift boutique with gift-ready packaging.", "Shoppers aged 22-45 buying meaningful anniversary and birthday gifts."),
        ],
        "vi_biz": [
            ("Thương hiệu trang sức bạc thủ công và hộp quà tặng cá nhân hóa.", "Khách hàng tìm kiếm quà tặng tinh tế dịp lễ, sinh nhật và kỷ niệm."),
        ],
    },
    {
        "id": "hair_mens_grooming",
        "en_topics": ["Sulfate-Free Hair Loss Shampoo", "Ionic Hair Dryer", "Natural Beard Oil", "Matte Hair Clay Pomade", "Men's Daily Facial Cleanser"],
        "vi_topics": ["Dầu gội ngăn rụng tóc thảo dược", "Máy sấy tóc ion âm bảo vệ tóc", "Sáp vuốt tóc nam giữ nếp tự nhiên", "Sữa rửa mặt kiểm soát dầu cho nam", "Tinh dầu dưỡng tóc phục hồi hư tổn"],
        "en_biz": [
            ("Botanical hair-care and men's grooming Shopify store.", "Men and women aged 22-45 addressing hair thinning and daily styling."),
        ],
        "vi_biz": [
            ("Cửa hàng chăm sóc tóc thảo dược và mỹ phẩm nam giới chính hãng.", "Khách hàng 22-42 tuổi tìm giải pháp giảm rụng tóc và chăm sóc cá nhân gọn nhẹ."),
        ],
    },
    {
        "id": "kids_toys_stationery",
        "en_topics": ["Wooden Montessori Toys", "STEM Robotics Kit for Kids", "Dot Grid Bullet Journal", "Ergonomic Fountain Pen", "Magnetic Building Tiles"],
        "vi_topics": ["Đồ chơi gỗ Montessori cho bé", "Đồ chơi lắp ráp phát triển tư duy", "Sổ tay kế hoạch planner", "Bút máy luyện chữ đẹp", "Đèn học chống cận cho học sinh"],
        "en_biz": [
            ("Screen-free educational wooden toys and creative stationery store.", "Parents of children aged 2-10 and students who love journaling."),
        ],
        "vi_biz": [
            ("Cửa hàng đồ chơi giáo dục sớm an toàn và văn phòng phẩm sáng tạo.", "Phụ huynh có con nhỏ 2-10 tuổi và học sinh sinh viên thích ghi chép kế hoạch."),
        ],
    },
    {
        "id": "healthy_organic_food",
        "en_topics": ["Organic Granola Low Sugar", "Cold-Pressed Olive Oil", "Keto Nut Butter", "Raw Manuka Honey", "Plant-Based Protein Bars"],
        "vi_topics": ["Ngũ cốc granola ăn kiêng không đường", "Hạt dinh dưỡng mix cho bà bầu", "Mật ong rừng nguyên chất", "Bánh gạo lứt ăn kiêng giảm cân", "Sữa hạt thực vật không đường"],
        "en_biz": [
            ("Clean-eating pantry and organic superfood Shopify store.", "Health-conscious families, keto dieters, and busy office workers."),
        ],
        "vi_biz": [
            ("Cửa hàng thực phẩm Eat Clean và hạt dinh dưỡng không chất bảo quản.", "Người theo chế độ ăn kiêng lành mạnh, dân văn phòng và mẹ bầu."),
        ],
    },
    {
        "id": "photography_mobile",
        "en_topics": ["Mirrorless Camera for Beginners", "MagSafe Wireless Power Bank", "GaN 65W Fast Charger", "Smartphone Gimbal Stabilizer", "USB-C Multiport Hub"],
        "vi_topics": ["Sạc dự phòng không dây MagSafe", "Củ sạc nhanh GaN 65W", "Tay cầm chống rung gimbal điện thoại", "Máy ảnh mirrorless cho người mới", "Hub chuyển đổi USB-C cho MacBook"],
        "en_biz": [
            ("Creator gear and mobile charging accessories Shopify store.", "Content creators, vloggers, and remote tech workers."),
        ],
        "vi_biz": [
            ("Cửa hàng phụ kiện công nghệ, sạc nhanh và thiết bị quay dựng vlog chính hãng.", "Content creator, sinh viên và người dùng laptop/điện thoại cao cấp."),
        ],
    },
    {
        "id": "running_cycling",
        "en_topics": ["Cushioned Marathon Running Shoes", "Electric Commuter Bike", "GPS Sports Smartwatch", "Cycling Helmet with MIPS", "Anti-Blister Running Socks"],
        "vi_topics": ["Giày chạy bộ êm chân cho người mới", "Đồng hồ thông minh theo dõi thể thao", "Xe đạp trợ lực điện đi làm", "Mũ bảo hiểm xe đạp thể thao", "Quần áo chạy bộ thoáng khí"],
        "en_biz": [
            ("Endurance running and urban e-bike gear Shopify store.", "Amateur runners, cyclists, and active urban commuters aged 24-48."),
        ],
        "vi_biz": [
            ("Shop chuyên giày chạy bộ, đồng hồ GPS thể thao và xe đạp trợ lực.", "Cộng đồng chạy bộ marathon và người đạp xe rèn luyện sức khỏe tại Việt Nam."),
        ],
    },
    {
        "id": "vietnamese_handicrafts",
        "en_topics": ["Handmade Rattan Storage Baskets", "Vietnamese Lacquerware Tray", "Bat Trang Ceramic Tea Set", "Handwoven Silk Scarf", "Natural Loofah Body Scrubber"],
        "vi_topics": ["Bộ ấm trà gốm sứ Bát Tràng", "Giỏ mây tre đan thủ công", "Khăn lụa tơ tằm tự nhiên", "Đồ sơn mài mỹ nghệ làm quà tặng", "Đồ thủ công mỹ nghệ Việt Nam"],
        "en_biz": [
            ("Fair-trade Vietnamese artisan homeware and handcrafted decor store.", "Global buyers appreciating sustainable handwoven craftsmanship."),
        ],
        "vi_biz": [
            ("Cửa hàng đồ thủ công mỹ nghệ làng nghề truyền thống Việt Nam.", "Khách hàng yêu thích sản phẩm tự nhiên, tinh xảo để trang trí hoặc biếu tặng."),
        ],
    },
]

# ==============================================================================
# HELPER FUNCTIONS & QUALITY GATE
# ==============================================================================
def has_vietnamese_diacritics(text: str) -> bool:
    return any(ch in VI_DIACRITICS for ch in text)


def build_user_kw(topic: str, lang: str, business_desc: str = "", target_customer: str = "") -> str:
    lang_full = "Vietnamese" if lang == "vi" else "English (US)"
    parts = [f"Niche: {topic}", f"Language: {lang_full}"]
    if business_desc:
        parts.append(f"Business description: {business_desc}")
    if target_customer:
        parts.append(f"Target customer: {target_customer}")
    parts.append("Generate a keyword list for this niche.")
    return "\n".join(parts)


def build_user_cb(
    keyword: str,
    topic: str,
    lang: str,
    known_intent: str = "",
    business_desc: str = "",
    target_customer: str = "",
) -> str:
    lang_full = "Vietnamese" if lang == "vi" else "English (US)"
    parts = [f"Primary keyword: {keyword}", f"Niche: {topic}", f"Language: {lang_full}"]
    if known_intent:
        parts.append(f"Known intent: {known_intent}")
    if business_desc:
        parts.append(f"Business description: {business_desc}")
    if target_customer:
        parts.append(f"Target customer: {target_customer}")
    parts.append("Generate a content brief.")
    return "\n".join(parts)


def sample_niche_context(lang: str):
    profile = random.choice(NICHE_PROFILES)
    topic = random.choice(profile["vi_topics"] if lang == "vi" else profile["en_topics"])
    if random.random() < MISSING_CONTEXT_PROB:
        biz_desc, target_cust = "", ""
    else:
        biz_pool = profile["vi_biz"] if lang == "vi" else profile["en_biz"]
        biz_desc, target_cust = random.choice(biz_pool)
    return profile["id"], topic, biz_desc, target_cust


def check_kw_quality(obj: dict, lang: str) -> tuple[bool, str]:
    if not isinstance(obj, dict):
        return False, "not a dict"
    kws = obj.get("keywords")
    if not isinstance(kws, list) or not (5 <= len(kws) <= 10):
        return False, f"expected 5-10 keywords, got {len(kws) if isinstance(kws, list) else type(kws)}"

    intents_seen = set()
    vi_missing_diacritics = 0
    for item in kws:
        if not isinstance(item, dict):
            return False, "keyword item not dict"
        kw = str(item.get("keyword", "")).strip()
        intent = item.get("intent", "")
        if not kw or intent not in INTENT_ENUM:
            return False, f"invalid keyword or intent: {item}"
        intents_seen.add(intent)

        kw_l = kw.lower()
        if lang == "vi" and not has_vietnamese_diacritics(kw):
            vi_missing_diacritics += 1

        # Block glaring intent contradictions
        if any(kw_l.startswith(p) for p in ["cách ", "hướng dẫn ", "how to ", "what is ", "why "]) and intent != "Informational":
            return False, f"how-to keyword mislabeled as {intent}: {kw}"
        if any(kw_l.startswith(p) for p in ["mua ", "đặt mua ", "buy ", "order "]) and intent == "Informational":
            return False, f"buy keyword mislabeled as Informational: {kw}"

    if lang == "vi" and vi_missing_diacritics > 1:
        return False, f"too many VI keywords missing diacritics ({vi_missing_diacritics})"
    if len(intents_seen) < 3:
        return False, f"low intent diversity: {intents_seen}"

    return True, "ok"


def check_cb_quality(obj: dict, lang: str, known_intent: str = "") -> tuple[bool, str]:
    if not isinstance(obj, dict):
        return False, "not a dict"

    for f in ["primary_keyword", "target_audience", "suggested_cta"]:
        if not isinstance(obj.get(f), str) or not obj[f].strip():
            return False, f"missing {f}"

    di = obj.get("dominant_intent")
    fs = obj.get("funnel_stage")
    if di not in INTENT_ENUM:
        return False, f"invalid dominant_intent: {di}"
    if known_intent and di != known_intent:
        return False, f"dominant_intent ({di}) != known_intent ({known_intent})"
    if fs not in FUNNEL_ENUM:
        return False, f"invalid funnel_stage: {fs}"
    if obj.get("recommended_content_type") not in CONTENT_TYPE_ENUM:
        return False, f"invalid content_type: {obj.get('recommended_content_type')}"
    if obj.get("recommended_style") not in STYLE_ENUM:
        return False, f"invalid style: {obj.get('recommended_style')}"
    if obj.get("recommended_tone") not in TONE_ENUM:
        return False, f"invalid tone: {obj.get('recommended_tone')}"

    # Intent <-> Funnel strict consistency
    if di == "Informational" and fs != "TOFU":
        return False, f"Informational must be TOFU, got {fs}"
    if di == "Commercial" and fs != "MOFU":
        return False, f"Commercial must be MOFU, got {fs}"
    if di == "Transactional" and fs != "BOFU":
        return False, f"Transactional must be BOFU, got {fs}"
    if di == "Navigational" and fs not in {"MOFU", "BOFU"}:
        return False, f"Navigational must be MOFU/BOFU, got {fs}"

    sec = obj.get("secondary_keywords", [])
    pts = obj.get("key_talking_points", [])
    geo = obj.get("geo_blueprint", {})
    if not isinstance(sec, list) or len(sec) < 2:
        return False, "secondary_keywords < 2"
    if not isinstance(pts, list) or len(pts) < 3:
        return False, "key_talking_points < 3"
    if not isinstance(geo, dict):
        return False, "geo_blueprint not dict"
    if not geo.get("answer_block_focus") or not geo.get("comparison_table_idea"):
        return False, "geo_blueprint fields missing"
    faqs = geo.get("faq_questions", [])
    if not isinstance(faqs, list) or len(faqs) < 2:
        return False, "faq_questions < 2"

    if lang == "vi":
        check_blob = " ".join([
            obj["target_audience"],
            obj["suggested_cta"],
            geo["answer_block_focus"],
            " ".join(str(x) for x in pts[:2]),
        ])
        if not has_vietnamese_diacritics(check_blob):
            return False, "VI content brief missing Vietnamese diacritics"

    return True, "ok"


# ==============================================================================
# GEMINI MULTI-KEY ROUND-ROBIN MANAGER (google-genai SDK + legacy fallback)
# ==============================================================================
class GeminiKeyManager:
    def __init__(self, keys: list[str], teacher_system: str, model_name: str = "gemini-3.5-flash-lite"):
        self.keys = [k.strip() for k in keys if k.strip()]
        self.active_indices = list(range(len(self.keys)))
        self.rr_cursor = 0
        self.teacher_system = teacher_system
        self.model_name = model_name
        self._clients = {}
        self._use_new_sdk = True
        self._init_clients()

    def _init_clients(self):
        try:
            from google import genai
            for idx, key in enumerate(self.keys):
                self._clients[idx] = genai.Client(api_key=key)
            self._use_new_sdk = True
            print(f"[INFO] Initialized {len(self.keys)} Gemini key(s) via google-genai SDK (Model: {self.model_name})", flush=True)
        except ImportError:
            import google.generativeai as genai_legacy
            self._use_new_sdk = False
            self._legacy_genai = genai_legacy
            print(f"[INFO] Initialized {len(self.keys)} Gemini key(s) via legacy SDK", flush=True)

    def _next_active_idx(self) -> int:
        if not self.active_indices:
            raise RuntimeError("All provided Gemini API keys reached daily quota limit.")
        idx = self.active_indices[self.rr_cursor % len(self.active_indices)]
        self.rr_cursor = (self.rr_cursor + 1) % len(self.active_indices)
        return idx

    def generate_content(self, user_msg: str, max_retries: int = 5) -> str:
        for attempt in range(max_retries):
            key_idx = self._next_active_idx()
            try:
                if self._use_new_sdk:
                    from google.genai import types
                    resp = self._clients[key_idx].models.generate_content(
                        model=self.model_name,
                        contents=user_msg,
                        config=types.GenerateContentConfig(
                            system_instruction=self.teacher_system,
                            response_mime_type="application/json",
                            temperature=0.75,
                        ),
                    )
                    return resp.text
                else:
                    self._legacy_genai.configure(api_key=self.keys[key_idx], transport="rest")
                    model = self._legacy_genai.GenerativeModel(
                        model_name="models/gemini-1.5-flash",
                        system_instruction=self.teacher_system,
                        generation_config={"response_mime_type": "application/json", "temperature": 0.75},
                    )
                    resp = model.generate_content(user_msg, request_options={"timeout": 30})
                    return resp.text
            except Exception as e:
                err_str = str(e).lower()
                is_daily_quota = ("quota" in err_str and ("per day" in err_str or "daily" in err_str)) or "exhausted" in err_str
                if is_daily_quota and "per minute" not in err_str:
                    print(f"\n[WARN] Gemini Key #{key_idx + 1} exhausted daily quota. Removing from active pool.", flush=True)
                    if key_idx in self.active_indices:
                        self.active_indices.remove(key_idx)
                    if self.active_indices:
                        continue
                    raise RuntimeError(f"All Gemini API keys reached daily limit: {e}")

                if attempt == max_retries - 1:
                    raise e
                wait_time = 12 if ("429" in err_str or "rate" in err_str or "resource" in err_str) else (attempt + 1) * 3
                print(f"[WARN] Key #{key_idx + 1} temporary error: {str(e)[:120]}. Retry {attempt + 1}/{max_retries} in {wait_time}s...", flush=True)
                time.sleep(wait_time)


def call_openai_with_retry(client, system: str, user: str, max_retries: int = 4) -> str:
    for attempt in range(max_retries):
        try:
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.75,
                max_tokens=900,
                response_format={"type": "json_object"},
            )
            return resp.choices[0].message.content
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep((attempt + 1) * 3)


def load_existing_stats(file_path: Path):
    if not file_path.exists():
        return 0, 0, 0, set()
    en_count, vi_count, total = 0, 0, 0
    seen_pks = set()
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
                pk = meta.get("primary_keyword", "")
                if pk:
                    seen_pks.add(pk.lower().strip())
                total += 1
            except Exception:
                pass
    return total, en_count, vi_count, seen_pks


def load_keyword_pool_from_task1(kw_raw_path: Path) -> dict[str, list[dict]]:
    """
    Extracts verified (keyword, intent, topic, biz_desc, target_cust) tuples
    generated by Task 1 so Task 2 (CONTENT_BRIEF) has 100% unique keywords & true intents.
    """
    pools = {"en": [], "vi": []}
    if not kw_raw_path.exists():
        return pools

    seen = {"en": set(), "vi": set()}
    with kw_raw_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
                meta = rec.get("_meta", {})
                lang = meta.get("lang", "")
                if lang not in pools:
                    continue
                topic = meta.get("topic", "")
                biz_desc = meta.get("biz_desc", "")
                target_cust = meta.get("target_cust", "")
                ast = json.loads(rec["messages"][2]["content"])
                for item in ast.get("keywords", []):
                    if not isinstance(item, dict):
                        continue
                    kw = str(item.get("keyword", "")).strip()
                    intent = item.get("intent", "")
                    key = kw.lower()
                    if kw and intent in INTENT_ENUM and key not in seen[lang]:
                        seen[lang].add(key)
                        pools[lang].append({
                            "keyword": kw,
                            "intent": intent,
                            "topic": topic,
                            "biz_desc": biz_desc,
                            "target_cust": target_cust,
                        })
            except Exception:
                continue

    # Shuffle and balance intent buckets for fair representation
    for lang in ["en", "vi"]:
        by_intent = {i: [] for i in INTENT_ENUM}
        for entry in pools[lang]:
            by_intent[entry["intent"]].append(entry)
        for lst in by_intent.values():
            random.shuffle(lst)
        interleaved = []
        # Interleave: 3 Commercial, 3 Informational, 3 Transactional, 1 Navigational
        pattern = ["Commercial", "Informational", "Transactional", "Commercial", "Informational", "Transactional", "Navigational"]
        while any(by_intent.values()):
            added = False
            for intent in pattern:
                if by_intent[intent]:
                    interleaved.append(by_intent[intent].pop())
                    added = True
            if not added:
                break
        pools[lang] = interleaved

    print(f"[INFO] Loaded Task-1 keyword pool for Content Brief: EN={len(pools['en'])} unique KWs | VI={len(pools['vi'])} unique KWs", flush=True)
    return pools


def generate(task: str, out_path: Path, provider: str = "gemini", target_per_task: int = TARGET_PER_TASK, kw_raw_path: Path = None) -> bool:
    student_system = SYSTEM_KW if task == "KEYWORD_RESEARCH" else SYSTEM_CB
    teacher_system = student_system + (TEACHER_KW_EXTRA if task == "KEYWORD_RESEARCH" else TEACHER_CB_EXTRA)

    client = None
    gemini_mgr = None
    num_keys = 1

    if provider == "openai":
        if OpenAI is None:
            raise ImportError("OpenAI SDK is not installed. Run 'pip install openai'.")
        client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    else:
        raw_keys = os.environ.get("GEMINI_API_KEYS") or os.environ.get("GEMINI_API_KEY")
        if not raw_keys:
            raise ValueError("GEMINI_API_KEY or GEMINI_API_KEYS environment variable is not set.")
        key_list = [k.strip() for k in raw_keys.split(",") if k.strip()]
        num_keys = len(key_list)
        gemini_mgr = GeminiKeyManager(key_list, teacher_system)

    out_path.parent.mkdir(parents=True, exist_ok=True)

    target_en = int(target_per_task * EN_RATIO)
    target_vi = target_per_task - target_en

    existing_total, existing_en, existing_vi, seen_pks = load_existing_stats(out_path)
    if existing_total > 0:
        print(f"[INFO] Found existing v2 data in {out_path.name}: {existing_total} samples (EN: {existing_en}, VI: {existing_vi}). Resuming...", flush=True)

    kw_pools = {"en": [], "vi": []}
    if task == "CONTENT_BRIEF":
        src_kw = kw_raw_path or (out_path.parent / "keyword_research_raw.jsonl")
        kw_pools = load_keyword_pool_from_task1(src_kw)
        # Filter out already-generated primary keywords
        for lang in ["en", "vi"]:
            kw_pools[lang] = [e for e in kw_pools[lang] if e["keyword"].lower().strip() not in seen_pks]

    plan = [
        ("en", target_en, existing_en),
        ("vi", target_vi, existing_vi),
    ]
    # Faster throughput with multiple keys (round-robin keeps each key comfortably under RPM limit)
    sleep_between = max(1.2, 3.2 / num_keys) if provider == "gemini" else 0.3
    total_written = existing_total

    with out_path.open("a", encoding="utf-8") as f_out:
        for lang, count, already_done in plan:
            remaining = count - already_done
            lang_label = "English (US)" if lang == "en" else "Vietnamese"

            if remaining <= 0:
                print(f"[INFO] Task {task} [{lang}]: Already completed ({already_done}/{count}). Skipping.", flush=True)
                continue

            print(f"\n[INFO] Task {task}: generating {remaining} samples for {lang_label} (progress: {already_done}/{count})...", flush=True)
            pool_idx = 0

            i = already_done
            consecutive_failures = 0
            while i < count:
                if task == "KEYWORD_RESEARCH":
                    niche_id, topic, biz_desc, target_cust = sample_niche_context(lang)
                    user_msg = build_user_kw(topic, lang, biz_desc, target_cust)
                    known_intent = ""
                    pk_for_meta = ""
                else:
                    if pool_idx < len(kw_pools[lang]):
                        entry = kw_pools[lang][pool_idx]
                        pool_idx += 1
                        kw = entry["keyword"]
                        true_intent = entry["intent"]
                        topic = entry["topic"]
                        biz_desc = entry["biz_desc"] if random.random() >= MISSING_CONTEXT_PROB else ""
                        target_cust = entry["target_cust"] if biz_desc else ""
                        # 50% provide TRUE known_intent, 50% omit so model learns both modes
                        known_intent = true_intent if random.random() < 0.50 else ""
                        niche_id = "from_task1"
                    else:
                        niche_id, topic, biz_desc, target_cust = sample_niche_context(lang)
                        kw = topic
                        known_intent = ""
                    user_msg = build_user_cb(kw, topic, lang, known_intent, biz_desc, target_cust)
                    pk_for_meta = kw

                # Generate with quality-gate retry (up to 2 attempts per sample)
                saved = False
                for q_attempt in range(2):
                    try:
                        if provider == "openai":
                            assistant_raw = call_openai_with_retry(client, teacher_system, user_msg)
                        else:
                            assistant_raw = gemini_mgr.generate_content(user_msg)

                        parsed = json.loads(assistant_raw)

                        if task == "KEYWORD_RESEARCH":
                            ok, reason = check_kw_quality(parsed, lang)
                        else:
                            ok, reason = check_cb_quality(parsed, lang, known_intent)

                        if not ok:
                            print(f"[FILTER] Rejected sample ({reason}), retrying...", flush=True)
                            time.sleep(1.0)
                            continue

                        # Re-serialize cleanly to compact consistent JSON
                        clean_assistant = json.dumps(parsed, ensure_ascii=False)

                        record = {
                            "messages": [
                                {"role": "system", "content": student_system},
                                {"role": "user", "content": user_msg},
                                {"role": "assistant", "content": clean_assistant},
                            ],
                            "_meta": {
                                "task": task,
                                "lang": lang,
                                "niche_id": niche_id,
                                "topic": topic,
                                "biz_desc": biz_desc,
                                "target_cust": target_cust,
                                "primary_keyword": pk_for_meta,
                            },
                        }

                        f_out.write(json.dumps(record, ensure_ascii=False) + "\n")
                        f_out.flush()
                        total_written += 1
                        i += 1
                        saved = True
                        consecutive_failures = 0

                        if i % 10 == 0 or i == count:
                            print(f"[INFO] Task {task} [{lang}]: {i}/{count} samples (Total saved: {total_written})", flush=True)

                        time.sleep(sleep_between)
                        break

                    except RuntimeError as quota_err:
                        print(f"\n[ERROR] {quota_err}", flush=True)
                        print(f"[INFO] Progress safely saved ({total_written} samples). Resume later with fresh keys.", flush=True)
                        return False
                    except Exception as e:
                        print(f"[WARN] Sample error: {str(e)[:120]}", flush=True)
                        time.sleep(2.0)

                if not saved:
                    consecutive_failures += 1
                    if consecutive_failures >= 10:
                        print("[ERROR] Too many consecutive failures. Stopping cleanly.", flush=True)
                        return False

    print(f"\n[SUCCESS] Task {task} complete! Total {total_written} clean v2 samples saved in {out_path}", flush=True)
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate clean v2 synthetic dataset for QLoRA fine-tuning")
    parser.add_argument("--task", choices=["KEYWORD_RESEARCH", "CONTENT_BRIEF", "ALL"], default="ALL")
    parser.add_argument("--out", default="../data/raw/", help="Output directory or file path")
    parser.add_argument("--provider", choices=["openai", "gemini"], default="gemini")
    parser.add_argument("--target", type=int, default=TARGET_PER_TASK, help="Samples per task (default: 1200 -> 2400 total)")
    args = parser.parse_args()

    out = Path(args.out)

    if args.task == "ALL":
        kw_file = out / "keyword_research_raw.jsonl"
        cb_file = out / "content_brief_raw.jsonl"
        success_kw = generate("KEYWORD_RESEARCH", kw_file, args.provider, args.target)
        if not success_kw:
            print("\n[STOP] KEYWORD_RESEARCH paused before completing. Re-run with fresh API keys to auto-resume.")
            sys.exit(1)
        success_cb = generate("CONTENT_BRIEF", cb_file, args.provider, args.target, kw_raw_path=kw_file)
        if not success_cb:
            print("\n[STOP] CONTENT_BRIEF paused before completing. Re-run with fresh API keys to auto-resume.")
            sys.exit(1)
    elif args.task == "KEYWORD_RESEARCH":
        file = out if out.suffix == ".jsonl" else out / "keyword_research_raw.jsonl"
        generate("KEYWORD_RESEARCH", file, args.provider, args.target)
    else:
        file = out if out.suffix == ".jsonl" else out / "content_brief_raw.jsonl"
        kw_src = file.parent / "keyword_research_raw.jsonl"
        generate("CONTENT_BRIEF", file, args.provider, args.target, kw_raw_path=kw_src)
