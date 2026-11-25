import { Router } from "express";
import { verifyShopifySession } from "../middleware/shopifyAuth.middleware.js";
import * as shopifyGraphqlService from "../services/shopifyGraphql.service.js";

const router = Router();

router.use(verifyShopifySession);

router.get("/current", (req, res) => {
  res.status(200).json({
    success: true,
    shop: req.shop,
  });
});

/**
 * GET /api/shop/products
 * Queries products from Shopify store via GraphQL
 */
router.get("/products", async (req, res, next) => {
  try {
    const products = await shopifyGraphqlService.getShopProducts(req.shopDomain, req.query);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/shop/blogs
 * Queries blogs defined on Shopify store via GraphQL
 */
router.get("/blogs", async (req, res, next) => {
  try {
    const blogs = await shopifyGraphqlService.getShopBlogs(req.shopDomain);
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/shop/authors
 * Queries article authors from Shopify store via GraphQL
 */
router.get("/authors", async (req, res, next) => {
  try {
    const authors = await shopifyGraphqlService.getShopAuthors(req.shopDomain);
    res.status(200).json({
      success: true,
      authors,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
