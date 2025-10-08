"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const blog_router_1 = require("./modules/blog/blog.router");
const user_routes_1 = require("./modules/user/user.routes");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enables Cross-Origin Resource Sharing
app.use((0, compression_1.default)()); // Compresses response bodies for faster delivery
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // Parse incoming JSON requests
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    // credentials: true,
}));
app.use("/api/v1/user", user_routes_1.userRouter);
app.use("/api/v1/blog", blog_router_1.blogRouter);
app.use("/api/v1/auth", auth_routes_1.authRouter);
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
exports.default = app;
