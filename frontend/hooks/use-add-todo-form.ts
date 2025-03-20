import { useState } from 'react';
import { Priority, Todo } from '@/types/todo';
import { createTodo } from '@/lib/todo';

interface UseAddTodoFormReturn {
  // Form state
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  newTag: string;
  imageFile: File | null;
  pdfFile: File | null;
  imagePreview: string | null;
  isSubmitting: boolean;
  error: string | null;
  
  // Form options
  priorityOptions: { value: Priority; label: string }[];
  
  // Form handlers
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPriority: (priority: Priority) => void;
  setTags: (tags: string[]) => void;
  setNewTag: (newTag: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tagToRemove: string) => void;
  handleImageChange: (file: File | null) => void;
  setPdfFile: (file: File | null) => void;
  
  // Form submission
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useAddTodoForm(onAddTodo: (newTodo: Todo) => void): UseAddTodoFormReturn {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form options
  const priorityOptions = [
    { value: Priority.LOW, label: 'Low Priority' },
    { value: Priority.MEDIUM, label: 'Medium Priority' },
    { value: Priority.HIGH, label: 'High Priority' },
  ];
  
  // Form handlers
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    
    // Create image preview if a file is selected
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Reset form function
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setTags([]);
    setNewTag('');
    setImageFile(null);
    setPdfFile(null);
    setImagePreview(null);
    setError(null);
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const newTodo = await createTodo(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          tags: tags.length > 0 ? tags : undefined
        },
        imageFile,
        pdfFile
      );
      
      // Reset form
      resetForm();
      
      // Add the new todo to the list
      onAddTodo(newTodo);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    // Form state
    title,
    description,
    priority,
    tags,
    newTag,
    imageFile,
    pdfFile,
    imagePreview,
    isSubmitting,
    error,
    
    // Form options
    priorityOptions,
    
    // Form handlers
    setTitle,
    setDescription,
    setPriority,
    setTags,
    setNewTag,
    handleAddTag,
    handleRemoveTag,
    handleImageChange,
    setPdfFile,
    
    // Form submission
    handleSubmit,
    resetForm
  };
} 