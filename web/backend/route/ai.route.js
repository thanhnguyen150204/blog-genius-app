import { Router } from "express";
import { validateProviderApiKey } from "../services/aiValidation.service.js";

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

export default router;
