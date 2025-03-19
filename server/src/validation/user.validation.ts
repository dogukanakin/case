import { z } from 'zod';

// Register User validation schema
export const registerUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .trim(),
  
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(50, 'Password must be less than 50 characters'),
});

// Login User validation schema
export const loginUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(1, 'Password is required'),
});

// Update User validation schema
export const updateUserSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .trim()
    .optional(),
  
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase()
    .optional(),
  
  currentPassword: z.string()
    .min(1, 'Current password is required')
    .optional(),
  
  newPassword: z.string()
    .min(6, 'New password must be at least 6 characters long')
    .max(50, 'New password must be less than 50 characters')
    .optional(),
}).refine(data => {
  // Eğer yeni şifre varsa, mevcut şifre de olmalı
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required when setting a new password",
  path: ["currentPassword"]
});

// Define types based on the schema
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>; 