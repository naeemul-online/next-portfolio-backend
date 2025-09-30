import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { prisma } from "../../config/db";

const loginWithEmailAndPassword = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  // find user by email
  const user = await prisma.user.findUnique({
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
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Incorrect password!");
  }

  // generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role } as JwtPayload,
    process.env.JWT_SECRET as Secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as SignOptions
  );

  //remove password from response
  const { password: removedPassword, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token,
  };
};

const authWithGoogle = async (data: Prisma.UserCreateInput) => {
  let user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data,
    });
  }

  return user;
};

export const AuthService = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
