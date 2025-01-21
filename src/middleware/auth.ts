import { Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, JwtPayload } from "../types/jwt";
import mongoose from "mongoose";

// Verify JWT token and attach user to request
export const verifyToken = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
) => {
  const token = request.cookies.token;

  if (!token) {
    return response.status(401).json({
      success: false,
      message: "Authentication required - No token provided",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (!decoded)
    return response
      .status(401)
      .json({ success: false, message: "Unauthorized - invalid token" });
  // Attach user information to the request
  request.userId = decoded.userId;

  request.role = decoded.role;

  next();
};

// Role-based authorization middleware
export const authorize = (allowedRoles: string[]) => {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
  ) => {
    if (!request.role) {
      return response.status(403).json({
        success: false,
        message: "Access denied - No permissions found",
      });
    }

    if (!allowedRoles.includes(request.role)) {
      return response.status(403).json({
        success: false,
        message: "Access denied - Insufficient permissions",
      });
    }

    next();
  };
};

// Ownership check middleware (for user-specific resources)
export const checkOwnership = (resourceType: string) => {
  return async (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction
  ) => {
    const resource = await mongoose
      .model(resourceType)
      .findById(request.params.id);

    if (!resource) {
      return response.status(404).json({
        success: false,
        message: `${resourceType} not found`,
      });
    }

    const isOwner = resource.author.toString() === request.userId;
    const isAdmin = request.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return response.status(403).json({
        success: false,
        message: "You don't have permission to modify this resource",
      });
    }

    next();
  };
};
