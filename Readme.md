# Library Management API

A RESTful API for managing a library system built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- User Management
- Book Management
- Borrowing System
- Score/Rating System
- Request Validation
- Detailed Logging

## Tech Stack

- Node.js & TypeScript
- Express.js
- PostgreSQL with Knex.js
- Docker & Docker Compose
- Winston Logger
- Joi Validation

## Getting Started

1. Clone the repository
2. Copy the environment file:

```bash
cp .env.example .env
```

3. Start the application:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID with their book history
- `POST /users` - Create a new user
- `POST /users/:userId/borrow/:bookId` - Borrow a book
- `POST /users/:userId/return/:bookId` - Return a book with rating

### Books

- `GET /books` - Get all books
- `GET /books/:id` - Get a book by ID with average rating
- `POST /books` - Create a new book