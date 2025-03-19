import { Request, Response } from 'express';
import Todo, { Priority } from '../models/todo.model';
import mongoose from 'mongoose';

// Get all todos for the logged-in user
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Query parametrelerini al
    const status = req.query.status as string; // 'active', 'completed', veya undefined
    const priority = req.query.priority as Priority | undefined;
    const searchQuery = req.query.search as string | undefined;
    
    // Sayfalama parametrelerini al
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 3;
    const skip = (page - 1) * limit;
    
    // Temel sorgu - kullanıcıya ait todo'lar
    let query: any = { user: userId };
    
    // Status filtresi ekle
    if (status === 'active') {
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    }
    
    // Priority filtresi ekle
    if (priority) {
      query.priority = priority;
    }
    
    // Arama sorgusu ekle - başlık veya açıklamada metin araması
    if (searchQuery && searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), 'i'); // case-insensitive regex
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex } // Opsiyonel: etiketlerde de arama yap
      ];
    }

    // Filtrelenmiş todo'ların toplam sayısını bul
    const totalTodos = await Todo.countDocuments(query);
    
    // Tüm sekmelerin sayılarını hesapla
    const totalAll = await Todo.countDocuments({ user: userId });
    const totalActive = await Todo.countDocuments({ user: userId, completed: false });
    const totalCompleted = await Todo.countDocuments({ user: userId, completed: true });
    
    // Sayfaya göre todo'ları getir
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 }) // Tarihe göre sırala - en yeni en üstte
      .skip(skip)
      .limit(limit);
    
    // Meta verilerle birlikte sonuçları döndür
    res.status(200).json({
      todos,
      pagination: {
        total: totalTodos,
        page,
        limit,
        pages: Math.ceil(totalTodos / limit)
      },
      counts: {
        all: totalAll,
        active: totalActive,
        completed: totalCompleted
      }
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get a single todo by ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const todoId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }

    const todo = await Todo.findOne({ _id: todoId, user: userId });
    
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    
    res.status(200).json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Create a new todo
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { title, description, priority, tags } = req.body;

    // Log the incoming request for debugging
    console.log('Create Todo Request Body:', req.body);

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Create the todo with safe defaults
    const todoData = {
      title,
      description: description || '',
      completed: false,
      priority: priority || Priority.MEDIUM,
      tags: Array.isArray(tags) ? tags : [],
      recommendation: '', // Empty for now, will be filled by ChatGPT later
      user: userId,
    };
    
    console.log('Creating todo with data:', todoData);
    
    const newTodo = await Todo.create(todoData);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    
    // Send more detailed error information
    if (error instanceof Error) {
      res.status(500).json({ 
        message: 'Failed to create todo',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.status(500).json({ message: 'Unknown error occurred' });
    }
  }
};

// Update a todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const todoId = req.params.id;
    const { title, description, completed, priority, tags } = req.body;

    console.log('Update request received:', {
      userId,
      todoId,
      body: req.body,
      headers: req.headers
    });

    if (!userId) {
      console.log('Authentication failed: userId is missing');
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      console.log('Invalid todoId format:', todoId);
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to user
    const existingTodo = await Todo.findOne({ _id: todoId, user: userId });
    
    if (!existingTodo) {
      console.log('Todo not found or does not belong to user:', {
        todoId,
        userId,
        exists: existingTodo !== null
      });
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    // Prepare update data with safe handling of arrays
    const updateData = {
      title: title !== undefined ? title : existingTodo.title,
      description: description !== undefined ? description : existingTodo.description,
      completed: completed !== undefined ? completed : existingTodo.completed,
      priority: priority !== undefined ? priority : existingTodo.priority,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : existingTodo.tags,
      // We're not updating recommendation here as it should be handled by the ChatGPT integration
    };

    console.log('Updating todo with data:', updateData);

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      updateData,
      { new: true }
    );

    console.log('Todo updated successfully:', updatedTodo);
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: (error as Error).message,
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined 
    });
  }
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const todoId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to user
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    await Todo.findByIdAndDelete(todoId);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}; 