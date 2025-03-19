import express from 'express';
import { 
  getTodos, 
  getTodoById, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} from '../controllers/todo.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createTodoSchema, updateTodoSchema } from '../validation/todo.validation';

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(protect);

// GET all todos for the logged-in user
router.get('/', getTodos);

// GET a single todo by ID
router.get('/:id', getTodoById);

// POST create a new todo
router.post('/', validate(createTodoSchema), createTodo);

// PUT update a todo
router.put('/:id', validate(updateTodoSchema), updateTodo);

// DELETE a todo
router.delete('/:id', deleteTodo);

export default router; 