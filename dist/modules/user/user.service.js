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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../config/db");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = payload;
    const existingUser = yield db_1.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });
    if (existingUser) {
        throw new Error("User already exists with this email");
    }
    const saltRound = 12;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRound);
    const newUser = yield db_1.prisma.user.create({
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
        },
    });
    return newUser;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.user.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.UserService = {
    createUser,
    getAllFromDB,
    getUserById,
    updateUser,
    deleteUser,
};
