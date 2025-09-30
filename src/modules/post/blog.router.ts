import express from "express";
import { requireAdmin } from "../../middleware/checkAuth";
import { BlogController } from "./blog.controller";

const router = express.Router();
router.get("/stats", requireAdmin, BlogController.getBlogStat);

router.post("/", BlogController.createBlog);

router.get("/", BlogController.getAllPosts);
router.get("/:id", BlogController.getPostById);
router.patch("/:id", requireAdmin, BlogController.updatePost);
router.delete("/:id", requireAdmin, BlogController.deletePost);

export const blogRouter = router;
