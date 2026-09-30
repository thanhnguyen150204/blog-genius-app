import { Router } from "express";
import { verifyShopifySession } from "../middleware/shopifyAuth.middleware.js";
import * as blogService from "../services/blog.service.js";

const router = Router();

router.use(verifyShopifySession);

router.get("/", async (req, res, next) => {
  try {
    const result = await blogService.getBlogs(req.shopDomain, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const blog = await blogService.getBlogById(req.shopDomain, req.params.id);
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.shopDomain, req.body);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(
      req.shopDomain,
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.shopDomain, req.params.id);
    res.status(200).json({ success: true, message: "Blog post deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
