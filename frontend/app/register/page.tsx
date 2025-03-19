'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { TextInput, PasswordInput, Button, Title, Text, Paper, Alert } from '@mantine/core'
import { registerUser, isAuthenticated } from '@/lib/auth'
import { RegisterCredentials } from '@/types/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Eğer zaten giriş yapmışsa todos sayfasına yönlendir
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/todos')
    }
  }, [router])
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>()
  
  const onSubmit = async (data: RegisterCredentials) => {
    setLoading(true)
    setError(null)
    
    try {
      await registerUser(data)
      router.push('/todos')
    } catch (err: any) {
      // Hata mesajını göster
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Paper shadow="md" p="xl" radius="md" className="w-full max-w-md">
        <Title order={2} className="text-center mb-6">Create an account</Title>
        
        {error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextInput
            label="Username"
            placeholder="johndoe"
            required
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
            placeholder="your@email.com"
            required
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
            placeholder="Create a password"
            required
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
          >
            Sign up
          </Button>
        </form>
        
        <Text className="text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </Text>
      </Paper>
    </main>
  )
} 