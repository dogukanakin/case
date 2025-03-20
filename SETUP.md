# To-Do App Setup Guide

This guide explains how to set up and run the To-Do application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Docker Setup

Run the entire application with a single command:

```bash
docker-compose up -d
```

This command will start:
- Backend service at http://localhost:5001
- Frontend service at http://localhost:3000
- MongoDB service (for local development)

To stop the application:

```bash
docker-compose down
```

## Environment Variables

You can configure the application by editing the `.env` file. Important settings:

- `BACKEND_PORT`: Port for the backend service (default: 5001)
- `FRONTEND_PORT`: Port for the frontend service (default: 3000)
- `MONGODB_URI`: MongoDB connection URL (you can use the included MongoDB service or your own)
- `JWT_SECRET`: Secret key for JWT token encryption
- `JWT_EXPIRES_IN`: JWT token expiration period
- `OPENAI_API_KEY`: OpenAI API key (for Todo recommendations)

## Viewing Logs

To view the logs of the Docker containers:

```bash
# View logs for all services
docker-compose logs -f

# View only backend logs
docker-compose logs -f backend

# View only frontend logs
docker-compose logs -f frontend

# View MongoDB logs
docker-compose logs -f mongodb
```

## MongoDB

The docker-compose.yml includes a MongoDB service that stores data in a Docker volume. If you prefer to use an external MongoDB instance (like MongoDB Atlas), you can update the `MONGODB_URI` in the `.env` file.

Data persistence:
- MongoDB data is stored in a Docker volume named `mongodb_data`
- This ensures your data persists between container restarts

## Manual Setup (Without Docker)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
4. Edit the .env file with your MongoDB connection string and other settings.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an .env.local file:
   ```
   API_URL=http://localhost:5001/api
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```
