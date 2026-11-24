import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin", "editor"],
            default: "user",
        },
        status: {
            type: String,
            enum: ["unverified", "active", "blocked"],
            default: "unverified",
        },

        otp: {
            code: { type: String, default: null },
            expires_at: { type: Date, default: null },
            purpose: {
                type: String,
                enum: ["register", "login", "reset_password"],
                default: "login",
            },
        },
        last_login_at: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

export default mongoose.model("Account", accountSchema);