import mongoose from 'mongoose';
import { Request } from 'express';

// User document interface
export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isModified(path: string): boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// JWT payload interface
export interface IJwtPayload {
  id: string;
}

// User registration request
export interface IUserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

// User login request
export interface IUserLoginRequest {
  email: string;
  password: string;
}

// User password change request
export interface IUserPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// User response (sent to client)
export interface IUserResponse {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  token?: string;
}

// Auth request with user (after auth middleware)
export interface IAuthRequest extends Request {
  user?: IUser;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
} 