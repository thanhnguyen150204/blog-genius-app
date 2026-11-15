# 📝 GHI CHÚ KẾ HOẠCH TRAIN MODEL AI (PHÂN HỆ 1 — THÀNH VIÊN 1)
> **Mục đích tài liệu:** Lưu lại toàn bộ bối cảnh, kiến trúc và phương án đã chốt để khôi phục nhanh ngữ cảnh khi mở lại IDE hoặc bắt đầu cuộc hội thoại mới với AI.  
> **Tham chiếu gốc:** `PROJECT_PLAN.md` (Mục 5.1 - Phân hệ 1, Mục 5.3 - Phân hệ 3 & Mục 10 - Quy chuẩn Git)

---

## 1. BỐI CẢNH & PHÂN CÔNG ĐỘC LẬP TRONG NHÓM

* **Model sử dụng:** `Qwen/Qwen2.5-1.5B-Instruct` fine-tune bằng **QLoRA** (chạy trên Google Colab T4 miễn phí hoặc GPU >= 8GB VRAM).
* **Phân chia ranh giới với thành viên khác (đối chiếu `PROJECT_PLAN.md`, tránh trùng lặp & git conflict):**
  * **Phần của tôi — Phân hệ 1 (Thành viên 1, độc lập 100%):** Tập trung **2 tác vụ** thuộc `PROJECT_PLAN.md` Mục 5.1: **`KEYWORD_RESEARCH`** và **`CONTENT_BRIEF`**.
  * **Thành viên 2 (Phân hệ 2):** Outline Builder, Canvas Editor, và phần sinh **Title** đã train riêng.
  * **Thành viên 3 (Phân hệ 3):** SEO/GEO Scoring & Auto-Fix Inspector (trong đó có `FIX_META_DESCRIPTION`). Vì vậy, tác vụ `SEO_META_DESC` **chưa train ở đợt này** để tránh giẫm sang phần Thành viên 3; có thể train bổ sung sau nếu nhóm thống nhất.
  * **Lưu ý về màn `ContentIdeas`:** Không train model cho màn `ContentIdeas` (`LiveScanModal.jsx`) vì dữ liệu của màn đó phức tạp (volume, growth, contentGap toàn thị trường), model `1.5B` dễ bị ảo giác số liệu.
* **Nhánh Git & Cấu trúc thư mục dự kiến (tạo tách từ nhánh `feature/content-idea`):**
  * Branch riêng: `feat/ai-research-qlora`
  * Thư mục AI riêng: `ai_services/research_qlora/` (FastAPI chạy cổng riêng `8001`)
  * Route backend riêng: `web/backend/route/aiResearch.route.js` (mount `/api/ai/research/...` trong `web/backend/index.js`)

---

## 2. NGÔN NGỮ & TỶ LỆ DỮ LIỆU TRAIN

Qua kiểm tra thực tế toàn bộ code frontend (`Keywords.jsx`, `ContentIdeasSettingsDrawer.jsx`, `AiGeneratorSetupView.jsx`, `ScratchSidebarSeo.jsx`, `ScratchSidebarPostSettings.jsx`), **100% giao diện và dữ liệu sản phẩm Shopify mẫu hiện tại là Tiếng Anh** (`en-US` mặc định), nhưng các dropdown đều có tùy chọn **Vietnamese (`vi-VN` / `vi`)**.

* **Quyết định chốt:** Train **Song ngữ — 65% Tiếng Anh + 35% Tiếng Việt** (tại quy mô `1.800` mẫu cho 2 task là `585 EN + 315 VI` mỗi task để Tiếng Việt đủ dày và mượt), điều khiển ngôn ngữ đầu ra thông qua tham số chuẩn hóa `language` (`"en"` hoặc `"vi"`).
  * **Chuẩn hóa mã ngôn ngữ toàn Pipe:** `Keywords.jsx` dùng `"en-US"`/`"vi-VN"`, `AiStyleToneSettings.jsx` dùng `"English(US)"`/`"Vietnamese"`, còn `ScratchSidebarSeo.jsx` dùng `"en"`/`"vi"`. Route Express sẽ chuẩn hóa mọi biến thể về `"en"` hoặc `"vi"` trước khi gọi FastAPI.

