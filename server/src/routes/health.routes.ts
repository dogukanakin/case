import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Simple health check endpoint
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

export default router; 