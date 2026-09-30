import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    shopDomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    shopName: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uninstalledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shop", shopSchema);