---

## 3. ĐẶC TẢ 2 TASK TRAIN & HỢP ĐỒNG KHỚP PIPELINE NHÓM

1 model `Qwen2.5-1.5B-Instruct` duy nhất được fine-tune theo chuẩn **ChatML (`messages`)** trả về **JSON hợp lệ** cho 2 tác vụ nối tiếp nhau thuộc **Phân hệ 1**, đồng bộ 100% chuẩn **SEO + GEO** và khớp thẳng dữ liệu sang **Phân hệ 2 & 3**:

### Task 1: `KEYWORD_RESEARCH` (Phân hệ 1 — Mở rộng từ khóa SEO/GEO & Phân loại Intent)
* **Vị trí gắn trên UI:** Nút *"Generate keywords with AI"* trong `web/frontend/src/pages/Keywords.jsx` (thay thế `MOCK_KEYWORDS_BY_TOPIC` + `setTimeout`).
* **Đầu vào (khớp form hiện có của `Keywords.jsx`):**
  * `language` (`en` / `vi` sau chuẩn hóa)
  * `business_desc` (Mô tả cửa hàng — *có thể rỗng `""`*)
  * `target_customer` (Khách hàng mục tiêu — *có thể rỗng `""`*)
  * `topics` (Danh sách từ khóa/chủ đề hạt giống)
* **Quy tắc SEO + GEO cho tập dữ liệu:**
  * Không tự bịa số liệu `search_volume`, `KD`, `CPC` (tránh ảo giác ở model 1.5B).
  * Danh sách từ khóa sinh ra phải kết hợp cả **từ khóa mua hàng/so sánh SEO** (*Commercial / Transactional*) và **từ khóa dạng câu hỏi hội thoại AI Search phục vụ GEO** (*"how to..."*, *"are ... safe"*, *"cách chọn..."*).
* **Đầu ra JSON:**
  ```json
  {
    "keywords": [
      { "keyword": "best organic cotton baby clothes for sensitive skin", "intent": "Commercial" },
      { "keyword": "are bamboo diapers really compostable and safe", "intent": "Informational" },
      { "keyword": "buy GOTS certified newborn onesie 3-pack online", "intent": "Transactional" }
    ]
  }
  ```
  *(Hiển thị trực tiếp lên bảng kết quả của `Keywords.jsx`, kèm `<Badge>` nhãn `intent` bên cạnh mỗi từ khóa; giữ nguyên cơ chế `Add keyword` lưu vào `savedKeywordsStorage` để `AiGeneratorSetupView.jsx` đọc ngay).*

---

### Task 2: `CONTENT_BRIEF` (Phân hệ 1 — Chiến lược SEO & Bản thiết kế GEO cho Thành viên 2 & 3)
* **Vị trí gắn trên UI:** Nút *"Analyze Brief"* ở từng dòng trong `Keywords.jsx` và nút *"Create Content Brief (N)"* trên thanh Bulk Bar (khi tick nhiều dòng) $\rightarrow$ mở **Modal Content Brief** (có nút *"Use Brief in Content Studio"* lưu `savedKeywordsStorage` và truyền `navigate("/studio", { state: { brief } })`).
* **Quy tắc logic đầu vào (khớp UI checkbox ngang hàng):**
  1. **Chọn 1 dòng đã có `intent` trên bảng:** Truyền luôn `known_intent` vào input để model **giữ nguyên `dominant_intent = known_intent`** (tránh lệch với bảng).
  2. **Tick chọn nhiều dòng trên bảng (coi các từ ngang hàng nhau):** Gửi toàn bộ danh sách `selected_keywords` (kèm `intent` của từng từ) lên model $\rightarrow$ **Model tự quyết định** từ nào là `primary_keyword`, các từ còn lại vào `secondary_keywords`, đồng thời tổng hợp `dominant_intent` chung (tránh lỗi Keyword Cannibalization).
  3. **Nhập từ khóa tự do (chưa có `intent`):** Model tự dự đoán `dominant_intent`.
