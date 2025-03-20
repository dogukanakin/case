import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { Todo, Priority, UseTodosReturn } from '@/types/todo';
import { getTodos } from '@/lib/todo';
import { isAuthenticated } from '@/lib/auth';

export function useTodos(): UseTodosReturn {
  // States
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  
  // Fetch todos when filters change
  useEffect(() => {
    if (isAuthenticated()) {
      fetchTodos();
    }
  }, [activeTab, selectedPriority, currentPage, debouncedSearchQuery]);
  
  // Fetch todos
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
  
  // Event handlers
  const handleAddTodo = async (newTodo: Todo) => {
    setCurrentPage(1);
    await fetchTodos();
  };
  
  const handleUpdateTodo = async (updatedTodo: Todo) => {
    await fetchTodos();
  };
  
  const handleDeleteTodo = async (id: string) => {
    await fetchTodos();
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
  
  const clearPriority = () => {
    setSelectedPriority(null);
  };
  
  return {
    // States
    todos,
    loading,
    error,
    activeTab,
    selectedPriority,
    currentPage,
    totalPages,
    totalTodos,
    totalAll,
    totalActive,
    totalCompleted,
    searchQuery,
    
    // Actions
    fetchTodos,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    handleTabChange,
    handlePageChange,
    handlePriorityChange,
    handleSearchChange,
    handleClearSearch,
    clearPriority
  };
} 