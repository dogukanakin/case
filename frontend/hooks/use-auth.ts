import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser, logoutUser } from '@/lib/auth';
import { UseAuthReturn } from '@/types/auth';

export function useAuth(): UseAuthReturn {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = async (): Promise<boolean> => {
    const isAuth = isAuthenticated();
    
    if (!isAuth) {
      router.push('/login');
      return false;
    }
    
    try {
      // Try to get user data from localStorage first (faster)
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || 'User');
      } else {
        // As a fallback, get the current user from the API
        const userData = await getCurrentUser();
        setUsername(userData.username || 'User');
      }
      setError(null);
      return true;
    } catch (e) {
      console.error('Error getting user data:', e);
      setUsername('User');
      setError('Failed to load user data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    router.push('/login');
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, [router]);

  return {
    username,
    loading,
    error,
    logout,
    checkAuth
  };
} 