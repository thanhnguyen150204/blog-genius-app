import { Router } from "express";
import { validateProviderApiKey } from "../services/aiValidation.service.js";
import { generateOutlineService } from "../services/outline.service.js";
import { generateArticleService } from "../services/articleGeneration.service.js";
const router = Router();

router.post("/validate-key", async (req, res, next) => {
  try {
    const { provider, apiKey } = req.body;
    if (!provider || !apiKey) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: "Provider and apiKey are required",
      });
    }

    const result = await validateProviderApiKey(provider, apiKey);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/generate-outline", async (req, res, next) => {
  try {
    const { brief } = req.body;
    if (!brief || !brief.keyword) {
      return res.status(400).json({
        success: false,
        error: "Brief payload with primary keyword is required.",
      });
    }
    const outline = await generateOutlineService(brief);
    return res.status(200).json({
      success: true,
      outline,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/generate-article", async (req, res, next) => {
  try {
    const { brief, outline } = req.body;
    if (!brief || !brief.keyword) {
      return res.status(400).json({
        success: false,
        error: "Brief with primary keyword is required.",
      });
    }
    if (!outline || !Array.isArray(outline) || outline.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Non-empty outline array is required for section chaining.",
      });
    }
    const result = await generateArticleService({ brief, outline });
    return res.status(200).json({
      success: true,
      blocks: result.blocks,
      totalSections: result.totalSections,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
