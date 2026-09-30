import Blog from "../model/blog.model.js";

export const findBlogsByShop = async (
  shopId,
  { limit = 20, skip = 0, status } = {}
) => {
  const query = { shopId };
  if (status) {
    query.status = status;
  }

  return Blog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countBlogsByShop = async (shopId, { status } = {}) => {
  const query = { shopId };
  if (status) {
    query.status = status;
  }
  return Blog.countDocuments(query);
};

export const findBlogById = async (id) => {
  return Blog.findById(id);
};

export const findBlogBySlug = async (slug) => {
  return Blog.findOne({ slug });
};

export const createBlog = async (data) => {
  return Blog.create(data);
};

export const updateBlog = async (id, data) => {
  return Blog.findByIdAndUpdate(id, { $set: data }, { new: true });
};

export const deleteBlog = async (id) => {
  return Blog.findByIdAndDelete(id);
};
