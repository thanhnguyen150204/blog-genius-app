import * as blogRepo from "../repo/blog.repo.js";

const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now().toString(36)
  );
};

export const getBlogs = async (shopDomain, { limit = 20, page = 1, status } = {}) => {
  const numericLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const numericPage = Math.max(1, Number(page) || 1);
  const skip = (numericPage - 1) * numericLimit;

  const [blogs, total] = await Promise.all([
    blogRepo.findBlogsByShop(shopDomain, { limit: numericLimit, skip, status }),
    blogRepo.countBlogsByShop(shopDomain, { status }),
  ]);

  return {
    blogs,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit) || 1,
    },
  };
};

export const getBlogById = async (shopDomain, id) => {
  const blog = await blogRepo.findBlogById(id);
  if (!blog || blog.shopId !== shopDomain) {
    const error = new Error("Blog post not found");
    error.status = 404;
    throw error;
  }
  return blog;
};

export const createBlog = async (shopDomain, data) => {
  const slug = data.slug || generateSlug(data.title);

  return blogRepo.createBlog({
    ...data,
    slug,
    shopId: shopDomain,
  });
};

export const updateBlog = async (shopDomain, id, data) => {
  await getBlogById(shopDomain, id);
  return blogRepo.updateBlog(id, data);
};

export const deleteBlog = async (shopDomain, id) => {
  await getBlogById(shopDomain, id);
  return blogRepo.deleteBlog(id);
};
