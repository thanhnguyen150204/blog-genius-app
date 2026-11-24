import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        account_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true,
            unique: true,
            index: true,
        },
        full_name: {
            type: String,
            trim: true,
            default: "New User",
        },
        avatar: {
            type: String,
            default: "",
        },
        phone: {
            type: String,
            default: "",
        },
        default_language: {
            type: String,
            default: "vi",
        },
        default_writing_style: {
            type: String,
            default: "Chuyên nghiệp, phân tích chuyên sâu",
        },
        target_audience: {
            type: String,
            default: "Độc giả quan tâm SEO & E-commerce",
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export default mongoose.model("UserProfile", userProfileSchema);