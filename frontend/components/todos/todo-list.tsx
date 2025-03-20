'use client';

import { Alert, Badge, Card, Group, Loader, Paper, Text, Title, ActionIcon } from '@mantine/core';
import { IconList, IconX } from '@tabler/icons-react';
import { Todo, Priority, TodoListProps } from '@/types/todo';
import TodoItem from '@/components/todo-item/todo-item';

export default function TodoList({ 
  todos, 
  loading, 
  activeTab, 
  selectedPriority, 
  totalTodos, 
  searchQuery,
  onUpdateTodo, 
  onDeleteTodo,
  onClearPriority
}: TodoListProps) {
  // Display loading state
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader size="md" />
      </div>
    );
  }
  
  // Display empty state if no todos
  if (todos.length === 0) {
    // No todos due to search
    if (searchQuery) {
      return (
        <Alert
          color="yellow"
          variant="light"
          className="mb-4"
          withCloseButton={false}
        >
          No results found for "{searchQuery}". Try different keywords.
        </Alert>
      );
    }
    
    // No todos in general
    return (
      <Card className="border border-dashed bg-transparent">
        <Text ta="center" color="dimmed" py={4}>
          No {activeTab !== "all" ? activeTab : ""} tasks {selectedPriority ? `with ${selectedPriority} priority` : ""} found.
        </Text>
      </Card>
    );
  }
  
  // Show todos
  return (
    <div>
      <Group justify="space-between" align="center" className="mb-4 text-xs text-gray-500">
        <Group gap={8}>
          <span>
            Showing {todos.length} of {totalTodos} tasks 
            ({activeTab !== "all" ? activeTab : "all"} {selectedPriority ? `/ ${selectedPriority} priority` : ""})
          </span>
        </Group>
        
        {selectedPriority && (
          <Badge 
            color={selectedPriority === Priority.LOW ? "teal" : selectedPriority === Priority.MEDIUM ? "blue" : "red"} 
            size="sm" 
            rightSection={
              <ActionIcon 
                size="xs" 
                color="red" 
                variant="transparent"
                onClick={onClearPriority}
              >
                <IconX size={10} />
              </ActionIcon>
            }
          >
            {selectedPriority} priority
          </Badge>
        )}
      </Group>
      
      {todos.map(todo => (
        <TodoItem 
          key={todo._id}
          todo={todo}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
        />
      ))}
      
      {/* Search results notification */}
      {searchQuery && todos.length > 0 && (
        <Alert
          color="blue"
          variant="light"
          className="mt-4"
          withCloseButton={false}
        >
          Found {totalTodos} result{totalTodos !== 1 ? "s" : ""} for "{searchQuery}"
        </Alert>
      )}
    </div>
  );
} 