'use client';

import { Button, Group, Select, TextInput, Textarea, Stack, Flex, Box } from '@mantine/core';
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
    <Stack gap="md">
      {/* Title Input */}
      <TextInput
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo title"
        label="Title"
        required
        disabled={isLoading || disabled}
        size="md"
        styles={{ input: { fontWeight: 500 } }}
      />
      
      {/* Description Textarea */}
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        label="Description"
        minRows={2}
        disabled={isLoading || disabled}
        size="sm"
      />
      
      {/* Priority Select */}
      <Select
        value={priority}
        onChange={(value) => value && setPriority(value as Priority)}
        data={priorityOptions}
        label="Priority"
        placeholder="Select priority"
        disabled={isLoading || disabled}
      />
      
      {/* Tags Input */}
      <Box>
        <Flex align="center" mb={5}>
          <Box component="label" fw={500} fz="sm">Tags</Box>
        </Flex>
        <TodoTags 
          tags={tags} 
          onTagsChange={setTags} 
          disabled={isLoading || disabled} 
        />
      </Box>
      
      {/* Files Upload */}
      <Box>
        <Flex align="center" mb={5}>
          <Box component="label" fw={500} fz="sm">Attachments</Box>
        </Flex>
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
      </Box>
      
      {/* AI Recommendation */}
      {todo.recommendation && (
        <TodoRecommendation 
          recommendation={todo.recommendation} 
          isEditMode={true} 
        />
      )}
      
      {/* Action Buttons */}
      <Flex justify="flex-end" gap="sm" mt="sm">
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
      </Flex>
    </Stack>
  );
} 