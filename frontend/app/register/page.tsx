'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Paper, 
  Alert, 
  Stack, 
  Group, 
  Box,
  Divider,
  Container,
  ThemeIcon
} from '@mantine/core'
import { IconUserPlus, IconMail, IconLock, IconUser, IconLogin } from '@tabler/icons-react'
import { isAuthenticated } from '@/lib/auth'
import { useRegisterForm } from '@/hooks/use-register-form'

export default function RegisterPage() {
  const router = useRouter()
  
  // Use our custom hook
  const {
    error,
    loading,
    register,
    handleSubmit,
    errors,
    onSubmit
  } = useRegisterForm();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/todos')
    }
  }, [router])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container size="xs">
        <Paper shadow="md" p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="center" mb="md">
              <ThemeIcon size="xl" radius="xl" color="blue" variant="light">
                <IconUserPlus size={24} />
              </ThemeIcon>
            </Group>
            
            <Title order={2} ta="center">Create an account</Title>
            <Text c="dimmed" size="sm" ta="center">
              Get started with Todo Master by creating your account
            </Text>
            
            {error && (
              <Alert color="red" title="Registration failed">
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  required
                  leftSection={<IconUser size={16} />}
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  error={errors.username?.message}
                />
                
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  leftSection={<IconMail size={16} />}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                />
                
                <PasswordInput
                  label="Password"
                  placeholder="Create a strong password"
                  required
                  leftSection={<IconLock size={16} />}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  error={errors.password?.message}
                />
                
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  color="blue"
                  size="md"
                  mt="md"
                >
                  Register
                </Button>
              </Stack>
            </form>
            
            <Divider label="Already have an account?" labelPosition="center" my="md" />
            
            <Button
              variant="subtle"
              color="gray"
              fullWidth
              leftSection={<IconLogin size={16} />}
              onClick={() => router.push('/login')}
            >
              Log in
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  )
} 