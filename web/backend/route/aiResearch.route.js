import { Router } from "express";

const router = Router();
const AI_SERVE_URL = process.env.AI_RESEARCH_SERVICE_URL || "http://127.0.0.1:8001";

// In-memory job store and cache for long-running AI inference (prevents Cloudflare/Shopify 100s timeout)
const briefJobs = new Map();
const briefCache = new Map();

// Periodic cleanup of jobs older than 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of briefJobs.entries()) {
    if (now - job.createdAt > 15 * 60 * 1000) {
      briefJobs.delete(id);
    }
  }
}, 60000);

function buildFallbackBrief(kw, intent, cleanSelected = []) {
  const fallbackSecondary =
    cleanSelected.length > 1
      ? cleanSelected.map((s) => s.keyword).filter((k) => k.toLowerCase() !== kw.toLowerCase())
      : [
          `${kw} chính hãng`,
          `kinh nghiệm mua ${kw}`,
          `đánh giá chi tiết ${kw}`,
          `bảng giá ${kw}`,
        ];
  return {
    primary_keyword: kw,
    secondary_keywords: fallbackSecondary,
    dominant_intent: intent,
    funnel_stage: intent === "Commercial" ? "MOFU" : (intent === "Transactional" ? "BOFU" : "TOFU"),
    recommended_content_type: ["Commercial", "Transactional"].includes(intent) ? "Buyer's guide" : "Informational",
    recommended_style: intent === "Commercial" ? "Analytical" : (intent === "Transactional" ? "Persuasive" : "Informative"),
    recommended_tone: ["Commercial", "Transactional"].includes(intent) ? "Authoritative" : "Friendly",
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
}

async function executeBriefGeneration(jobId, cacheKey, payload, kw, intent, cleanSelected) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 360000); // 6 mins max on CPU

    const response = await fetch(`${AI_SERVE_URL}/api/research/brief`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      briefJobs.set(jobId, { status: "completed", data, createdAt: Date.now() });
      briefCache.set(cacheKey, data);
      console.log(`[BriefJob] Job ${jobId} completed successfully via AI microservice.`);
      return;
    }
  } catch (aiErr) {
    console.warn(`[BriefJob] AI Microservice failed for job ${jobId}:`, aiErr.message);
  }

  // Resilient fallback if AI microservice failed or timed out
  const fallback = buildFallbackBrief(kw, intent, cleanSelected);
  briefJobs.set(jobId, { status: "completed", data: fallback, createdAt: Date.now() });
  briefCache.set(cacheKey, fallback);
  console.log(`[BriefJob] Job ${jobId} completed via resilient fallback.`);
}

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
    const {
      niche,
      seed_keyword,
      language = "vi",
      count = 10,
      business_desc,
      target_customer,
    } = req.body;

    if (!niche || !niche.trim()) {
      return res.status(400).json({
        success: false,
        error: "Trường 'niche' (hoặc Topics) là bắt buộc.",
      });
    }

    // Call FastAPI service (timeout 120s for keywords on CPU)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(`${AI_SERVE_URL}/api/research/keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: niche.trim(),
          seed_keyword: seed_keyword ? seed_keyword.trim() : null,
          language: language === "en" ? "en" : "vi",
          count: Number(count) || 10,
          business_desc: business_desc ? business_desc.trim() : null,
          target_customer: target_customer ? target_customer.trim() : null,
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
    const isEn = language.toLowerCase().startsWith("en");
    const cleanTopic = (seed_keyword || niche).trim();
    const fallbackKeywords = isEn
      ? [
          { keyword: `what is ${cleanTopic}`, intent: "Informational", search_volume: 2400, competition_level: "LOW", cpc: 0.45 },
          { keyword: `how to choose the best ${cleanTopic}`, intent: "Informational", search_volume: 1800, competition_level: "LOW", cpc: 0.35 },
          { keyword: `top rated ${cleanTopic} reviews 2026`, intent: "Commercial", search_volume: 3200, competition_level: "MEDIUM", cpc: 0.85 },
          { keyword: `compare ${cleanTopic} brands and features`, intent: "Commercial", search_volume: 1400, competition_level: "MEDIUM", cpc: 0.65 },
          { keyword: `buy ${cleanTopic} online best deals`, intent: "Transactional", search_volume: 4100, competition_level: "HIGH", cpc: 1.25 },
          { keyword: `affordable ${cleanTopic} price guide`, intent: "Transactional", search_volume: 2100, competition_level: "HIGH", cpc: 1.10 },
          { keyword: `${cleanTopic} official store near me`, intent: "Navigational", search_volume: 950, competition_level: "LOW", cpc: 0.50 },
        ]
      : [
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
 * Returns an asynchronous Job ID immediately (<50ms) to prevent Cloudflare/Shopify 100s timeouts
 */
router.post("/brief", async (req, res, next) => {
  try {
    const {
      primary_keyword,
      selected_keywords,
      niche,
      known_intent,
      language = "vi",
      business_desc,
      target_customer,
    } = req.body;

    const cleanSelected = Array.isArray(selected_keywords)
      ? selected_keywords
          .map((item) =>
            typeof item === "string"
              ? { keyword: item.trim(), intent: null }
              : { keyword: String(item?.keyword || "").trim(), intent: item?.intent || null }
          )
          .filter((item) => item.keyword)
      : [];

    const hasPrimary = Boolean(primary_keyword && primary_keyword.trim());
    if (!hasPrimary && cleanSelected.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cần truyền 'primary_keyword' hoặc danh sách 'selected_keywords'.",
      });
    }

    const kw = hasPrimary ? primary_keyword.trim() : cleanSelected[0].keyword;
    const intent = known_intent || cleanSelected[0]?.intent || "Commercial";
    const cacheKey = `${kw.toLowerCase()}_${language}_${intent.toLowerCase()}`;

    // 1. Check in-memory cache for instant hit
    if (briefCache.has(cacheKey)) {
      console.log(`[Brief] Cache HIT for key: ${cacheKey}`);
      return res.status(200).json({
        success: true,
        status: "completed",
        data: briefCache.get(cacheKey),
      });
    }

    // 2. Prepare payload for AI microservice
    const payload = {
      primary_keyword: hasPrimary ? primary_keyword.trim() : null,
      selected_keywords: cleanSelected.length > 0 ? cleanSelected : null,
      niche: niche ? niche.trim() : null,
      known_intent: known_intent || null,
      language: language === "en" ? "en" : "vi",
      business_desc: business_desc ? business_desc.trim() : null,
      target_customer: target_customer ? target_customer.trim() : null,
    };

    // 3. Create async job and return response immediately (prevents Cloudflare 100s timeout)
    const jobId = `brief_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    briefJobs.set(jobId, { status: "processing", createdAt: Date.now() });

    // Trigger background generation without blocking HTTP response
    executeBriefGeneration(jobId, cacheKey, payload, kw, intent, cleanSelected);

    return res.status(200).json({
      success: true,
      status: "processing",
      jobId,
      message: "Brief generation in progress",
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ai/research/brief/status/:jobId
 * Poll the status of a brief generation job
 */
router.get("/brief/status/:jobId", async (req, res) => {
  const { jobId } = req.params;
  const job = briefJobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      status: "not_found",
      error: "Job not found or expired",
    });
  }

  return res.status(200).json({
    success: true,
    status: job.status,
    data: job.data || null,
    error: job.error || null,
  });
});

export default router;

