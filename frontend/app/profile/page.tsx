'use client'

import { Container, Loader } from '@mantine/core'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/use-profile'

// Import our components
import ProfileHeader from '@/components/profile/profile-header'
import PasswordChangeForm from '@/components/profile/password-change-form'
import AccountInfo from '@/components/profile/account-info'

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  
  // Use our profile hook
  const { loading, userData } = useProfile()
  
  // Handle logout
  const handleLogout = () => {
    logout()
    router.push('/login')
  }
  
  // Handle user data update (from password change form)
  const handleUserDataUpdate = (updatedData: any) => {
    // Update the userData state with the new user data
    router.refresh(); // Refresh the page to get the latest user data
  }
  
  // Show loading state
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
        {/* Header */}
        <ProfileHeader 
          username={userData?.username || 'Kullanıcı'} 
          onLogout={handleLogout} 
        />
        
        {/* Password Change Form */}
        <PasswordChangeForm 
          onUserDataUpdate={handleUserDataUpdate} 
        />
        
        {/* Account Info */}
        <AccountInfo 
          username={userData?.username} 
          email={userData?.email} 
        />
      </Container>
    </main>
  )
} 