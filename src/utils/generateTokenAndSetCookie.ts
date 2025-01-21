import { Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { User } from "../types/user";

export const generateTokenAndSetCookie = (
  response: Response,
  user: User
) => {
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
