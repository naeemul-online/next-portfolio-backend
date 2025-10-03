import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/checkAuth";
import { BlogService } from "./blog.service";

const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.user!.id;
    const result = await BlogService.createBlog(req.body, id);
    res.status(201).json(result);
  } catch (error: any) {
    console.error(error);
    if (error.message.includes("A blog post with this slug already exists")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).send(error);
  }
};

const getBlogStat = async (req: Request, res: Response) => {
  try {
    const result = await BlogService.getBlogStat();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats", details: err });
  }
};

const getAllBlog = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = (req.query.search as string) || "";
    const featured = req.query.featured
      ? req.query.featured === "true"
      : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const result = await BlogService.getAllBlog({
      page,
      limit,
      search,
      featured,
      tags,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts", details: err });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const result = await BlogService.getBlogById(Number(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, status: "Post not found!" });
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const post = await BlogService.updateBlog(Number(req.params.id), req.body);
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      status: "Update failed! Something went wrong..",
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    await BlogService.deleteBlog(Number(req.params.id));
    res.send(200).json({ status: true, message: "Post deleted" });
  } catch (error) {
    res.json({ status: false, details: error });
  }
};

export const BlogController = {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogStat,
};
