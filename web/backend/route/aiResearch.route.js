import { Router } from "express";

const router = Router();
const AI_SERVE_URL = process.env.AI_RESEARCH_SERVICE_URL || "http://127.0.0.1:8001";

/**
 * Health check endpoint for AI Research Microservice
 */
router.get("/health", async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${AI_SERVE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        service: "ai_research",
        status: "unhealthy",
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      service: "ai_research",
      ...data,
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      service: "ai_research",
      status: "degraded",
      message: "AI FastAPI server unreachable. Fallback mode will be used.",
      error: err.message,
    });
  }
});

/**
 * POST /api/ai/research/keywords
 * Generate keywords with search intent and metrics
 */
router.post("/keywords", async (req, res, next) => {
  try {
    const { niche, seed_keyword, language = "vi", count = 10 } = req.body;

    if (!niche || !niche.trim()) {
      return res.status(400).json({
        success: false,
        error: "Trường 'niche' (hoặc Topics) là bắt buộc.",
      });
    }

    // Call FastAPI service
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(`${AI_SERVE_URL}/api/research/keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: niche.trim(),
          seed_keyword: seed_keyword ? seed_keyword.trim() : null,
          language: language === "en" ? "en" : "vi",
          count: Number(count) || 10,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          success: true,
          data,
        });
      }
    } catch (aiErr) {
      console.warn("[WARN] AI Research Service call failed, generating fallback keywords:", aiErr.message);
    }

    // Fallback keyword generation if FastAPI is offline
    const cleanTopic = (seed_keyword || niche).trim();
    const fallbackKeywords = [
      { keyword: `${cleanTopic} là gì`, intent: "Informational", search_volume: 2400, competition_level: "LOW", cpc: 0.45 },
      { keyword: `hướng dẫn sử dụng ${cleanTopic} chi tiết`, intent: "Informational", search_volume: 1800, competition_level: "LOW", cpc: 0.35 },
      { keyword: `đánh giá ${cleanTopic} tốt nhất 2026`, intent: "Commercial", search_volume: 3200, competition_level: "MEDIUM", cpc: 0.85 },
      { keyword: `so sánh các loại ${cleanTopic}`, intent: "Commercial", search_volume: 1400, competition_level: "MEDIUM", cpc: 0.65 },
      { keyword: `mua ${cleanTopic} chính hãng giá tốt`, intent: "Transactional", search_volume: 4100, competition_level: "HIGH", cpc: 1.25 },
      { keyword: `bảng giá ${cleanTopic} mới nhất`, intent: "Transactional", search_volume: 2100, competition_level: "HIGH", cpc: 1.10 },
      { keyword: `cửa hàng ${cleanTopic} uy tín gần đây`, intent: "Navigational", search_volume: 950, competition_level: "LOW", cpc: 0.50 },
    ];

    return res.status(200).json({
      success: true,
      data: {
        keywords: fallbackKeywords,
        niche: niche,
        source: "express_resilient_fallback",
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/research/brief
 * Generate comprehensive SEO & GEO Content Brief
 */
router.post("/brief", async (req, res, next) => {
  try {
    const { primary_keyword, niche, known_intent, language = "vi" } = req.body;

    if (!primary_keyword || !primary_keyword.trim()) {
      return res.status(400).json({
        success: false,
        error: "Trường 'primary_keyword' là bắt buộc.",
      });
    }

    // Call FastAPI service
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(`${AI_SERVE_URL}/api/research/brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_keyword: primary_keyword.trim(),
          niche: niche ? niche.trim() : null,
          known_intent: known_intent || null,
          language: language === "en" ? "en" : "vi",
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          success: true,
          data,
        });
      }
    } catch (aiErr) {
      console.warn("[WARN] AI Brief Service call failed, using resilient fallback:", aiErr.message);
    }

    // Fallback Content Brief with 10 required SEO & GEO fields
    const kw = primary_keyword.trim();
    const intent = known_intent || "Commercial";
    const fallbackBrief = {
      primary_keyword: kw,
      secondary_keywords: [
        `${kw} chính hãng`,
        `kinh nghiệm mua ${kw}`,
        `đánh giá chi tiết ${kw}`,
        `bảng giá ${kw}`,
      ],
      dominant_intent: intent,
      funnel_stage: intent === "Commercial" ? "MOFU" : (intent === "Transactional" ? "BOFU" : "TOFU"),
      recommended_content_type: intent in ["Commercial", "Transactional"] ? "Buyer's Guide" : "In-depth Guide",
      recommended_style: "Persuasive & Informative",
      recommended_tone: "Authoritative",
      target_audience: `Độc giả và khách hàng đang tìm kiếm giải pháp hoặc sản phẩm ${kw} với chất lượng cao và đáng tin cậy.`,
      key_talking_points: [
        `Khái niệm cốt lõi và các tiêu chuẩn đánh giá ${kw} theo số liệu thị trường mới nhất.`,
        `Thực trạng rủi ro và các lỗi thường gặp của người tiêu dùng khi chưa nắm rõ thông số.`,
        `Tiêu chuẩn chứng nhận chất lượng và phân tích chi phí - lợi ích dài hạn.`,
      ],
      geo_blueprint: {
        answer_block_focus: `Tóm tắt trực diện: Để lựa chọn và tối ưu hóa ${kw}, người dùng cần đối chiếu trực tiếp các tiêu chuẩn kỹ thuật cốt lõi, nguồn gốc xuất xứ và cam kết bảo hành từ nhà phân phối.`,
        comparison_table_idea: `Bảng xếp hạng so sánh đa tiêu chí giữa các dòng ${kw} hàng đầu dựa trên chất lượng, độ bền, phân khúc giá và phản hồi thực tế từ người dùng.`,
        faq_questions: [
          `Tiêu chí hàng đầu khi chọn ${kw} là gì?`,
          `Làm sao để nhận biết ${kw} chất lượng tốt so với hàng kém chất lượng?`,
        ],
      },
      suggested_cta: `Khám phá ngay bộ sưu tập ${kw} được chứng nhận tốt nhất và nhận tư vấn chuyên sâu miễn phí!`,
      target_word_count: 1800,
      source: "express_resilient_fallback",
    };

    return res.status(200).json({
      success: true,
      data: fallbackBrief,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
