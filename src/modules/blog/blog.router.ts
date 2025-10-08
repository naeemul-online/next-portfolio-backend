import express from "express";
import { BlogController } from "./blog.controller";

const router = express.Router();
router.get("/stats", BlogController.getBlogStat);

router.post("/", BlogController.createBlog);

router.get("/", BlogController.getAllBlog);

router.get("/:id", BlogController.getBlogById);
router.patch("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

export const blogRouter = router;