* **Ràng buộc Enum khớp giao diện Thành viên 2 (`AiStyleToneSettings.jsx` & `studioData.js`):**
  * `dominant_intent`: `"Informational" | "Commercial" | "Transactional" | "Navigational"`
  * `funnel_stage`: `"TOFU" | "MOFU" | "BOFU"`
  * `recommended_content_type`: `"Informational" | "Buyer's guide" | "How-to" | "FAQ"` *(khớp `CONTENT_TYPES` trong `studioData.js`)*
  * `recommended_style`: `"Informative" | "Analytical" | "Instructive" | "Persuasive" | "Conversational"` *(tập con SEO/GEO của `WRITING_STYLES`)*
  * `recommended_tone`: `"Authoritative" | "Caring" | "Friendly" | "Informative" | "Formal" | "Conversational"` *(tập con SEO/GEO của `VOICE_TONES`)*
* **Đầu ra JSON (Chuẩn SEO + GEO đầy đủ):**
  ```json
  {
    "primary_keyword": "are bamboo diapers safe for newborn skin",
    "secondary_keywords": [
      "bamboo diapers vs cotton diapers",
      "compostable bamboo diapers"
    ],
    "dominant_intent": "Commercial",
    "funnel_stage": "MOFU",
    "recommended_content_type": "Buyer's guide",
    "recommended_style": "Informative",
    "recommended_tone": "Caring",
    "target_audience": "New and expectant eco-conscious parents evaluating safe, breathable diaper options for newborn skin.",
    "key_talking_points": [
      "Hypoallergenic fiber structure and safety certifications (OEKO-TEX Standard 100, FSC)",
      "Comparison of absorbency and breathability between bamboo and organic cotton diapers",
      "Clarify which layers are truly compostable vs waterproof outer barriers",
      "4-point sizing and rash-prevention checklist for newborns under 5kg"
    ],
    "geo_blueprint": {
      "answer_block_focus": "Direct 45-60 word verdict on bamboo diaper safety for newborns and key certifications to check.",
      "comparison_table_idea": "Bamboo vs Organic Cotton vs Conventional Diapers (breathability, absorbency, certifications, biodegradability).",
      "faq_questions": [
        "Are bamboo diapers hypoallergenic for sensitive newborn skin?",
        "Are bamboo diapers 100% compostable at home?"
      ]
    },
    "suggested_cta": "Try our OEKO-TEX certified Eco-Bamboo Newborn Starter Pack."
  }
  ```
* **Cách khớp trực tiếp sang Phân hệ 2 & 3:**
  * `primary_keyword` + `secondary_keywords` $\rightarrow$ Ô *Keywords* trong `KeywordAndScheduleSettings.jsx` & đầu vào cho Model Title.
  * `recommended_style`, `recommended_tone`, `target_audience` $\rightarrow$ Điền sẵn `AiStyleToneSettings.jsx` & `BusinessContextCard.jsx`.
  * `recommended_content_type` $\rightarrow$ Gắn `post.type` cho `Studio.jsx`.
  * `geo_blueprint.answer_block_focus` $\rightarrow$ Tự bật công tắc *"Insert summary at top of each section"* (`TypeSpecificSettingsCard.jsx`) + đáp ứng tiêu chí **Direct Answer Summary** của Thành viên 3 (`ScratchSidebarSeo.jsx`).
  * `geo_blueprint.comparison_table_idea` + `faq_questions` + `key_talking_points` (có **E-E-A-T**) $\rightarrow$ Định hướng `OutlineModal.jsx` sinh `<table>` & mục `FAQs`, giúp bài viết đạt chuẩn **GEO Content Types**, **FAQ Schema** và **E-E-A-T** khi Thành viên 3 chấm điểm.

