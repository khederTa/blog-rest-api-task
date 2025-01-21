import { Request, Response } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import { User, UserInput } from "../types/user";
import { UserModel } from "../models/user.model";
import { ResponseObject } from "../types/response";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";

export const sayHi = (request: Request, response: Response) => {
  response.send("hi");
};

export const signup = async (
  request: Request<{}, {}, UserInput>,
  response: Response<ResponseObject<User>>
) => {
  const { username, email, password } = request.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return response
      .status(400)
      .json({ success: false, message: "User already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });

  generateTokenAndSetCookie(response, user);

  const userObject = user.toObject();
  delete userObject.password;

  response.status(201).json({
    success: true,
    message: "User created successfully",
    user: userObject,
  });
};

export const login = async (
  request: Request<{}, {}, UserInput>,
  response: Response<ResponseObject<User>>
) => {
  const { email, password } = request.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return response
      .status(400)
      .json({ success: false, message: "Invalid credentials." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) {
    return response
      .status(400)
      .json({ success: false, message: "Invalid credentials." });
  }

  generateTokenAndSetCookie(response, user);

  user.lastLogin = new Date();
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;

  response.status(200).json({
    success: true,
    user: userObject,
  });
};
export const logout = async (
  request: Request<{}, {}, UserInput>,
  response: Response<ResponseObject<User>>
) => {
  response.clearCookie("token");
  response
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
