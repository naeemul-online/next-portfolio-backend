"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middleware/checkAuth");
const blog_controller_1 = require("./blog.controller");
const router = express_1.default.Router();
router.get("/stats", checkAuth_1.authenticateToken, checkAuth_1.requireAdmin, blog_controller_1.BlogController.getBlogStat);
router.post("/", blog_controller_1.BlogController.createBlog);
router.get("/", blog_controller_1.BlogController.getAllBlog);
router.get("/:id", blog_controller_1.BlogController.getBlogById);
router.patch("/:id", checkAuth_1.authenticateToken, checkAuth_1.requireAdmin, blog_controller_1.BlogController.updateBlog);
router.delete("/:id", checkAuth_1.authenticateToken, checkAuth_1.requireAdmin, blog_controller_1.BlogController.deleteBlog);
exports.blogRouter = router;
