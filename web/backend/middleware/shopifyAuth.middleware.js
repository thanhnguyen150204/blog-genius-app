import jwt from "jsonwebtoken";
import * as shopRepo from "../repo/shop.repo.js";

const normalizeShopDomain = (input) => {
  if (!input) return null;
  return input
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
};

export const verifyShopifySession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let shopDomain = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const secret = process.env.SHOPIFY_API_SECRET;

      try {
        const decoded = jwt.verify(token, secret, {
          algorithms: ["HS256"],
        });

        if (decoded.dest) {
          shopDomain = normalizeShopDomain(decoded.dest);
        }
      } catch (jwtError) {
        if (process.env.NODE_ENV === "production") {
          return res.status(401).json({
            success: false,
            message: "Invalid or expired Shopify session token",
          });
        }
      }
    }

    if (!shopDomain && process.env.NODE_ENV !== "production") {
      const devShop =
        req.headers["x-shop-domain"] ||
        req.query.shop ||
        process.env.DEV_SHOP_DOMAIN;

      if (devShop) {
        shopDomain = normalizeShopDomain(devShop);
      }
    }

    if (!shopDomain) {
      return res.status(401).json({
        success: false,
        message: "Missing Shopify authorization token or shop parameter",
      });
    }

    let shop = await shopRepo.findActiveByDomain(shopDomain);

    if (!shop && process.env.NODE_ENV !== "production") {
      shop = await shopRepo.upsertShop({
        shopDomain,
        accessToken: "dev_mock_access_token",
        scope: "read_content,write_content",
        shopName: "Development Store",
      });
    }

    if (!shop) {
      return res.status(403).json({
        success: false,
        message: "Shop is not registered or app has been uninstalled",
      });
    }

    req.shopDomain = shopDomain;
    req.shop = shop;

    next();
  } catch (error) {
    next(error);
  }
};
