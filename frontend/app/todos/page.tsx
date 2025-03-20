'use client'

import React from 'react'
import { Alert, Container, Loader, Paper, Box, Transition, Space } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import AddTodoForm from '@/components/add-todo-form'

// Import our components
import TodoHeader from '@/components/todos/todo-header'
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
    username, 
    loading: authLoading, 
    error: authError,
    logout 
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader size="xl" color="blue" />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Component */}
      <TodoHeader username={username} onLogout={logout} />
      
      <Container size="md" className="pb-12">
        {/* Add Todo Form */}
        <AddTodoForm onAddTodo={handleAddTodo} />
        
        {/* Search Component */}
        <TodoSearch 
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
        
        <Space h="md" />
        
        {/* Error Alert */}
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            className="mb-4"
          >
            {error}
          </Alert>
        )}
        
        <Transition mounted={true} transition="fade" duration={400}>
          {(styles) => (
            <Box style={styles}>
              <Paper withBorder p="md" mb="md" radius="md">
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
                
                <div className="mt-2">
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
                </div>
              </Paper>
            </Box>
          )}
        </Transition>
        
        {/* Empty State Component */}
        {todos.length === 0 && !loading && !searchQuery && (
          <TodoEmptyState />
        )}
      </Container>
    </main>
  )
} 