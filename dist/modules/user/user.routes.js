"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_contoller_1 = require("./user.contoller");
const router = express_1.default.Router();
router.get("/", user_contoller_1.UserController.getAllFromDB);
router.get("/:id", user_contoller_1.UserController.getUserById);
router.post("/", user_contoller_1.UserController.createUser);
router.patch("/:id", user_contoller_1.UserController.updateUser);
router.delete("/:id", user_contoller_1.UserController.deleteUser);
exports.userRouter = router;
