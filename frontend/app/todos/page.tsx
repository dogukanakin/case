'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, Container, Loader, Paper, Box, Transition } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'
import { getTodos } from '@/lib/todo'
import { Todo, Priority } from '@/types/todo'
import AddTodoForm from '@/components/add-todo-form'
import { useDebouncedValue } from '@mantine/hooks'

// Import our new components
import TodoHeader from '@/components/todos/todo-header'
import TodoSearch from '@/components/todos/todo-search'
import TodoFilters from '@/components/todos/todo-filters'
import TodoList from '@/components/todos/todo-list'
import TodoPagination from '@/components/todos/todo-pagination'
import TodoEmptyState from '@/components/todos/todo-empty-state'

export default function TodosPage() {
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState<Todo[]>([])
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTodos, setTotalTodos] = useState(0)
  const [totalAll, setTotalAll] = useState(0)
  const [totalActive, setTotalActive] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)
  const router = useRouter()
  
  // Fetch todos when filters change
  useEffect(() => {
    if (isAuthenticated()) {
      fetchTodos();
    }
  }, [activeTab, selectedPriority, currentPage, debouncedSearchQuery]);
  
  // Check authentication and get user data
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = isAuthenticated()
      
      if (!isAuth) {
        console.log('Not authenticated, redirecting to login...')
        router.push('/login')
        return
      }
      
      try {
        // Try to get user data from localStorage first (faster)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUsername(parsedUser.username || 'User')
        } else {
          // As a fallback, get the current user from the API
          const userData = await getCurrentUser()
          setUsername(userData.username || 'User')
        }
      } catch (e) {
        console.error('Error getting user data:', e)
        setUsername('User')
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])
  
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare filter parameters
      const status = activeTab !== 'all' ? activeTab as 'active' | 'completed' : undefined;
      
      // Fetch filtered todos from server
      const response = await getTodos({ 
        status, 
        priority: selectedPriority, 
        page: currentPage, 
        limit: 3,
        search: searchQuery
      });
      
      setTodos(response.todos);
      setTotalPages(response.pagination.pages);
      setTotalTodos(response.pagination.total);
      
      // Update tab counts
      setTotalAll(response.counts.all);
      setTotalActive(response.counts.active);
      setTotalCompleted(response.counts.completed);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Event handlers
  const handleAddTodo = async (newTodo: Todo) => {
    setCurrentPage(1);
    await fetchTodos();
  }
  
  const handleUpdateTodo = async (updatedTodo: Todo) => {
    await fetchTodos();
  }
  
  const handleDeleteTodo = async (id: string) => {
    await fetchTodos();
  }
  
  // Apply filters function to handle all filter changes
  const applyFilters = (tabValue?: string, priorityValue?: Priority | null, pageValue?: number, searchValue?: string) => {
    // Use provided values or current state values
    const newTab = tabValue !== undefined ? tabValue : activeTab;
    const newPriority = priorityValue !== undefined ? priorityValue : selectedPriority;
    const newPage = pageValue !== undefined ? pageValue : currentPage;
    const newSearch = searchValue !== undefined ? searchValue : searchQuery;
    
    // Update state
    setActiveTab(newTab);
    setSelectedPriority(newPriority);
    setCurrentPage(newPage);
    if (searchValue !== undefined) setSearchQuery(searchValue);
    
    // Manually fetch data
    const status = newTab !== 'all' ? newTab as 'active' | 'completed' : undefined;
    
    setLoading(true);
    getTodos({ 
      status, 
      priority: newPriority, 
      page: newPage, 
      limit: 3,
      search: newSearch 
    }).then(response => {
      setTodos(response.todos);
      setTotalPages(response.pagination.pages);
      setTotalTodos(response.pagination.total);
      setTotalAll(response.counts.all);
      setTotalActive(response.counts.active);
      setTotalCompleted(response.counts.completed);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again.');
      setLoading(false);
    });
  };
  
  // Filter change handlers
  const handleTabChange = (value: string | null) => {
    if (value) {
      applyFilters(value, null, 1, ''); // Reset priority and search when changing tabs
    }
  };
  
  const handlePageChange = (newPage: number) => {
    applyFilters(undefined, undefined, newPage, undefined);
  };
  
  const handlePriorityChange = (priority: Priority | null) => {
    applyFilters(undefined, priority, 1, undefined);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.currentTarget.value);
    setCurrentPage(1);
  };
  
  const handleClearSearch = () => {
    applyFilters(undefined, undefined, 1, '');
  };
  
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
      <TodoHeader username={username} />
      
      <Container size="md" className="pb-12">
        {/* Add Todo Form */}
        <AddTodoForm onAddTodo={handleAddTodo} />
        
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
                    loading={loading}
                    activeTab={activeTab}
                    selectedPriority={selectedPriority}
                    totalTodos={totalTodos}
                    searchQuery={searchQuery}
                    onUpdateTodo={handleUpdateTodo}
                    onDeleteTodo={handleDeleteTodo}
                    onClearPriority={() => setSelectedPriority(null)}
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