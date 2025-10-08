import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { blogRouter } from "./modules/blog/blog.router";
import { userRouter } from "./modules/user/user.routes";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(cookieParser());
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    // credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/auth", authRouter);

// Default route for testing
app.get("/", (_req, res) => {
  res.send("Portfolio server is running!");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
