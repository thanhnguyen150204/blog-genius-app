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
import blogRoutes from "./route/blog.route.js";
import shopRoutes from "./route/shop.route.js";

app.use("/api/blogs", blogRoutes);
app.use("/api/shop", shopRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Blog Genius API is running!" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
