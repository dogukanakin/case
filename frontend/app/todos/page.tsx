'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Title, Text, Container, Card, Loader, Alert, Paper, Group, Tabs, Badge, ActionIcon, Transition, Box, Pagination } from '@mantine/core'
import { IconAlertCircle, IconUser, IconLogout, IconFilter, IconCheck, IconClock, IconList, IconX, IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import { isAuthenticated, logoutUser, getCurrentUser } from '@/lib/auth'
import { getTodos } from '@/lib/todo'
import { Todo, Priority } from '@/types/todo'
import AddTodoForm from '@/components/add-todo-form'
import TodoItem from '@/components/todo-item'
import React from 'react'

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
  const router = useRouter()
  
  // Tab, priority veya sayfa değiştiğinde todo'ları getirmek için effect
  useEffect(() => {
    if (isAuthenticated()) {
      fetchTodos();
    }
  }, [activeTab, selectedPriority, currentPage]);
  
  useEffect(() => {
    // Check if the user is authenticated on component mount
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
      
      // Filtreleme parametrelerini hazırla
      const status = activeTab !== 'all' ? activeTab as 'active' | 'completed' : undefined;
      
      // Server'dan filtrelenmiş todo'ları getir
      const response = await getTodos({ 
        status, 
        priority: selectedPriority, 
        page: currentPage, 
        limit: 3 
      });
      
      setTodos(response.todos);
      setTotalPages(response.pagination.pages);
      setTotalTodos(response.pagination.total);
      
      // Sekme sayılarını güncelle
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
  
  const handleAddTodo = async (newTodo: Todo) => {
    // Todo ekledikten sonra sayfa 1'e dön ve listeyi yenile
    setCurrentPage(1);
    await fetchTodos();
  }
  
  const handleUpdateTodo = async (updatedTodo: Todo) => {
    // Todo güncelledikten sonra güncel listeyi tekrar çek
    await fetchTodos();
  }
  
  const handleDeleteTodo = async (id: string) => {
    // Todo sildikten sonra güncel listeyi tekrar çek
    await fetchTodos();
  }
  
  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  }
  
  // Filtre değişiklikleri için tek bir fonksiyon
  const applyFilters = (tabValue?: string, priorityValue?: Priority | null, pageValue?: number) => {
    // Mevcut değerleri kullan veya parametreyle geçilenleri kullan
    const newTab = tabValue !== undefined ? tabValue : activeTab;
    const newPriority = priorityValue !== undefined ? priorityValue : selectedPriority;
    const newPage = pageValue !== undefined ? pageValue : currentPage;
    
    // State güncellemelerini batch olarak yap
    setActiveTab(newTab);
    setSelectedPriority(newPriority);
    setCurrentPage(newPage);
    
    // Manuel olarak verileri getir (useEffect'i beklemek yerine)
    const status = newTab !== 'all' ? newTab as 'active' | 'completed' : undefined;
    
    setLoading(true);
    getTodos({ 
      status, 
      priority: newPriority, 
      page: newPage, 
      limit: 3 
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
  
  // Handle tab change
  const handleTabChange = (value: string | null) => {
    if (value) {
      applyFilters(value, null, 1); // Tab değiştiğinde priority'yi null yap ve sayfa 1'e dön
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    applyFilters(undefined, undefined, newPage); // Sadece sayfa değiştir
  };
  
  // Önce sayfayı resetle sonra filtreyi değiştir
  const handlePriorityChange = (priority: Priority | null) => {
    applyFilters(undefined, priority, 1); // Öncelik değiştiğinde sayfa 1'e dön
  };
  
  // Tamamlanan ve aktif todo sayılarını hesapla (genel toplam için)
  // Not: Bu değerler backend'den gelen toplam sayıları göstermek için ideal olarak API'den alınmalı
  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;
  
  if (loading && todos.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader size="xl" color="blue" />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Paper shadow="xs" className="border-b mb-8 py-4 bg-white">
        <Container size="md">
          <Group justify="space-between" align="center">
            <Group>
              <Title order={2} className="text-blue-600 flex items-center gap-2">
                <IconList size={28} className="text-blue-500" />
                Todo Master
              </Title>
            </Group>
            
            <Group>
              <Group>
                <IconUser size={16} className="text-gray-500" />
                <Text size="sm" color="dimmed" className="hidden sm:inline">
                  {username}
                </Text>
              </Group>
              
              <Button 
                onClick={() => router.push('/profile')} 
                color="blue" 
                variant="subtle"
                radius="md"
                leftSection={<IconUser size={16} />}
              >
                Profile
              </Button>
              
              <Button 
                onClick={handleLogout} 
                color="red" 
                variant="outline"
                radius="md"
                leftSection={<IconLogout size={16} />}
              >
                Logout
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>
      
      <Container size="md" className="pb-12">
        <AddTodoForm onAddTodo={handleAddTodo} />
        
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
                <Group justify="space-between" mb="md">
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                  >
                    <Tabs.List>
                      <Tabs.Tab 
                        value="all" 
                        leftSection={<IconList size={14} />}
                        rightSection={
                          <Badge 
                            size="xs" 
                            variant="filled" 
                            radius="sm"
                            className="ml-1"
                          >
                            {totalAll}
                          </Badge>
                        }
                      >
                        All
                      </Tabs.Tab>
                      <Tabs.Tab 
                        value="active" 
                        leftSection={<IconClock size={14} />}
                        rightSection={
                          <Badge 
                            size="xs" 
                            variant="filled" 
                            radius="sm"
                            className="ml-1"
                          >
                            {totalActive}
                          </Badge>
                        }
                      >
                        Active
                      </Tabs.Tab>
                      <Tabs.Tab 
                        value="completed" 
                        leftSection={<IconCheck size={14} />}
                        rightSection={
                          <Badge 
                            size="xs" 
                            variant="filled" 
                            radius="sm"
                            className="ml-1"
                          >
                            {totalCompleted}
                          </Badge>
                        }
                      >
                        Completed
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                  
                  <Group>
                    <Text size="sm" color="dimmed">Filter:</Text>
                    <Group gap={4}>
                      <ActionIcon 
                        size="md" 
                        color={selectedPriority === Priority.LOW ? "teal" : "gray"} 
                        variant={selectedPriority === Priority.LOW ? "filled" : "subtle"}
                        onClick={() => handlePriorityChange(selectedPriority === Priority.LOW ? null : Priority.LOW)}
                        radius="xl"
                        title="Low Priority"
                      >
                        L
                      </ActionIcon>
                      <ActionIcon 
                        size="md" 
                        color={selectedPriority === Priority.MEDIUM ? "blue" : "gray"} 
                        variant={selectedPriority === Priority.MEDIUM ? "filled" : "subtle"}
                        onClick={() => handlePriorityChange(selectedPriority === Priority.MEDIUM ? null : Priority.MEDIUM)}
                        radius="xl"
                        title="Medium Priority"
                      >
                        M
                      </ActionIcon>
                      <ActionIcon 
                        size="md" 
                        color={selectedPriority === Priority.HIGH ? "red" : "gray"} 
                        variant={selectedPriority === Priority.HIGH ? "filled" : "subtle"}
                        onClick={() => handlePriorityChange(selectedPriority === Priority.HIGH ? null : Priority.HIGH)}
                        radius="xl"
                        title="High Priority"
                      >
                        H
                      </ActionIcon>
                    </Group>
                  </Group>
                </Group>
                
                <div className="mt-2">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader size="md" />
                    </div>
                  ) : todos.length === 0 ? (
                    <Card className="border border-dashed bg-transparent">
                      <Text ta="center" color="dimmed" py={4}>
                        No {activeTab !== "all" ? activeTab : ""} tasks {selectedPriority ? `with ${selectedPriority} priority` : ""} found.
                      </Text>
                    </Card>
                  ) : (
                    <div>
                      <Group justify="space-between" align="center" className="mb-4 text-xs text-gray-500">
                        <Group gap={8}>
                          <span>
                            Showing {todos.length} of {totalTodos} tasks 
                            ({activeTab !== "all" ? activeTab : "all"} {selectedPriority ? `/ ${selectedPriority} priority` : ""})
                          </span>
                          <Badge 
                            color="blue" 
                            size="xs" 
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <IconArrowDown size={10} /> Newest first
                          </Badge>
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
                                onClick={() => setSelectedPriority(null)}
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
                          onUpdate={handleUpdateTodo}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                      
                      {/* Sayfalama kontrolü */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                          <Pagination 
                            total={totalPages} 
                            value={currentPage}
                            onChange={handlePageChange}
                            withEdges
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Paper>
            </Box>
          )}
        </Transition>
          
        {todos.length === 0 && !loading && (
          <Paper shadow="sm" p="xl" withBorder className="mt-8 text-center">
            <IconList size={48} className="text-gray-300 mx-auto mb-4" />
            <Title order={3} className="text-gray-700 mb-2">No todos yet</Title>
            <Text color="dimmed">
              Create your first todo using the form above!
            </Text>
          </Paper>
        )}
      </Container>
    </main>
  )
} 