---

### Phần mở rộng dự phòng (Tạm hoãn — Train sau nếu cần): `SEO_META_DESC`
> **Lý do tạm hoãn:** Trong `PROJECT_PLAN.md` (Mục 5.3 & 6), tác vụ `FIX_META_DESCRIPTION` nằm ở Phân hệ 3 (Thành viên 3). Đợt train hiện tại **chỉ tập trung 2 task của Thành viên 1** (`KEYWORD_RESEARCH`, `CONTENT_BRIEF`).
* **Cách mở rộng về sau không làm lại từ đầu:** Dữ liệu ChatML được sinh và lưu tách riêng từng file (`keyword_research.jsonl`, `content_brief.jsonl`). Khi cần bổ sung `SEO_META_DESC` (gắn vào `ScratchSidebarPostSettings.jsx` với output `meta_description` dài **120–160 ký tự** chứa `primary_keyword`, `excerpt`, `tags`), chỉ cần sinh thêm `seo_meta_desc.jsonl`, gộp lại và train lại QLoRA.

---

## 4. QUY MÔ DATASET, CẤU HÌNH QLORA & TIÊU CHÍ ĐÁNH GIÁ

* **Quy mô Dataset chốt (Phương án A — Chuyên sâu 2 task):** **1.800 mẫu sạch tổng** (lọc từ ~2.200 mẫu sinh thô; **900 mẫu / task** = `585` Tiếng Anh + `315` Tiếng Việt mỗi task), chia **90% Train (`1.620` mẫu) / 10% Test (`180` mẫu — `90` mẫu Test/task)**.
  * **Phân bổ kịch bản cho `CONTENT_BRIEF` (`900` mẫu):**
    * `~300` mẫu: chọn 1 từ khóa kèm `known_intent` (model **giữ nguyên `dominant_intent`**, không phân tích lại).
    * `~450` mẫu: chọn cụm 3–6 từ khóa ngang hàng (model tự quyết định `primary_keyword`, `secondary_keywords`, `dominant_intent`).
    * `~150` mẫu: từ khóa đơn lẻ tự do chưa có `intent` (model tự dự đoán `dominant_intent`).
  * Phủ đa dạng **12–15 ngành hàng Shopify**: *Mother & Baby, Skincare & Beauty, Fashion & Apparel, Kitchen & Home, Eco Living, Pet Care, Fitness & Supplements, Electronics & Accessories, Coffee & Specialty Food, Jewelry & Gifts, Bedding & Sleep, Outdoor & Travel, Home Decor, Vietnamese Local Brands*.
  * **Đa dạng hóa tình huống thực tế:** Khoảng `20–30%` mẫu có `business_desc` hoặc `target_customer` rỗng (`""`) để model xử lý tốt khi người dùng trên UI bỏ trống 2 ô không bắt buộc này.
  * **Auto-Validate + Deduplicate trước khi train:**
    * Lưu tách file gốc theo từng task (`keyword_research.jsonl`, `content_brief.jsonl`) rồi mới gộp thành `train.jsonl` / `test.jsonl`.
    * Loại bỏ mẫu trùng lặp/công thức hóa; chỉ giữ mẫu parse được JSON, nhãn `intent` (`Informational` / `Navigational` / `Commercial` / `Transactional`), `funnel_stage` (`TOFU` / `MOFU` / `BOFU`), `recommended_content_type`, `recommended_style`, `recommended_tone` khớp đúng enum của Studio; kiểm tra đủ khối `geo_blueprint` (`answer_block_focus`, `comparison_table_idea`, `faq_questions` >= 2 câu) và yếu tố E-E-A-T trong `key_talking_points`.
