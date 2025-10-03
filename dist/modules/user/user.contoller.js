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
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("./user.service");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: result,
            },
        });
    }
    catch (error) {
        console.log("Registration error", error);
        if (error.message.includes("already exists")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error during registration",
        });
    }
});
const getAllFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // const authHeader = req.headers.authorization;
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized: No cookie found" });
        }
        const token = (_a = cookieHeader
            .split("; ")
            .find((row) => row.startsWith("token="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized: Token missing" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== client_1.Role.ADMIN) {
            return res
                .status(403)
                .json({ success: false, message: "Forbidden: Admins only" });
        }
        const result = yield user_service_1.UserService.getAllFromDB();
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res
            .status(401)
            .json({ success: false, message: "Invalid or expired token" });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.getUserById(Number(req.params.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.updateUser(Number(req.params.id), req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.deleteUser(Number(req.params.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.UserController = {
    createUser,
    getAllFromDB,
    getUserById,
    updateUser,
    deleteUser,
};
