import express from 'express';
import { 
  getTodos, 
  getTodoById,  
  createTodo,
  updateTodo,
  deleteTodo 
} from '../controllers/todo.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(protect);

// GET all todos for the logged-in user
router.get('/', getTodos);

// GET a single todo by ID
router.get('/:id', getTodoById);

// CREATE a new todo with file uploads
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), createTodo);

// UPDATE a todo with file uploads
router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), updateTodo);

// DELETE a todo
router.delete('/:id', deleteTodo);

export default router; 