import { Request, Response, NextFunction } from "express";
import { ErrorType } from "../types/error";

export const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = "An unexpected error occurred";
  let stack: string | undefined;

  // Handle known error structure
  if (isErrorType(error)) {
    statusCode = error.status || 500;
    message = error.message || "Something went wrong";
    stack = process.env.NODE_ENV === "production" ? undefined : error.stack;
  }

  // Log error details
  console.error(`[${new Date().toISOString()}] Error:`, {
    status: statusCode,
    message,
    path: request.path,
    method: request.method,
    stack: process.env.NODE_ENV !== "production" ? stack : undefined,
  });

  // Send error response
  response.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack }),
  });
};

// Type guard for custom error type
function isErrorType(error: unknown): error is ErrorType {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error
  );
}
