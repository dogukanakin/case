import mongoose from 'mongoose';
import { Request } from 'express';
import { IUser } from './user.interfaces';

// Priority enum
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Todo document interface
export interface ITodo {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  recommendation: string;
  imageUrl?: string;
  fileName?: string;
  fileUrl?: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Create todo request
export interface ICreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

// Update todo request
export interface IUpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  removeImage?: boolean;
  removeFile?: boolean;
}

// Todo filter parameters
export interface ITodoFilterParams {
  status?: 'active' | 'completed';
  priority?: Priority;
  search?: string;
  page?: number;
  limit?: number;
}

// Todo pagination response
export interface ITodoPaginationResponse {
  todos: ITodo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

// Authenticated request with user property
export interface IAuthenticatedRequest extends Request {
  user?: IUser;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  };
} 