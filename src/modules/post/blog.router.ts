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
router.get("/:id", BlogController.getPostById);
router.patch("/:id", requireAdmin, BlogController.updatePost);
router.delete("/:id", requireAdmin, BlogController.deletePost);

export const blogRouter = router;
