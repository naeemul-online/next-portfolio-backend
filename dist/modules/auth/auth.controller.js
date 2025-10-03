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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const loginWithEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.AuthService.loginWithEmailAndPassword(req.body);
        res
            .cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        })
            .status(200)
            .json({
            success: true,
            message: "You are logged in successfully!",
            data: result,
        });
    }
    catch (error) {
        if (error.message.includes("User not found!")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        else if (error.message.includes("Incorrect password!")) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        res.status(500).send(error);
    }
});
const logout = (req, res) => {
    res.clearCookie("token").status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
const authWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield auth_service_1.AuthService.authWithGoogle(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.AuthController = {
    loginWithEmailAndPassword,
    logout,
    authWithGoogle,
};
