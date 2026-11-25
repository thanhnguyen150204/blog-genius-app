
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Blog from "./model/blog.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function seedData() {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/blog-genius";
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB...");

        const sampleArticle = await Blog.create({
            title: "How to Choose Your First All-Mountain Snowboard",
            content: "Draft content awaiting AI section chaining...",
            keywords: ["all-mountain snowboard", "beginner snowboard"],
            shopId: "offline_store_dev",
            slug: "how-to-choose-all-mountain-snowboard-" + Date.now(),
            status: "draft",
            brief: {
                keyword: "all-mountain snowboard",
                secondary_keywords: ["snowboard flex", "camber vs rocker", "snowboard sizing"],
                search_intent: "Informational",
                target_audience: "Beginner and intermediate winter sport enthusiasts",
                tone_of_voice: "Expert & Comprehensive",
                target_word_count: 1800,
                key_talking_points: [
                    "Define all-mountain snowboard capabilities",
                    "Sizing chart based on rider weight",
                    "Comparison between camber and rocker profiles",
                ],
            },
            outline: [],
        });

        console.log("Seeded sample article with Content Brief successfully!");
        console.log("Article ID:", sampleArticle._id);
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error.message);
        process.exit(1);
    }
}

seedData();