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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.authenticateToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
// JWT Authentication Middleware
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // const authHeader = req.headers.authorization;
        const authHeader = req.headers.cookie;
        const token = authHeader &&
            ((_a = authHeader
                .split("; ")
                .find((row) => row.startsWith("token="))) === null || _a === void 0 ? void 0 : _a.split("=")[1]);
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Access token is required",
            });
            return;
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user in database
        const user = yield prisma.user.findUnique({
            where: { email: decoded.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid token - user not found",
            });
            return;
        }
        // Add user to request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: "Token expired",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Token verification failed",
        });
    }
});
exports.authenticateToken = authenticateToken;
// Admin Only Middleware
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            message: "Authentication required",
        });
        return;
    }
    if (req.user.role !== "ADMIN") {
        res.status(403).json({
            success: false,
            message: "Admin access required",
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
