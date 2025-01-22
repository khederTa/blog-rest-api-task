import express from "express";
import { RequestHandler } from "express-serve-static-core";

import { verifyToken, authorize, checkOwnership } from "../middleware/auth";
import { validate } from "../middleware/validations/validate";
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../handlers/blog";
import { blogValidation } from "../middleware/validations/blog.validations";
import { paginate } from "../middleware/pagination";
import { BlogModel } from "../models/blog.model";

const router = express.Router();

// Public routes
/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get paginated list of blogs
 *     tags:
 *       - Blogs
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to fetch.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to fetch per page.
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           example: '{"content":"Lorem Lorem"}'
 *         description: >
 *           Filters the blogs dynamically by attributes. Provide as a JSON string.
 *           Example:
 *           - `?filter={"author":"user123"}`
 *           - `?filter={"title":"SWAGGER"}`
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: '{"title":1}'
 *         description: >
 *           Sorts the blogs dynamically by attributes. Provide as a JSON string.
 *           Use `1` for ascending and `-1` for descending.
 *           Example:
 *           - `?sort={"title":1}`
 *           - `?sort={"createdAt":-1}`
 *     responses:
 *       200:
 *         description: Paginated list of blogs
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "64b7e8f1c9f4b3a7d4e5f6g7"
 *                   title: "Sample Blog"
 *                   content: "This is a sample blog post."
 *                   author:
 *                     _id: "user123"
 *                     username: "john_doe"
 *                   createdAt: "2023-07-20T12:34:56.789Z"
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 50
 *                 totalPages: 5
 *                 hasNext: true
 *                 hasPrevious: false
 *       400:
 *         description: Invalid query format
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Invalid sort or filter query format. Use a valid JSON string."
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  paginate(BlogModel, {
    sort: { createdAt: -1 },
    populate: {
      path: "author",
      select: "username email",
    },
  }) as RequestHandler,
  getBlogs as RequestHandler
);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blogs]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {_id: "64b7e8f1c9f4b3a7d4e5f6g7", title: "Sample Blog", content: "Blog content...", author: {_id: "user123", username: "john_doe"}, createdAt: "2023-07-20T12:34:56.789Z"}
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getBlogById as RequestHandler);

// Protected routes

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog (Authenticated)
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Blog Post"
 *               content:
 *                 type: string
 *                 example: "This is the content of my first blog post..."
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {_id: "64b7e8f1c9f4b3a7d4e5f6g7", title: "Sample Blog", content: "Blog content...", author: "user123", createdAt: "2023-07-20T12:34:56.789Z"}
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation failed"
 *               errors: [{field: "title", message: "Title must be at least 5 characters long"}]
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  verifyToken as RequestHandler,
  blogValidation,
  validate as RequestHandler,
  createBlog
);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     summary: Update a blog (Owner or Admin)
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Blog Title"
 *               content:
 *                 type: string
 *                 example: "Updated blog content..."
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       403:
 *         description: Forbidden (Not owner/admin)
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  verifyToken as RequestHandler,
  checkOwnership("Blog") as RequestHandler,
  blogValidation,
  validate as RequestHandler,
  updateBlog as RequestHandler
);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not admin)
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  verifyToken as RequestHandler,
  authorize(["ADMIN"]) as RequestHandler,
  deleteBlog as RequestHandler
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export default router;
