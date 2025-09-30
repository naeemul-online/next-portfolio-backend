import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const loginWithEmailAndPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginWithEmailAndPassword(req.body);

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
  } catch (error: any) {
    if (error.message.includes("User not found!")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (error.message.includes("Incorrect password!")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).send(error);
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

const authWithGoogle = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.authWithGoogle(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const AuthController = {
  loginWithEmailAndPassword,
  logout,
  authWithGoogle,
};
