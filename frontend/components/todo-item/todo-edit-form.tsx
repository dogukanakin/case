'use client';

import { useState } from 'react';
import { Button, Group, Select, TextInput, Textarea } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Priority, Todo, UpdateTodoInput } from '@/types/todo';
import TodoTags from './todo-tags';
import TodoFiles from './todo-files';
import TodoRecommendation from './todo-recommendation';

interface TodoEditFormProps {
  todo: Todo;
  onSave: (updatedData: UpdateTodoInput, imageFile?: File | null, attachmentFile?: File | null) => Promise<void>;
  onCancel: () => void;
  disabled?: boolean;
}

export default function TodoEditForm({ todo, onSave, onCancel, disabled = false }: TodoEditFormProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [priority, setPriority] = useState(todo.priority);
  const [tags, setTags] = useState<string[]>(todo.tags);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeFile, setRemoveFile] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newAttachmentFile, setNewAttachmentFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
  ];

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

  return (
    <div className="space-y-4">
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title"
        required
        disabled={isLoading || disabled}
        size="md"
        className="font-medium"
      />
      
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        minRows={2}
        disabled={isLoading || disabled}
        size="sm"
      />
      
      <Select
        value={priority}
        onChange={(value) => setPriority(value as Priority)}
        data={priorityOptions}
        label="Priority"
        placeholder="Select priority"
        disabled={isLoading || disabled}
      />
      
      <TodoTags 
        tags={tags} 
        onTagsChange={setTags} 
        disabled={isLoading || disabled} 
      />
      
      <TodoFiles 
        imageUrl={todo.imageUrl}
        fileUrl={todo.fileUrl}
        fileName={todo.fileName}
        onImageChange={setNewImageFile}
        onFileChange={setNewAttachmentFile}
        onRemoveImage={() => setRemoveImage(true)}
        onRemoveFile={() => setRemoveFile(true)}
        removeImage={removeImage}
        removeFile={removeFile}
        disabled={isLoading || disabled}
      />
      
      {todo.recommendation && (
        <TodoRecommendation 
          recommendation={todo.recommendation} 
          isEditMode={true} 
        />
      )}
      
      <Group justify="flex-end" className="mt-4 gap-2">
        <Button
          onClick={onCancel}
          variant="subtle"
          color="gray"
          disabled={isLoading || disabled}
          leftSection={<IconX size={16} />}
          size="sm"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || isLoading || disabled}
          leftSection={<IconCheck size={16} />}
          loading={isLoading}
          size="sm"
        >
          Save
        </Button>
      </Group>
    </div>
  );
} 