* **Cấu hình QLoRA chuẩn cho `Qwen/Qwen2.5-1.5B-Instruct`:**
  * Quantization: 4-bit NF4 (`bnb_4bit_use_double_quant=True`).
  * LoRA: `r=16`, `lora_alpha=32`, `lora_dropout=0.05`, `target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]`.
  * Hyperparams: `max_seq_length=1024`, `per_device_train_batch_size=2`, `gradient_accumulation_steps=8`, `learning_rate=2e-4`, `lr_scheduler_type="cosine"`, `warmup_ratio=0.05`, `num_train_epochs=3` (chọn checkpoint tốt nhất theo `eval_loss`; ước lượng ~1.5–2 tiếng trên Colab T4).
  * Chỉ tính loss trên phần trả lời của `assistant` (`DataCollatorForCompletionOnlyLM`) để tối ưu khả năng sinh JSON có cấu trúc lồng nhau.
  * System prompt ngắn gọn, cố định giống hệt nhau giữa lúc train và lúc inference; khi suy luận (`serve.py`), đặt `temperature = 0.25–0.35`, `repetition_penalty = 1.08`, kèm kiểm tra Pydantic/JSON Schema (retry 1 lần nếu lỗi cú pháp nhẹ).
* **Chỉ số Benchmark báo cáo (So sánh Base Model vs QLoRA trên 180 mẫu Test):**
  1. **JSON & Enum Valid Rate (%)** — Tỷ lệ output parse được JSON và khớp 100% enum của `intent`, `funnel_stage`, `recommended_content_type`, `recommended_style`, `recommended_tone`.
  2. **Intent Accuracy (%)** — Độ chính xác phân loại 4 nhãn Search Intent (trên `KEYWORD_RESEARCH` & nhóm mẫu tự do của `CONTENT_BRIEF`).
  3. **Brief Consistency & GEO Readiness Rate (%)** — Tỷ lệ giữ đúng `known_intent`, không bỏ sót từ khóa đã chọn (chia vào `primary_keyword` + `secondary_keywords`), và đủ 3 phần của `geo_blueprint` (`answer_block_focus`, `comparison_table_idea`, `faq_questions`).

---

## 5. VIỆC CẦN LÀM TIẾP THEO & CÂU LỆNH KHÔI PHỤC CONTEXT

### Lộ trình thực hiện:
- [ ] **Bước 1:** Tạo nhánh `feat/ai-research-qlora` và thư mục `ai_services/research_qlora/`.
- [ ] **Bước 2:** Chạy script tạo + kiểm định dataset (`1.800` mẫu sạch cho 2 task: `900` mẫu `KEYWORD_RESEARCH` + `900` mẫu `CONTENT_BRIEF`, chia `1.620` Train / `180` Test).
- [ ] **Bước 3:** Train QLoRA trên Google Colab T4 & chạy script benchmark so sánh Base vs Fine-tuned.
- [ ] **Bước 4:** Dựng FastAPI `serve.py` (cổng `8001`, Pydantic validation) + route Express `web/backend/route/aiResearch.route.js`.
- [ ] **Bước 5:** Nối giao diện `Keywords.jsx` (bảng Keywords + Badge Intent + nút *Analyze Brief* / *Create Content Brief (N)* + Modal Content Brief lưu `savedKeywordsStorage` và truyền `state.brief` sang `/studio`).
- [ ] *(Tùy chọn mở rộng sau):* Nếu nhóm thống nhất bổ sung `SEO_META_DESC`, sinh thêm `seo_meta_desc.jsonl` và train lại.

### Câu lệnh copy dán cho AI ở phiên làm việc sau:
> *"Hãy đọc toàn bộ file `AI_TRAINING_NOTE.md` và `PROJECT_PLAN.md` để nắm lại phương án train Qwen2.5-1.5B QLoRA (2 task Phân hệ 1 của Thành viên 1: `KEYWORD_RESEARCH`, `CONTENT_BRIEF`, chuẩn SEO + GEO & khớp enum sang Studio, quy mô 1.800 mẫu) mà chúng ta đã chốt. Bây giờ hãy giúp tôi thực hiện Bước [1/2/3...]!"*

