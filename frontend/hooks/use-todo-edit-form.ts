import { useState } from 'react';
import { Priority, Todo, UpdateTodoInput } from '@/types/todo';

interface UseTodoEditFormReturn {
  // Form state
  title: string;
  description: string;
  priority: string;
  tags: string[];
  removeImage: boolean;
  removeFile: boolean;
  newImageFile: File | null;
  newAttachmentFile: File | null;
  isLoading: boolean;
  
  // Form options
  priorityOptions: { value: string; label: string }[];
  
  // Form handlers
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setPriority: (value: string) => void;
  setTags: (value: string[]) => void;
  setRemoveImage: (value: boolean) => void;
  setRemoveFile: (value: boolean) => void;
  setNewImageFile: (file: File | null) => void;
  setNewAttachmentFile: (file: File | null) => void;
  
  // Form submission
  handleSubmit: () => Promise<void>;
}

export function useTodoEditForm(
  todo: Todo,
  onSave: (updatedData: UpdateTodoInput, imageFile?: File | null, attachmentFile?: File | null) => Promise<void>
): UseTodoEditFormReturn {
  // Form state
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [priority, setPriority] = useState(todo.priority);
  const [tags, setTags] = useState<string[]>(todo.tags);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeFile, setRemoveFile] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form options
  const priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
  ];
  
  // Form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      const updateData: UpdateTodoInput = {
        title,
        description,
        priority,
        tags,
        removeImage,
        removeFile
      };
      
      await onSave(updateData, newImageFile, newAttachmentFile);
    } catch (error) {
      console.error('Error saving todo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    // Form state
    title,
    description,
    priority,
    tags,
    removeImage,
    removeFile,
    newImageFile,
    newAttachmentFile,
    isLoading,
    
    // Form options
    priorityOptions,
    
    // Form handlers
    setTitle,
    setDescription,
    setPriority,
    setTags,
    setRemoveImage,
    setRemoveFile,
    setNewImageFile,
    setNewAttachmentFile,
    
    // Form submission
    handleSubmit
  };
} 