# Research QLoRA Service (Module 1)

This service manages the QLoRA fine-tuning pipeline and local inference for:
- `KEYWORD_RESEARCH`: Keyword expansion with search intent classification.
- `CONTENT_BRIEF`: Structured SEO and GEO content brief generation.

Target Branch: `feat/ai-research-qlora`

---

## Directory Structure

```text
research_qlora/
├── data/
│   ├── raw/
│   │   ├── keyword_research_raw.jsonl
│   │   └── content_brief_raw.jsonl
│   ├── keyword_research.jsonl
│   ├── content_brief.jsonl
│   ├── train.jsonl
│   └── test.jsonl
├── scripts/
│   ├── generate_dataset.py
│   ├── validate_dataset.py
│   └── split_dataset.py
├── training/
│   └── train_qlora.ipynb
├── serve/
│   ├── serve.py
│   ├── schemas.py
│   └── requirements.txt
└── README.md
```

---

## Execution Workflow

### 1. Environment Setup
```bash
pip install -r serve/requirements.txt
```

### 2. Dataset Generation and Processing
```bash
cd scripts

# Generate raw samples via API
python generate_dataset.py --task ALL --provider openai --out ../data/raw/

# Validate and filter
python validate_dataset.py --task ALL --inp ../data/raw/ --out ../data/

# Split into 90% train / 10% test
python split_dataset.py --data-dir ../data/
```

Target Dataset Targets:
- Train: 1,620 samples
- Test: 180 samples

### 3. QLoRA Fine-Tuning
Execute `training/train_qlora.ipynb` on Google Colab (T4 GPU instance):
- Base model: `Qwen/Qwen2.5-1.5B-Instruct`
- Quantization: 4-bit NF4
- LoRA Rank (r): 16, Alpha: 32, Dropout: 0.05
- Epochs: 3, Batch size: 2, Gradient accumulation: 8, LR: 2e-4

### 4. Serving
```bash
cd serve
uvicorn serve:app --host 0.0.0.0 --port 8001
```

---

## JSON Schemas

### KEYWORD_RESEARCH
```json
{
  "keywords": [
    {
      "keyword": "best organic baby lotion",
      "intent": "Commercial"
    }
  ]
}
```

### CONTENT_BRIEF
```json
{
  "primary_keyword": "best organic baby lotion",
  "secondary_keywords": [
    "natural baby skincare",
    "chemical-free baby lotion"
  ],
  "dominant_intent": "Commercial",
  "funnel_stage": "MOFU",
  "recommended_content_type": "Buyer's guide",
  "recommended_style": "Informative",
  "recommended_tone": "Caring",
  "target_audience": "New mothers aged 25-35 concerned about natural ingredients",
  "key_talking_points": [
    "97% of pediatricians recommend fragrance-free formulas for newborns (AAP 2023)",
    "EWG Verified certification ensures no harmful chemicals",
    "Clinical study: organic lotions reduce eczema flare-ups by 40%"
  ],
  "geo_blueprint": {
    "answer_block_focus": "What ingredients to avoid in baby lotion",
    "comparison_table_idea": "Top 5 organic baby lotions: ingredients, price, certifications",
    "faq_questions": [
      "Is organic baby lotion better than regular?",
      "What certifications should I look for in baby skincare?"
    ]
  },
  "suggested_cta": "Shop EWG-Verified Baby Lotions — Free shipping on orders over $40"
}
```
