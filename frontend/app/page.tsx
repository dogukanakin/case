'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Container, Title, Text, Paper, ThemeIcon, Stack, Center } from '@mantine/core'
import { IconList } from '@tabler/icons-react'
import { isAuthenticated } from '@/lib/auth'

export default function Home() {
  const router = useRouter()
  
  // Eğer giriş yapmışsa, todos sayfasına yönlendir
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/todos')
    }
  }, [router])
  
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container size="xs">
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack align="center" gap="lg">
            <ThemeIcon size="xl" radius="xl" color="blue" variant="light">
              <IconList size={24} />
            </ThemeIcon>
            
            <Title order={2} ta="center" style={{ color: '#228be6' }}>
              Todo Master
            </Title>
            
            <Text size="sm" c="dimmed" ta="center">
              Organize your tasks efficiently with AI-powered suggestions
            </Text>
            
            <Button 
              component={Link} 
              href="/login" 
              fullWidth 
              size="md"
              color="blue"
            >
              Login
            </Button>
            
            <Button 
              component={Link} 
              href="/register" 
              fullWidth 
              size="md"
              variant="outline"
              color="blue"
            >
              Register
            </Button>
          </Stack>
        </Paper>
      </Container>
    </main>
  )
}
