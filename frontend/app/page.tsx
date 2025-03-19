'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@mantine/core'
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
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            To-Do App with ChatGPT
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage your tasks efficiently with AI-powered suggestions
          </p>
        </div>
        
        <div className="flex flex-col space-y-4 mt-8">
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
        </div>
      </div>
    </main>
  )
}
