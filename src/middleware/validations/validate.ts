import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ResponseObject, ValidationErrorResult } from "../../types/response";

export const validate = (
  request: Request,
  response: Response<ResponseObject>,
  next: NextFunction
) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    const errorMessages: ValidationErrorResult[] = errors
      .array()
      .map((error) => {
        if (error.type === "field") {
          return {
            field: error.path,
            message: error.msg,
          };
        }
        return {
          field: "general",
          message: error.msg,
        };
      });

    return response.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages, 
    });
  }

  next();
};
