import { z } from 'zod';
import { Priority } from '../models/todo.model';

// Create Todo validation schema
export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  tags: z.array(z.string().max(20)).max(5, 'Maximum 5 tags allowed').optional().default([]),
});

// Update Todo validation schema
export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  completed: z.boolean().optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  tags: z.array(z.string().max(20)).max(5, 'Maximum 5 tags allowed').optional().default([]),
});

// Define types based on the schema
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>; 