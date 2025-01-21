import { Express, Request, Response } from "express-serve-static-core";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API Docs",
      version,
      description: "API documentation with cookie-based authentication",
    },
    servers: [
        {
          url: "http://localhost:3000/api",
          description: "Development server"
        }
      ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT stored in cookie",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Blog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64b7e8f1c9f4b3a7d4e5f6g7",
            },
            title: {
              type: "string",
              example: "Sample Blog Title",
            },
            content: {
              type: "string",
              example: "Blog content...",
            },
            author: {
              type: "string",
              example: "64b7e8f1c9f4b3a7d4e5f6g8",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication operations",
      },
      {
        name: "Blogs",
        description: "Blog management operations",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger UI
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        requestInterceptor: (request: Request & { credentials: string }) => {
          request.credentials = "include"; 
          return request;
        },
        persistAuthorization: true, 
      },
      customSiteTitle: "Blog API Docs",
      customCss: ".opblock-summary-path { font-weight: bold; }",
    })
  );

  // JSON endpoint
  app.get("/docs.json", (request: Request, response: Response) => {
    response.setHeader("Content-Type", "application/json");
    response.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
