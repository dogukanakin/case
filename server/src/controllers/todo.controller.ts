import { Request, Response } from 'express';
import Todo, { Priority } from '../models/todo.model';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

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
    console.log('Create Todo Request Files:', req.files);

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Handle uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let imageUrl = null;
    let fileUrl = null;
    let fileName = null;

    if (files) {
      // Handle image upload
      if (files.image && files.image[0]) {
        imageUrl = `/uploads/images/${files.image[0].filename}`;
      }

      // Handle file upload
      if (files.file && files.file[0]) {
        fileUrl = `/uploads/files/${files.file[0].filename}`;
        fileName = files.file[0].originalname;
      }
    }

    // Create the todo with safe defaults
    const todoData = {
      title,
      description: description || '',
      completed: false,
      priority: priority || Priority.MEDIUM,
      tags: Array.isArray(tags) ? tags : [],
      recommendation: '', // Empty for now, will be filled by ChatGPT later
      imageUrl,
      fileUrl,
      fileName,
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
    const { title, description, completed, priority, tags, removeImage, removeFile } = req.body;

    console.log('Update request received:', {
      userId,
      todoId,
      body: req.body,
      files: req.files,
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

    // Handle file operations
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let imageUrl = existingTodo.imageUrl;
    let fileUrl = existingTodo.fileUrl;
    let fileName = existingTodo.fileName;

    // Remove image if requested
    if (removeImage && existingTodo.imageUrl) {
      const imagePath = path.join(process.cwd(), 'uploads', existingTodo.imageUrl.replace('/uploads/', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      imageUrl = null;
    }

    // Remove file if requested
    if (removeFile && existingTodo.fileUrl) {
      const filePath = path.join(process.cwd(), 'uploads', existingTodo.fileUrl.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      fileUrl = null;
      fileName = null;
    }

    // Handle new uploads
    if (files) {
      // Handle new image upload
      if (files.image && files.image[0]) {
        // Remove old image if exists
        if (existingTodo.imageUrl) {
          const oldImagePath = path.join(process.cwd(), 'uploads', existingTodo.imageUrl.replace('/uploads/', ''));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imageUrl = `/uploads/images/${files.image[0].filename}`;
      }

      // Handle new file upload
      if (files.file && files.file[0]) {
        // Remove old file if exists
        if (existingTodo.fileUrl) {
          const oldFilePath = path.join(process.cwd(), 'uploads', existingTodo.fileUrl.replace('/uploads/', ''));
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        fileUrl = `/uploads/files/${files.file[0].filename}`;
        fileName = files.file[0].originalname;
      }
    }

    // Prepare update data with safe handling of arrays
    const updateData = {
      title: title !== undefined ? title : existingTodo.title,
      description: description !== undefined ? description : existingTodo.description,
      completed: completed !== undefined ? completed : existingTodo.completed,
      priority: priority !== undefined ? priority : existingTodo.priority,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : existingTodo.tags,
      imageUrl,
      fileUrl,
      fileName,
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

    // Delete associated files if they exist
    if (todo.imageUrl) {
      const imagePath = path.join(process.cwd(), 'uploads', todo.imageUrl.replace('/uploads/', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (todo.fileUrl) {
      const filePath = path.join(process.cwd(), 'uploads', todo.fileUrl.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Todo.findByIdAndDelete(todoId);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}; 