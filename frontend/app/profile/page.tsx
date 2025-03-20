'use client'

import { Container, Loader, Title, Space } from '@mantine/core'
import { useProfile } from '@/hooks/use-profile'
import { useRouter } from 'next/navigation'

// Import our components
import PasswordChangeForm from '@/components/profile/password-change-form'
import AccountInfo from '@/components/profile/account-info'

export default function ProfilePage() {
  // Use our profile hook
  const { loading, userData } = useProfile()
  const router = useRouter()
  
  // Handle user data update (from password change form)
  const handleUserDataUpdate = () => {
    // Refresh the page to get the latest user data
    router.refresh()
  }
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="xl" color="blue" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Container size="md" py="lg">
        <Title order={2} mb="md">My Profile</Title>
        
        <Space h="md" />
        
        {/* Account Info */}
        <AccountInfo 
          username={userData?.username} 
          email={userData?.email} 
        />
        
        <Space h="md" />
        
        {/* Password Change Form */}
        <PasswordChangeForm 
          onUserDataUpdate={handleUserDataUpdate} 
        />
      </Container>
    </div>
  )
} 