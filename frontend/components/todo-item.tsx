'use client';

import { useState } from 'react';
import { Todo, UpdateTodoInput, Priority } from '@/types/todo';
import { updateTodo, deleteTodo } from '@/lib/todo';
import { Button, Checkbox, TextInput, Textarea, ActionIcon, Select, Badge, Group, Box, Paper } from '@mantine/core';
import { IconPencil, IconTrash, IconX, IconCheck, IconAlarm, IconTag } from '@tabler/icons-react';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [editedPriority, setEditedPriority] = useState(todo.priority);
  const [editedTags, setEditedTags] = useState<string[]>(todo.tags);
  const [newTag, setNewTag] = useState('');
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isLoading, setIsLoading] = useState(false);

  const priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
  ];

  const getPriorityColor = (priority: Priority) => {
    switch(priority) {
      case Priority.LOW: return 'teal';
      case Priority.MEDIUM: return 'blue';
      case Priority.HIGH: return 'red';
      default: return 'gray';
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim()) && editedTags.length < 5) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

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

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      
      const updateData: UpdateTodoInput = {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        tags: editedTags
      };
      
      const updatedTodo = await updateTodo(todo._id, updateData);
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    setEditedPriority(todo.priority);
    setEditedTags([...todo.tags]);
    setIsEditing(false);
  };

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

  return (
    <Paper 
      shadow="xs" 
      p="md" 
      withBorder 
      mb="md" 
      className={`transition-all duration-200 ${isCompleted ? 'bg-gray-50' : 'hover:shadow-md'}`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <TextInput
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Todo title"
            required
            disabled={isLoading}
            size="md"
            className="font-medium"
          />
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description (optional)"
            minRows={2}
            disabled={isLoading}
            size="sm"
          />
          <Select
            label="Priority"
            value={editedPriority}
            onChange={(value) => setEditedPriority(value as Priority)}
            data={priorityOptions}
            disabled={isLoading}
            size="sm"
          />
          
          <Box>
            <Group justify="space-between" mb="xs">
              <Box className="text-sm font-medium">Tags (max 5)</Box>
              <Badge size="sm" radius="sm" color="gray">
                {editedTags.length}/5
              </Badge>
            </Group>
            
            <Group mb="sm" className="flex-wrap">
              {editedTags.map((tag) => (
                <Badge 
                  key={tag} 
                  color="blue" 
                  variant="outline"
                  className="py-1"
                  rightSection={
                    <ActionIcon 
                      size="xs" 
                      color="blue" 
                      variant="transparent"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1"
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  }
                >
                  {tag}
                </Badge>
              ))}
            </Group>
            
            <Group className="mb-2">
              <TextInput
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                disabled={isLoading || editedTags.length >= 5}
                className="flex-1"
                size="xs"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim() || editedTags.length >= 5 || isLoading}
                variant="outline"
                size="xs"
              >
                Add
              </Button>
            </Group>
          </Box>
          
          <Group justify="flex-end" className="mt-4 gap-2">
            <Button
              onClick={handleCancelEdit}
              variant="subtle"
              color="gray"
              disabled={isLoading}
              leftSection={<IconX size={16} />}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editedTitle.trim() || isLoading}
              leftSection={<IconCheck size={16} />}
              size="sm"
            >
              Save
            </Button>
          </Group>
        </div>
      ) : (
        <div>
          <Group align="flex-start" justify="space-between" className="flex-nowrap">
            <Group align="flex-start" className="flex-nowrap gap-2 flex-1 min-w-0">
              <Checkbox
                checked={isCompleted}
                onChange={handleToggleComplete}
                disabled={isLoading}
                size="md"
                radius="xl"
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className={`text-lg font-medium truncate ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {todo.title}
                  </h3>
                  <Badge 
                    color={getPriorityColor(todo.priority)} 
                    size="sm" 
                    radius="sm"
                    variant="filled"
                    className="capitalize"
                  >
                    {todo.priority}
                  </Badge>
                </div>
                
                {todo.description && (
                  <p className={`mt-1 text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                    {todo.description}
                  </p>
                )}
                
                {todo.tags.length > 0 && (
                  <Group className="mt-3 gap-1">
                    <IconTag size={14} className="text-blue-500" />
                    <Group className="flex-wrap gap-1">
                      {todo.tags.map(tag => (
                        <Badge key={tag} color="blue" size="xs" variant="light" radius="sm">{tag}</Badge>
                      ))}
                    </Group>
                  </Group>
                )}
                
                {todo.recommendation && (
                  <Paper className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <p className="text-xs font-medium text-blue-800 mb-1">AI Recommendation:</p>
                    <p className="text-sm text-blue-700">{todo.recommendation}</p>
                  </Paper>
                )}
                
                <Group className="mt-3 text-xs text-gray-400 items-center gap-1">
                  <IconAlarm size={14} />
                  <span>{new Date(todo.createdAt).toLocaleString()}</span>
                </Group>
              </div>
            </Group>
            
            <Group className="gap-1">
              <ActionIcon 
                onClick={() => setIsEditing(true)} 
                size="md" 
                color="blue" 
                variant="light"
                disabled={isLoading}
                radius="xl"
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon 
                onClick={handleDelete} 
                size="md" 
                color="red" 
                variant="light"
                disabled={isLoading}
                radius="xl"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Group>
        </div>
      )}
    </Paper>
  );
} 