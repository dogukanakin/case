'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Paper, 
  Alert, 
  Container,
  Card,
  Loader
} from '@mantine/core'
import { useAuth } from '@/components/auth/auth-provider'
import { PasswordChangeCredentials } from '@/types/auth'
import { notifications } from '@mantine/notifications'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'

export default function ProfilePage() {
  const router = useRouter()
  const { logout, changeUserPassword } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<{ username?: string; email?: string } | null>(null)
  
  const { register, handleSubmit, reset, formState: { errors }, watch, setError: setFormError } = useForm<PasswordChangeCredentials & { newPasswordConfirm: string }>()
  
  // Sayfaya her girişte kimlik doğrulaması yapılıyor
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = isAuthenticated()
      
      if (!isAuth) {
        console.log('Not authenticated, redirecting to login...')
        router.push('/login')
        return
      }
      
      try {
        // Önce localStorage'dan kullanıcı bilgilerini al (daha hızlı)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUserData(parsedUser)
        } else {
          // Alternatif olarak API'den kullanıcı bilgilerini al
          const user = await getCurrentUser()
          setUserData(user)
        }
      } catch (e) {
        console.error('Error getting user data:', e)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])
  
  const onSubmit = async (data: PasswordChangeCredentials & { newPasswordConfirm: string }) => {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    
    // Şifre eşleşme kontrolü
    if (data.newPassword !== data.newPasswordConfirm) {
      setFormError('newPasswordConfirm', { 
        type: 'manual', 
        message: 'Yeni şifreler eşleşmiyor' 
      })
      setIsSubmitting(false)
      return
    }
    
    // Mevcut ve yeni şifre aynı olmamalı
    if (data.currentPassword === data.newPassword) {
      setFormError('newPassword', { 
        type: 'manual', 
        message: 'Yeni şifre mevcut şifrenizle aynı olamaz' 
      })
      setIsSubmitting(false)
      return
    }
    
    try {
      const { currentPassword, newPassword } = data
      const result = await changeUserPassword({ currentPassword, newPassword })
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = await getCurrentUser(); // Fetch updated user data
      setUserData(updatedUser);
      setSuccess('Şifreniz başarıyla değiştirildi')
      reset() // Formu sıfırla
      
      // Başarılı bildirim göster
      notifications.show({
        title: 'Başarılı',
        message: 'Şifreniz başarıyla değiştirildi',
        color: 'green'
      })
    } catch (err: any) {
      setError(err.message)
      
      // Hata bildirimi göster
      notifications.show({
        title: 'Hata',
        message: err.message,
        color: 'red'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleLogout = () => {
    logout()
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
            <Title order={2}>Profil Sayfası</Title>
            <Text size="sm" color="dimmed">
              Merhaba, {userData?.username || 'Kullanıcı'}!
            </Text>
          </div>
          <Button onClick={handleLogout} color="red" variant="outline">
            Çıkış Yap
          </Button>
        </div>
        
        <Card shadow="sm" p="lg" radius="md" withBorder className="mb-4">
          <Title order={3} className="mb-4">Şifre Değiştir</Title>
          
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert color="green" className="mb-4">
              {success}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PasswordInput
              label="Mevcut Şifre"
              placeholder="Mevcut şifrenizi girin"
              required
              {...register('currentPassword', { 
                required: 'Mevcut şifre gerekli',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalıdır'
                }
              })}
              error={errors.currentPassword?.message}
            />
            
            <PasswordInput
              label="Yeni Şifre"
              placeholder="Yeni şifrenizi girin"
              required
              {...register('newPassword', { 
                required: 'Yeni şifre gerekli',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalıdır'
                }
              })}
              error={errors.newPassword?.message}
            />
            
            <PasswordInput
              label="Yeni Şifre (Tekrar)"
              placeholder="Yeni şifrenizi tekrar girin"
              required
              {...register('newPasswordConfirm', { 
                required: 'Şifre tekrarı gerekli',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalıdır'
                },
                validate: (value) => {
                  return watch('newPassword') === value || 'Şifreler eşleşmiyor'
                }
              })}
              error={errors.newPasswordConfirm?.message}
            />
            
            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              color="blue"
            >
              Şifreyi Değiştir
            </Button>
          </form>
        </Card>
        
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3} className="mb-4">Hesap Bilgileri</Title>
          
          <div className="space-y-2">
            <div>
              <Text className="font-semibold">Kullanıcı Adı:</Text>
              <Text>{userData?.username}</Text>
            </div>
            
            <div>
              <Text className="font-semibold">E-posta:</Text>
              <Text>{userData?.email}</Text>
            </div>
          </div>
        </Card>
      </Container>
    </main>
  )
} 