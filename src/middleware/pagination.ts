import { Request, Response, NextFunction } from "express-serve-static-core";
import { Model, PopulateOptions, Types } from "mongoose";
import { PaginationOptions } from "../types/paginate";
import { ResponseObject } from "../types/response";

export const paginate = <T>(
  model: Model<T>,
  options?: PaginationOptions<T>
) => {
  return async (
    req: Request,
    res: Response & { paginatedResults: ResponseObject<T> },
    next: NextFunction
  ) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Base query filter
    let filter: Record<string, any> = {
      ...options?.filter,
      ...(req.query.filter
        ? JSON.parse(decodeURIComponent(req.query.filter as string))
        : {}),
    };

    // Transform string-based filters to case-insensitive regex for partial matching
    for (const key in filter) {
      const schemaPath = model.schema.path(key);
      if (typeof filter[key] === "string") {
        if (schemaPath && schemaPath.instance === "String") {
          // Apply regex for string fields
          filter[key] = { $regex: filter[key], $options: "i" };
        } else if (schemaPath && schemaPath.instance === "ObjectId") {
          // Convert to ObjectId for fields of type ObjectId
          filter[key] = new Types.ObjectId(filter[key]);
        }
      }
    }

    // Parse sorting criteria from query
    let sort = options?.sort || {};
    if (req.query.sort) {
      try {
        sort = JSON.parse(req.query.sort as string);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid sort query format. Use a JSON object.",
        });
      }
    }

    let query = model.find(filter);

    // Handle population with type safety
    if (options?.populate) {
      const populateOptions: PopulateOptions | string =
        typeof options.populate === "string"
          ? {
              path: options.populate.split(" ")[0],
              select: options.populate.split(" ").slice(1).join(" "),
            }
          : options.populate;

      query = query.populate(populateOptions as PopulateOptions);
    }

    if (sort) query = query.sort(sort);

    const [total, results] = await Promise.all([
      model.countDocuments(filter),
      query.skip(skip).limit(limit).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.paginatedResults = {
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };

    next();
  };
};
