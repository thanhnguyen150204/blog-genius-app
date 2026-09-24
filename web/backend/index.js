import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
// import blogRoutes from "./route/blog.route.js";
// app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Blog Genius API is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
