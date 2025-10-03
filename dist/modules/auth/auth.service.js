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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const loginWithEmailAndPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // find user by email
    const user = yield db_1.prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
        },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found!");
    }
    // Verify password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Incorrect password!");
    }
    // generate token
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
    //remove password from response
    const { password: removedPassword } = user, userWithoutPassword = __rest(user, ["password"]);
    return {
        user: userWithoutPassword,
        token,
    };
});
const authWithGoogle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield db_1.prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (!user) {
        user = yield db_1.prisma.user.create({
            data,
        });
    }
    return user;
});
exports.AuthService = {
    loginWithEmailAndPassword,
    authWithGoogle,
};
