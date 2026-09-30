import { Router } from "express";
import { verifyShopifySession } from "../middleware/shopifyAuth.middleware.js";

const router = Router();

router.use(verifyShopifySession);

router.get("/current", (req, res) => {
  res.status(200).json({
    success: true,
    shop: req.shop,
  });
});

export default router;
