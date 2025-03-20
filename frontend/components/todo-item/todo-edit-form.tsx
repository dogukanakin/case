'use client';

import { Button, Group, Select, TextInput, Textarea } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Todo, UpdateTodoInput, Priority } from '@/types/todo';
import TodoTags from './todo-tags';
import TodoFiles from './todo-files';
import TodoRecommendation from './todo-recommendation';
import { useTodoEditForm } from '@/hooks/use-todo-edit-form';

interface TodoEditFormProps {
  todo: Todo;
  onSave: (updatedData: UpdateTodoInput, imageFile?: File | null, attachmentFile?: File | null) => Promise<void>;
  onCancel: () => void;
  disabled?: boolean;
}

export default function TodoEditForm({ todo, onSave, onCancel, disabled = false }: TodoEditFormProps) {
  // Use our custom hook
  const {
    title,
    description,
    priority,
    tags,
    removeImage,
    removeFile,
    newImageFile,
    newAttachmentFile,
    isLoading,
    priorityOptions,
    setTitle,
    setDescription,
    setPriority,
    setTags,
    setRemoveImage,
    setRemoveFile,
    setNewImageFile,
    setNewAttachmentFile,
    handleSubmit
  } = useTodoEditForm(todo, onSave);

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
        onChange={(value) => value && setPriority(value as Priority)}
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