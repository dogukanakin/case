import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { 
  IAuthRequest, 
  IUserRegisterRequest, 
  IUserLoginRequest, 
  IUserPasswordChangeRequest,
  IUserResponse
} from '../interfaces/user.interfaces';
import { IErrorResponse } from '../interfaces/response.interfaces';

// Generate JWT Token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as IUserRegisterRequest;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields' } as IErrorResponse);
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' } as IErrorResponse);
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      const userResponse: IUserResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken((user._id as mongoose.Types.ObjectId).toString()),
      };
      
      res.status(201).json(userResponse);
    } else {
      res.status(400).json({ error: 'Invalid user data' } as IErrorResponse);
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Server error during registration' } as IErrorResponse);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as IUserLoginRequest;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' } as IErrorResponse);
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' } as IErrorResponse);
    }

    const userResponse: IUserResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken((user._id as mongoose.Types.ObjectId).toString()),
    };
    
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: 'Server error during login' } as IErrorResponse);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' } as IErrorResponse);
    }

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' } as IErrorResponse);
    }

    const userResponse: IUserResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };
    
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ error: 'Server error when fetching profile' } as IErrorResponse);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' } as IErrorResponse);
    }

    const { currentPassword, newPassword } = req.body as IUserPasswordChangeRequest;

    // Check if current password and new password are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Please provide current password and new password' 
      } as IErrorResponse);
    }

    // Check if new password meets requirements
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      } as IErrorResponse);
    }

    // Find user with password included
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' } as IErrorResponse);
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' } as IErrorResponse);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    // Return success response with updated user
    const userResponse: IUserResponse = {
      _id: user._id,
      username: user.username,
      email: user.email
    };

    res.status(200).json({
      message: 'Password changed successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ 
      error: 'Server error while changing password' 
    } as IErrorResponse);
  }
}; 