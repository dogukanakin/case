import { useState } from 'react';
import { Todo, UpdateTodoInput } from '@/types/todo';
import { updateTodo, deleteTodo } from '@/lib/todo';

interface UseTodoItemReturn {
  // States
  isEditing: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  
  // UI handlers
  setIsEditing: (value: boolean) => void;
  
  // Action handlers
  handleToggleComplete: () => Promise<void>;
  handleSaveEdit: (
    updateData: UpdateTodoInput, 
    newImageFile?: File | null, 
    newAttachmentFile?: File | null
  ) => Promise<void>;
  handleDelete: () => Promise<void>;
  
  // Utilities
  getPriorityColor: (priority: string) => string;
}

export function useTodoItem(
  todo: Todo,
  onUpdate: (updatedTodo: Todo) => void,
  onDelete: (id: string) => void
): UseTodoItemReturn {
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isLoading, setIsLoading] = useState(false);
  
  // Utility functions
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'teal';
      case 'medium': return 'blue';
      case 'high': return 'red';
      default: return 'gray';
    }
  };
  
  // Toggle todo completion status
  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      const newCompletedState = !isCompleted;
      setIsCompleted(newCompletedState);
      
      const updatedTodo = await updateTodo(todo._id, { 
        completed: newCompletedState 
      });
      
      onUpdate(updatedTodo);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      // Revert state on error
      setIsCompleted(isCompleted);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save edited todo
  const handleSaveEdit = async (
    updateData: UpdateTodoInput, 
    newImageFile?: File | null, 
    newAttachmentFile?: File | null
  ) => {
    try {
      const updatedTodo = await updateTodo(
        todo._id, 
        updateData, 
        newImageFile, 
        newAttachmentFile
      );
      
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };
  
  // Delete todo
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteTodo(todo._id);
      onDelete(todo._id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // States
    isEditing,
    isCompleted,
    isLoading,
    
    // UI handlers
    setIsEditing,
    
    // Action handlers
    handleToggleComplete,
    handleSaveEdit,
    handleDelete,
    
    // Utilities
    getPriorityColor
  };
} 