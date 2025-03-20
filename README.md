# To-Do App Setup Guide

This guide explains how to set up and run the To-Do application using Docker.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Environment Setup

Before running the application, you need to set up your environment variables:

1. Copy the example environment file to create your own `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and update the variables with your own values:
   - Generate a secure JWT secret (you can use `openssl rand -base64 32`)
   - Set your MongoDB connection string
   - Add your OpenAI API key (for AI todo recommendations)


## Docker Setup

### Production Setup

Run the entire application in production mode:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

This command will start:
- Backend service at http://localhost:5001
- Frontend service at http://localhost:3000
- MongoDB service (for local development)

### Development Setup with Hot Reload

For development with hot reload (changes are reflected immediately):

```bash
docker-compose up -d
```

This setup mounts the local frontend directory to the container, allowing code changes to be automatically detected and reloaded in the browser.

### Stopping the Application

To stop the application:

```bash
docker-compose down
```

## Creating Test Users and Data

The application includes scripts to create test users and sample todo data:

1. Make sure your database is running and you have set up your `.env` file
2. To create test users only:
   ```bash
   cd server
   npm run seed:users
   ```
3. To create both test users and sample todos:
   ```bash
   cd server
   npm run seed
   ```

This will create the following test accounts:
- Admin User: admin@example.com / admin123456
- Test User: test@example.com / test123456
- Demo User: demo@example.com / demo123456

## Environment Variables

You can configure the application by editing the `.env` file. Important settings:

- `BACKEND_PORT`: Port for the backend service (default: 5001)
- `FRONTEND_PORT`: Port for the frontend service (default: 3000)
- `MONGODB_URI`: MongoDB connection URL (you can use the included MongoDB service or your own)
- `JWT_SECRET`: Secret key for JWT token encryption
- `JWT_EXPIRES_IN`: JWT token expiration period
- `OPENAI_API_KEY`: OpenAI API key (for Todo recommendations)

Example values can be found in the `.env.example` file. For a fresh installation, you should:
```bash
cp .env.example .env
# Then edit the .env file with your specific values
```

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
