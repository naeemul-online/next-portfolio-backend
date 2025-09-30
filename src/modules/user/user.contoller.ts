import { Role } from "@prisma/client";
import { Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result,
      },
    });
  } catch (error: any) {
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
};

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    // const authHeader = req.headers.authorization;
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No cookie found" });
    }

    const token = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    ) as JwtPayload;

    if (decoded.role !== Role.ADMIN) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admins only" });
    }

    const result = await UserService.getAllFromDB();
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUserById(Number(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.updateUser(
      Number(req.params.id),
      req.body
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.deleteUser(Number(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const UserController = {
  createUser,
  getAllFromDB,
  getUserById,
  updateUser,
  deleteUser,
};
