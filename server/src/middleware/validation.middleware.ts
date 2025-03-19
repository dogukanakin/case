import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse only the request body, not the entire request
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format the validation errors into a more readable structure
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        return res.status(400).json({
          message: 'Validation error',
          errors: formattedErrors,
        });
      }
      
      // If it's not a ZodError, pass it to the next error handler
      return res.status(500).json({
        message: 'Internal server error during validation',
      });
    }
  };
}; 