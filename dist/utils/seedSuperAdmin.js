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
exports.seedSuperAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create admin user
        const adminEmail = process.env.ADMIN_EMAIL || "naeem@portfolio.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
        const adminName = process.env.ADMIN_NAME || "Portfolio Admin Naeem";
        // Check if admin user already exists
        const existingAdmin = yield db_1.prisma.user.findUnique({
            where: { email: adminEmail },
        });
        let adminUser;
        if (existingAdmin) {
            console.log("✅ Admin user already exists!!");
            adminUser = existingAdmin;
        }
        else {
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(adminPassword, 12);
            // Create admin user
            adminUser = yield db_1.prisma.user.create({
                data: {
                    name: adminName,
                    email: adminEmail,
                    password: hashedPassword,
                    role: "ADMIN",
                },
            });
            console.log("✅ Admin user created successfully!!");
        }
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
    finally {
        yield db_1.prisma.$disconnect();
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
