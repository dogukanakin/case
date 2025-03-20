'use client'

import React from 'react'
import { Alert, Container, Loader, Paper, Box, Transition, Space, Title, Text, Stack, Group } from '@mantine/core'
import { IconAlertCircle, IconList, IconNotes } from '@tabler/icons-react'
import AddTodoForm from '@/components/add-todo-form'

// Import our components
import TodoSearch from '@/components/todos/todo-search'
import TodoFilters from '@/components/todos/todo-filters'
import TodoList from '@/components/todos/todo-list'
import TodoPagination from '@/components/todos/todo-pagination'
import TodoEmptyState from '@/components/todos/todo-empty-state'

// Import our custom hooks
import { useAuth } from '@/hooks/use-auth'
import { useTodos } from '@/hooks/use-todos'

export default function TodosPage() {
  // Use our auth hook
  const { 
    loading: authLoading, 
    error: authError,
  } = useAuth();
  
  // Use our todos hook
  const {
    todos,
    loading: todosLoading,
    error: todosError,
    activeTab,
    selectedPriority,
    currentPage,
    totalPages,
    totalTodos,
    totalAll,
    totalActive,
    totalCompleted,
    searchQuery,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleTabChange,
    handlePageChange,
    handlePriorityChange,
    handleSearchChange,
    handleClearSearch,
    clearPriority
  } = useTodos();
  
  // Combine loading and error states
  const loading = authLoading || todosLoading;
  const error = authError || todosError;
  
  // Initial loading state
  if (loading && todos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="xl" color="blue" />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen py-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <Container size="md">
        <Stack gap="lg">
          {/* Add Todo Form */}
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <AddTodoForm onAddTodo={handleAddTodo} />
          </Paper>
          
          {/* Search Component */}
          <TodoSearch 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
          
          {/* Error Alert */}
          {error && (
            <Alert 
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}
          
          <Transition mounted={true} transition="fade" duration={400}>
            {(styles) => (
              <Box style={styles}>
                <Paper shadow="sm" withBorder p="md" radius="md">
                  {/* Filters Component */}
                  <TodoFilters
                    activeTab={activeTab}
                    selectedPriority={selectedPriority}
                    totalAll={totalAll}
                    totalActive={totalActive}
                    totalCompleted={totalCompleted}
                    onTabChange={handleTabChange}
                    onPriorityChange={handlePriorityChange}
                  />
                  
                  <Stack gap="md" mt="md">
                    {/* Todo List Component */}
                    <TodoList
                      todos={todos}
                      loading={todosLoading}
                      activeTab={activeTab}
                      selectedPriority={selectedPriority}
                      totalTodos={totalTodos}
                      searchQuery={searchQuery}
                      onUpdateTodo={handleUpdateTodo}
                      onDeleteTodo={handleDeleteTodo}
                      onClearPriority={clearPriority}
                    />
                    
                    {/* Pagination Component */}
                    <TodoPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </Stack>
                </Paper>
              </Box>
            )}
          </Transition>
          
          {/* Empty State Component */}
          {todos.length === 0 && !loading && !searchQuery && (
            <TodoEmptyState />
          )}
        </Stack>
      </Container>
    </main>
  )
} 