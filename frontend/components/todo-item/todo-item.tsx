'use client';

import { useState } from 'react';
import { Todo, UpdateTodoInput } from '@/types/todo';
import { updateTodo, deleteTodo } from '@/lib/todo';
import { ActionIcon, Badge, Button, Checkbox, Group, Paper, Text } from '@mantine/core';
import { IconAlarm, IconPencil, IconTag, IconTrash } from '@tabler/icons-react';
import TodoEditForm from './todo-edit-form';
import TodoFiles from './todo-files';
import TodoRecommendation from './todo-recommendation';
import TodoTags from './todo-tags';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isLoading, setIsLoading] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'teal';
      case 'medium': return 'blue';
      case 'high': return 'red';
      default: return 'gray';
    }
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
        <TodoEditForm 
          todo={todo}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
          disabled={isLoading}
        />
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

                {/* Display image and file attachment */}
                <TodoFiles 
                  imageUrl={todo.imageUrl}
                  fileUrl={todo.fileUrl}
                  fileName={todo.fileName}
                  readOnly={true}
                />
                
                {/* Display AI recommendation */}
                {todo.recommendation && (
                  <TodoRecommendation 
                    recommendation={todo.recommendation} 
                  />
                )}
                
                {/* Display tags */}
                {todo.tags.length > 0 && (
                  <Group className="mt-3 gap-1">
                    <IconTag size={14} className="text-blue-500" />
                    <TodoTags 
                      tags={todo.tags} 
                      readOnly={true} 
                    />
                  </Group>
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