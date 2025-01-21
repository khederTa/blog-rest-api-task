# Blog REST API

A RESTful API for a blog application built with Node.js, Express, TypeScript, and MongoDB. Features user authentication, role-based authorization, and Swagger documentation.

---

## Features

- User authentication (JWT cookie-based)  
- Role-based authorization (User/Admin)  
- Blog CRUD operations  
- Input validation  
- Error handling  
- Swagger API documentation  
- MongoDB database  
- TypeScript support  

---

## Getting Started With The Dockerized Blog REST API

This application is ready for Docker. Follow these steps to set up and run the Dockerized version.

---

### Prerequisites

Ensure you have the following installed:
- **Docker**: [Install Docker](https://www.docker.com/get-started)  
- **Docker Compose**: Comes with Docker Desktop.

---

### 1. Clone the `dockerized-blog-rest-api-task` Branch

Switch to the branch containing the Docker setup:
```bash
git clone -b dockerized-blog-rest-api-task https://github.com/khederTa/blog-rest-api-task.git
cd blog-rest-api-task
```

---

### 2. Environment Variables for Docker

Create a `.env` file in the root directory and provide the following environment variables:
```env
NODE_ENV=production
MONGO_URI=<your_mongodb_connection_string>
PORT=3000
```

---

### 3. Build and Run with Docker Compose

Run the following command:
```bash
docker-compose up --build
```

---

### 4. Access the Application

The application will be accessible at:
```
http://localhost:3000
```

To stop the application:
```bash
docker-compose down
```

---

## Docker File Descriptions

### `.dockerignore`

The `.dockerignore` file ensures unnecessary files are excluded from the Docker build context:
```plaintext
node_modules
dist
.env
.dockerignore
```

### `Dockerfile`

The `Dockerfile` defines the steps to build the container:
```dockerfile
# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
```

### `docker-compose.yml`

The `docker-compose.yml` file defines the service configuration:
```yaml
version: "3.8"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=<your_mongodb_connection_string>
    volumes:
      - .:/app
      - /app/node_modules
    command: npm start
```

---

## API Documentation

Access Swagger UI at:  
[http://localhost:3000/docs](http://localhost:3000/docs)  

For JSON Version:  
[http://localhost:3000/docs.json](http://localhost:3000/docs.json)

---

## Project Structure

```
src/
├── handlers/       # Route controllers
├── lib/            # Database connection configuration
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
  - **Dynamic sorting** via the `sort` query by the following pattern `?sort={"attribute_name":< 1 || -1 >}` where `1` for `ASC` and `-1` for `DESC` (e.g., `?sort={"title": 1}` or `?sort={"title":-1}`).  
- Handles optional field population with Mongoose's `.populate()` for related data.  
- Returns a response with:  
  - **Data**: The requested paginated results.  
  - **Metadata**: Includes `page`, `limit`, `total`, `totalPages`, and navigation flags (`hasNext`, `hasPrevious`).  
- Simplifies API usage for large datasets.  