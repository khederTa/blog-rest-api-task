
# Blog REST API

A RESTful API for a blog application built with Node.js, Express, TypeScript, and MongoDB. Features user authentication, role-based authorization, and Swagger documentation.

## Features

- User authentication (JWT cookie-based)
- Role-based authorization (User/Admin)
- Blog CRUD operations
- Input validation
- Error handling
- Swagger API documentation
- MongoDB database
- TypeScript support

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/khederTa/blog-rest-api-task.git
cd blog-rest-api-task
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory, check .env.example for more information.

### 4. Start the Server
```bash
# Development mode (with hot-reload)
npm run start:dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

Access Swagger UI at:  
[http://localhost:3000/docs](http://localhost:3000/docs)

For JSON Version:  
[http://localhost:3000/docs.json](http://localhost:3000/docs.json)

### Using the Documentation
1. Open the Swagger UI in your browser
2. For protected endpoints:
   - First authenticate using `/api/auth/login`
   - Click "Authorize" (top-right lock icon)
   - Enter your JWT token from the login response
3. Explore available endpoints with interactive documentation

## Project Structure
```
src/
├── handlers/       # Route controllers
├── lib/            # Database Connection Configuration
├── middleware/     # Auth and validation
├── models/         # Database models
├── routes/         # API endpoints
├── types/          # Type definitions
├── utils/          # Helper functions
└── index.ts        # Server entry point
```

### Pagination Logic

- Fetches data in chunks using `page` and `limit` query parameters.  
- Supports:  
  - **Dynamic filtering** via the `filter` query by the following pattern `?filter={"<attribute_name>":"<attribute_value>"}` (e.g., `?filter={"author":"<user_id>"}` or `?filter={"title":"<blog_title>"}`).  
  - **Dynamic sorting** via the `sort` query by the following pattern `?sort={"attribute_name":< 1 OR -1 >}` where `1` for `ASC` and `-1` for `DESC` (e.g., `?sort={"title": 1}` or `?sort={"title":-1}`).  
- Handles optional field population with Mongoose's `.populate()` for related data.  
- Returns a response with:  
  - **Data**: The requested paginated results.  
  - **Metadata**: Includes `page`, `limit`, `total`, `totalPages`, and navigation flags (`hasNext`, `hasPrevious`).  
- Simplifies API usage for large datasets.  