'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { IconLock, IconMail, IconUserPlus, IconLogin } from '@tabler/icons-react'
import { isAuthenticated } from '@/lib/auth'
import { useLoginForm } from '@/hooks/use-login-form'
import { useAuth } from '@/hooks/use-auth'

export default function LoginPage() {
  const router = useRouter()
  const { checkAuth } = useAuth();
  
  // Use our custom hook
  const {
    error,
    loading,
    register,
    handleSubmit,
    errors,
    onSubmit
  } = useLoginForm();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      checkAuth(); // Ensure auth state is updated
      router.push('/todos')
    }
  }, [router, checkAuth])
  
  // Success callback after login
  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      await checkAuth(); // Update auth state
      router.push('/todos');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container size="xs">
        <Paper shadow="md" p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="center" mb="md">
              <ThemeIcon size="xl" radius="xl" color="blue" variant="light">
                <IconLogin size={24} />
              </ThemeIcon>
            </Group>
            
            <Title order={2} ta="center">Welcome back</Title>
            <Text c="dimmed" size="sm" ta="center">
              Sign in to access your todos and stay organized
            </Text>
            
            {error && (
              <Alert color="red" title="Login failed">
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack gap="md">
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
                  placeholder="Your password"
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
                  Log in
                </Button>
              </Stack>
            </form>
            
            <Divider label="Don't have an account?" labelPosition="center" my="md" />
            
            <Button
              variant="subtle"
              color="gray"
              fullWidth
              leftSection={<IconUserPlus size={16} />}
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
          </Stack>
        </Paper>
      </Container>
    </div>
  )
} 