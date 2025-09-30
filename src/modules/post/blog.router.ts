import express from "express";
import { authenticateToken, requireAdmin } from "../../middleware/checkAuth";
import { BlogController } from "./blog.controller";

const router = express.Router();
router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  BlogController.getBlogStat
);

router.post("/", authenticateToken, requireAdmin, BlogController.createBlog);

router.get("/", BlogController.getAllBlog);
router.get("/:id", BlogController.getBlogById);
router.patch("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deletePost);

export const blogRouter = router;
