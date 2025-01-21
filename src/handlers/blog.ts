import { Request, Response } from "express-serve-static-core";
import { BlogModel } from "../models/blog.model";
import { ResponseObject } from "../types/response";
import { AuthenticatedRequest } from "../types/jwt";
import { Blog } from "../types/blog";

// Get all blogs with pagination
export const getBlogs = async (
  request: Request,
  response: Response & { paginatedResults: ResponseObject }
) => {
  if (!response.paginatedResults) {
    return response.status(500).json({
      success: false,
      message: "Pagination results not found",
    });
  }

  response.json(response.paginatedResults);
};

// Get single blog
export const getBlogById = async (
  request: Request,
  response: Response<ResponseObject>
) => {
  const blog = await BlogModel.findById(request.params.id).populate(
    "author",
    "username email"
  );

  if (!blog) {
    return response.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  response.status(200).json({
    success: true,
    data: blog,
  });
};

// Create new blog
export const createBlog = async (
  request: AuthenticatedRequest<{}, {}, Blog>,
  response: Response<ResponseObject>
) => {
  const blog = await BlogModel.create({
    title: request.body.title,
    content: request.body.content,
    author: request.userId,
  });

  const populatedBlog = await blog.populate("author", "username email");

  response.status(201).json({
    success: true,
    data: populatedBlog,
  });
};

// Update blog
export const updateBlog = async (
  request: AuthenticatedRequest<{ id: string }, {}, Blog>,
  response: Response<ResponseObject>
) => {
  const blog = await BlogModel.findByIdAndUpdate(
    request.params.id,
    {
      title: request.body.title,
      content: request.body.content,
      updatedAt: Date.now(),
    },
    { new: true }
  ).populate("author", "username email");

  if (!blog) {
    return response.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  response.status(200).json({
    success: true,
    data: blog,
  });
};

// Delete blog (admin only)
export const deleteBlog = async (
  request: Request,
  response: Response<ResponseObject>
) => {
  const blog = await BlogModel.findByIdAndDelete(request.params.id);

  if (!blog) {
    return response.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  response.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
};
