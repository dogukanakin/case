'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Title, Text, Container, Card, Loader } from '@mantine/core'
import { isAuthenticated, logoutUser, getCurrentUser } from '@/lib/auth'

export default function TodosPage() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
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
      } catch (e) {
        console.error('Error getting user data:', e)
        setUsername('User')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])
  
  const handleLogout = () => {
    logoutUser()
    router.push('/login')
  }
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="xl" />
      </div>
    )
  }
  
  return (
    <main className="min-h-screen p-6">
      <Container size="md">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title order={2}>Your To-Do List</Title>
            <Text size="sm" color="dimmed">Welcome back, {username}!</Text>
          </div>
          <Button onClick={handleLogout} color="red" variant="outline">
            Logout
          </Button>
        </div>
        
        <Card shadow="sm" p="lg" radius="md" withBorder className="mb-4">
          <Text size="lg" className="mb-2 font-medium">
            Todo functionality will be implemented soon
          </Text>
          <Text color="dimmed" size="sm">
            This is a placeholder for the upcoming todo management features.
          </Text>
        </Card>
      </Container>
    </main>
  )
} 