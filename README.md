# WTWT - Movie Recommendation System

> ⚠️ **Work In Progress** - This project is currently under active development.

## Overview

WTWT is a movie recommendation system that helps users discover movies based on their preferences. The system uses AI-powered recommendations to suggest movies tailored to each user's taste.

## Project Structure

The project is organized into two main parts:

```
wtwt2/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── scripts/  # Setup and utility scripts
│   │   ├── services/
│   │   └── types/
│   └── docker/       # Docker configuration for MongoDB
└── frontend/         # React application
    └── src/
        ├── components/
        ├── hooks/
        ├── routes/
        ├── services/
        └── types/
```

## Technologies

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** - Database (via Docker)
- **OpenAI** - AI-powered recommendations
- **bcrypt** - Password hashing
- **Axios** - HTTP client
- **Zod** - Schema validation

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Development Tools
- **Docker** - MongoDB containerization
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run multiple npm scripts

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose** (for MongoDB)

## Configuration

### 1. Install Dependencies

From the project root, install all dependencies:

```bash
npm install
```

This will install dependencies for both the backend and frontend workspaces.

### 2. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=wtwt2

# Server
PORT=3001
CORS_ORIGIN=http://localhost:5173

# OpenAI (for recommendations)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start MongoDB

Start the MongoDB container using Docker Compose:

```bash
npm run docker:up
```

Or manually:

```bash
docker-compose -f backend/docker/mongo.yml up
```

### 4. Create a User

Create your first user account:

```bash
npm run create-user
```

This script will prompt you for:
- Username
- Email
- Password

### 5. Fetch Base Data

Populate the database with genres and countries from TMDB:

```bash
# Update genres
npm run update-genres --workspace=backend

# Update countries
npm run update-countries --workspace=backend
```

### 6. Generate Recommendations

Generate initial recommendations for all users:

```bash
npm run generate-recommendations
```

## Launching the Project

### Development Mode

To run both the backend and frontend in development mode (with MongoDB):

```bash
npm run dev
```

This command will:
1. Start MongoDB in Docker
2. Start the backend server (http://localhost:3001)
3. Start the frontend dev server (http://localhost:5173)

### Individual Services

You can also run services individually:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# MongoDB only
npm run docker:up
```

### Production Build

Build the project for production:

```bash
# Build backend
npm run build --workspace=backend

# Build frontend
npm run build --workspace=frontend

# Start backend (after build)
npm run start --workspace=backend
```

## Available Scripts

### Root Level
- `npm run dev` - Start all services (MongoDB, backend, frontend)
- `npm run docker:up` - Start MongoDB container
- `npm run docker:down` - Stop MongoDB container
- `npm run docker:logs` - View MongoDB logs
- `npm run create-user` - Create a new user
- `npm run generate-recommendations` - Generate recommendations for all users

### Backend Scripts
- `npm run dev --workspace=backend` - Start backend in development mode
- `npm run build --workspace=backend` - Build backend
- `npm run start --workspace=backend` - Start backend in production mode
- `npm run create-user --workspace=backend` - Create a new user
- `npm run update-genres --workspace=backend` - Update genres from TMDB
- `npm run update-countries --workspace=backend` - Update countries from TMDB
- `npm run generate-recommendations --workspace=backend` - Generate recommendations

### Frontend Scripts
- `npm run dev --workspace=frontend` - Start frontend dev server
- `npm run build --workspace=frontend` - Build frontend for production
- `npm run preview --workspace=frontend` - Preview production build

## Project Status

This project is actively being developed. Features and APIs may change without notice.

## License

ISC

## Author

Yannick Tirand

