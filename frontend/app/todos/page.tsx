'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Title, Text, Container, Card, Loader, Alert, Paper, Group, Tabs, Badge, ActionIcon, Transition, Box } from '@mantine/core'
import { IconAlertCircle, IconUser, IconLogout, IconFilter, IconCheck, IconClock, IconList, IconX } from '@tabler/icons-react'
import { isAuthenticated, logoutUser, getCurrentUser } from '@/lib/auth'
import { getTodos } from '@/lib/todo'
import { Todo, Priority } from '@/types/todo'
import AddTodoForm from '@/components/add-todo-form'
import TodoItem from '@/components/todo-item'

export default function TodosPage() {
  const [loading, setLoading] = useState(true)
  const [todos, setTodos] = useState<Todo[]>([])
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null)
  const router = useRouter()
  
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
        
        // Fetch todos
        await fetchTodos()
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
      setError(null)
      const todoData = await getTodos()
      setTodos(todoData)
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to load todos. Please try again.')
    }
  }
  
  const handleAddTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [newTodo, ...prevTodos])
  }
  
  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    )
  }
  
  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id))
  }
  
  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }
  
  // Handle tab change
  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
    }
  };
  
  const filteredTodos = todos.filter(todo => {
    if (activeTab === "completed" && !todo.completed) return false
    if (activeTab === "active" && todo.completed) return false
    if (selectedPriority && todo.priority !== selectedPriority) return false
    return true
  })
  
  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.length - completedCount
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader size="xl" color="blue" />
      </div>
    )
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
        
        <Transition mounted={todos.length > 0} transition="fade" duration={400}>
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
                            {todos.length}
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
                            {activeCount}
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
                            {completedCount}
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
                        onClick={() => setSelectedPriority(selectedPriority === Priority.LOW ? null : Priority.LOW)}
                        radius="xl"
                        title="Low Priority"
                      >
                        L
                      </ActionIcon>
                      <ActionIcon 
                        size="md" 
                        color={selectedPriority === Priority.MEDIUM ? "blue" : "gray"} 
                        variant={selectedPriority === Priority.MEDIUM ? "filled" : "subtle"}
                        onClick={() => setSelectedPriority(selectedPriority === Priority.MEDIUM ? null : Priority.MEDIUM)}
                        radius="xl"
                        title="Medium Priority"
                      >
                        M
                      </ActionIcon>
                      <ActionIcon 
                        size="md" 
                        color={selectedPriority === Priority.HIGH ? "red" : "gray"} 
                        variant={selectedPriority === Priority.HIGH ? "filled" : "subtle"}
                        onClick={() => setSelectedPriority(selectedPriority === Priority.HIGH ? null : Priority.HIGH)}
                        radius="xl"
                        title="High Priority"
                      >
                        H
                      </ActionIcon>
                    </Group>
                  </Group>
                </Group>
                
                <div className="mt-2">
                  {filteredTodos.length === 0 ? (
                    <Card className="border border-dashed bg-transparent">
                      <Text ta="center" color="dimmed" py={4}>
                        No {activeTab !== "all" ? activeTab : ""} tasks {selectedPriority ? `with ${selectedPriority} priority` : ""} found.
                      </Text>
                    </Card>
                  ) : (
                    <div>
                      <Group justify="space-between" align="center" className="mb-4 text-xs text-gray-500">
                        <span>Showing {filteredTodos.length} of {todos.length} tasks</span>
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
                      
                      {filteredTodos.map(todo => (
                        <TodoItem 
                          key={todo._id}
                          todo={todo}
                          onUpdate={handleUpdateTodo}
                          onDelete={handleDeleteTodo}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Paper>
            </Box>
          )}
        </Transition>
          
        {todos.length === 0 && (
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