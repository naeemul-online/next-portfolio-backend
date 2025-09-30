import express from "express";
import { requireAdmin } from "../../middleware/checkAuth";
import { UserController } from "./user.contoller";

const router = express.Router();

router.get("/", UserController.getAllFromDB);

router.get("/:id", UserController.getUserById);

router.post("/", UserController.createUser);

router.patch("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

export const userRouter = router;
