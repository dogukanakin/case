'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser, 
  isAuthenticated,
  changePassword 
} from '@/lib/auth'
import { 
  User, 
  LoginCredentials, 
  RegisterCredentials, 
  PasswordChangeCredentials 
} from '@/types/auth'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  changeUserPassword: (credentials: PasswordChangeCredentials) => Promise<void>;
  isAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuthStatus = async () => {
      try {
        const isAuth = isAuthenticated()
        setIsAuth(isAuth)
        
        if (isAuth) {
          const userData = await getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        // If there's an error fetching the user, log them out
        logoutUser()
        setIsAuth(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuthStatus()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const userData = await loginUser(credentials)
      setUser(userData)
      setIsAuth(true)
      router.push('/todos')
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to login'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const userData = await registerUser(credentials)
      setUser(userData)
      setIsAuth(true)
      router.push('/todos')
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to register'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    setIsAuth(false)
    router.push('/login')
  }

  const changeUserPassword = async (credentials: PasswordChangeCredentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await changePassword(credentials)
      // Kullanıcı bilgilerini güncelle (şifresi dışında)
      if (result.user) {
        setUser(result.user)
      }
      return result
    } catch (err: any) {
      setError(err.message || 'Şifre değiştirme başarısız oldu')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    changeUserPassword,
    isAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 