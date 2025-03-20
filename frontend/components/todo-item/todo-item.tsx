'use client';

import { Todo, UpdateTodoInput } from '@/types/todo';
import { ActionIcon, Badge, Checkbox, Group, Paper, Stack, Flex, Text } from '@mantine/core';
import { IconAlarm, IconPencil, IconTag, IconTrash } from '@tabler/icons-react';
import TodoEditForm from './todo-edit-form';
import TodoFiles from './todo-files';
import TodoRecommendation from './todo-recommendation';
import TodoTags from './todo-tags';
import { useTodoItem } from '@/hooks/use-todo-item';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  // Use our custom hook
  const {
    isEditing,
    isCompleted,
    isLoading,
    setIsEditing,
    handleToggleComplete,
    handleSaveEdit,
    handleDelete,
    getPriorityColor
  } = useTodoItem(todo, onUpdate, onDelete);

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
          <Flex align="flex-start" justify="space-between" gap="md">
            {/* Left side with checkbox */}
            <Checkbox
              checked={isCompleted}
              onChange={handleToggleComplete}
              disabled={isLoading}
              size="md"
              radius="xl"
              className="mt-1 flex-shrink-0"
            />
            
            {/* Center content */}
            <Stack gap="xs" className="flex-grow min-w-0">
              {/* Title and priority badge */}
              <Flex wrap="wrap" align="center" gap="xs">
                <Text component="h3" className={`text-lg font-medium truncate ${isCompleted ? 'line-through text-gray-500' : ''}`} style={{ flexGrow: 1, minWidth: 0 }}>
                  {todo.title}
                </Text>
                <Badge 
                  color={getPriorityColor(todo.priority)} 
                  size="sm" 
                  radius="sm"
                  variant="filled"
                  className="capitalize flex-shrink-0"
                >
                  {todo.priority}
                </Badge>
              </Flex>
              
              {/* Description */}
              {todo.description && (
                <Text className={`text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </Text>
              )}

              {/* Display image and file attachment */}
              {(todo.imageUrl || todo.fileUrl) && (
                <TodoFiles 
                  imageUrl={todo.imageUrl}
                  fileUrl={todo.fileUrl}
                  fileName={todo.fileName}
                  readOnly={true}
                />
              )}
              
              {/* Display AI recommendation */}
              {todo.recommendation && (
                <TodoRecommendation 
                  recommendation={todo.recommendation} 
                />
              )}
              
              {/* Display tags */}
              {todo.tags.length > 0 && (
                <Flex align="center" gap="xs">
                  <IconTag size={14} className="text-blue-500 flex-shrink-0" />
                  <TodoTags 
                    tags={todo.tags} 
                    readOnly={true} 
                  />
                </Flex>
              )}
              
              {/* Creation date */}
              <Flex align="center" className="text-xs text-gray-400" gap="xs">
                <IconAlarm size={14} className="flex-shrink-0" />
                <Text size="xs" color="dimmed">
                  {new Date(todo.createdAt).toLocaleString()}
                </Text>
              </Flex>
            </Stack>
            
            {/* Right side with action buttons */}
            <Flex gap="xs" className="flex-shrink-0">
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
            </Flex>
          </Flex>
        </div>
      )}
    </Paper>
  );
} 