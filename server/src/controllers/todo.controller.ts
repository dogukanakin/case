import { Request, Response } from 'express';
import Todo from '../models/todo.model';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { generateTodoRecommendation } from '../services/openai.service';
import { 
  ITodo, 
  Priority, 
  IAuthenticatedRequest, 
  ITodoFilterParams,
  ITodoPaginationResponse,
} from '../interfaces/todo.interfaces';
import { IErrorResponse } from '../interfaces/response.interfaces';

// Get all todos for the logged-in user
export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' } as IErrorResponse);
      return;
    }

    // Query parametrelerini al
    const filterParams: ITodoFilterParams = {
      status: req.query.status as 'active' | 'completed' | undefined,
      priority: req.query.priority as Priority | undefined,
      search: req.query.search as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 3
    };
    
    const page = filterParams.page || 1;
    const limit = filterParams.limit || 3;
    const skip = (page - 1) * limit;
    
    // Temel sorgu - kullanıcıya ait todo'lar
    let query: any = { user: userId };
    
    // Status filtresi ekle
    if (filterParams.status === 'active') {
      query.completed = false;
    } else if (filterParams.status === 'completed') {
      query.completed = true;
    }
    
    // Priority filtresi ekle
    if (filterParams.priority) {
      query.priority = filterParams.priority;
    }
    
    // Arama sorgusu ekle - başlık veya açıklamada metin araması
    if (filterParams.search && filterParams.search.trim()) {
      const searchRegex = new RegExp(filterParams.search.trim(), 'i'); // case-insensitive regex
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
    const response: ITodoPaginationResponse = {
      todos: todos as unknown as ITodo[],
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
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: (error as Error).message 
    } as IErrorResponse);
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

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Handle uploaded files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    let imageUrl: string | undefined = undefined;
    let fileUrl: string | undefined = undefined;
    let fileName: string | undefined = undefined;

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

    // ChatGPT'den öneriler al
    let recommendation = '';
    try {
      recommendation = await generateTodoRecommendation(
        title, 
        description || '',
        priority || Priority.MEDIUM,
        Array.isArray(tags) ? tags : []
      );
    } catch (recError) {
      console.error('Failed to generate recommendation:', recError);
      recommendation = 'AI recommendations temporarily unavailable. We\'ll try again later.';
    }

    // Create the todo with safe defaults
    const todoData = {
      title,
      description: description || '',
      completed: false,
      priority: priority || Priority.MEDIUM,
      tags: Array.isArray(tags) ? tags : [],
      recommendation, // ChatGPT'den gelen öneri
      imageUrl,
      fileUrl,
      fileName,
      user: userId,
    };
    
    
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


    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists and belongs to user
    const existingTodo = await Todo.findOne({ _id: todoId, user: userId });
    
    if (!existingTodo) {
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
      imageUrl = undefined;
    }

    // Remove file if requested
    if (removeFile && existingTodo.fileUrl) {
      const filePath = path.join(process.cwd(), 'uploads', existingTodo.fileUrl.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      fileUrl = undefined;
      fileName = undefined;
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
    
    // İçerik değiştiğinde ChatGPT'den yeni öneriler al
    let recommendation = existingTodo.recommendation || '';
    
    // Sadece içerik (title, description, priority, tags) değişikliklerinde öneri güncelle, 
    // completed değişiminde öneri güncelleme!
    const contentChanged = 
      (title !== undefined && title !== existingTodo.title) || 
      (description !== undefined && description !== existingTodo.description) || 
      (priority !== undefined && priority !== existingTodo.priority) ||
      (tags !== undefined && JSON.stringify(tags) !== JSON.stringify(existingTodo.tags));
    
    // Eğer sadece completed durumu değişiyorsa, log ekle
    if (completed !== undefined && completed !== existingTodo.completed && 
        !contentChanged) {
    }
      
    if (contentChanged) {
      try {
        const newTitle = title !== undefined ? title : existingTodo.title;
        const newDescription = description !== undefined ? description : existingTodo.description;
        const newPriority = priority !== undefined ? priority : existingTodo.priority;
        const newTags = tags !== undefined ? (Array.isArray(tags) ? tags : []) : existingTodo.tags;
        
        recommendation = await generateTodoRecommendation(
          newTitle,
          newDescription,
          newPriority,
          newTags
        );
      } catch (recError) {
        console.error('Failed to update recommendation:', recError);
        // Keep existing recommendation but add note about error
        recommendation = existingTodo.recommendation || 'AI recommendations temporarily unavailable. We\'ll try again later.';
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
      recommendation, // Update recommendation when content changes
    };


    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      updateData,
      { new: true }
    );

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