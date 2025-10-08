"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const blog_service_1 = require("./blog.service");
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_service_1.BlogService.createBlog(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        if (error.message.includes("A blog post with this slug already exists")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).send(error);
    }
});
const getBlogStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blog_service_1.BlogService.getBlogStat();
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch stats", details: err });
    }
});
const getAllBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        const featured = req.query.featured
            ? req.query.featured === "true"
            : undefined;
        const tags = req.query.tags ? req.query.tags.split(",") : [];
        const result = yield blog_service_1.BlogService.getAllBlog({
            page,
            limit,
            search,
            featured,
            tags,
        });
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch posts", details: err });
    }
});
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid blog ID" });
        }
        const result = yield blog_service_1.BlogService.getBlogById(id);
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(404).json({ success: false, status: "Post not found!" });
    }
});
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield blog_service_1.BlogService.updateBlog(Number(req.params.id), req.body);
        res.json(post);
    }
    catch (error) {
        console.error(error);
        res.status(404).json({
            success: false,
            status: "Update failed! Something went wrong..",
        });
    }
});
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield blog_service_1.BlogService.deleteBlog(Number(req.params.id));
        res.send(200).json({ status: true, message: "Post deleted" });
    }
    catch (error) {
        res.json({ status: false, details: error });
    }
});
exports.BlogController = {
    createBlog,
    getAllBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogStat,
};
