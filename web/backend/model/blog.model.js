import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    slug: { type: String, unique: true },
    shopId: { type: String, required: true },
    seoScore: { type: Number, default: 0 },
    geoScore: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
