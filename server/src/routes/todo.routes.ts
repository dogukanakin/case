import express from 'express';
import { 
  getTodos, 
  getTodoById,  
  createTodo,
  updateTodo,
  deleteTodo 
} from '../controllers/todo.controller';
import { protect } from '../middleware/auth.middleware';


const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(protect);

// GET all todos for the logged-in user
router.get('/', getTodos);

// GET a single todo by ID
router.get('/:id', getTodoById);

// CREATE a new todo
router.post('/', createTodo);

// UPDATE a todo
router.put('/:id', updateTodo);

// DELETE a todo
router.delete('/:id', deleteTodo);

export default router; 