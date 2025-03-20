import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getCurrentUser, logoutUser } from '@/lib/auth';
import { UseAuthReturn } from '@/types/auth';

export function useAuth(): UseAuthReturn {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async (): Promise<boolean> => {
    const isAuth = isAuthenticated();
    
    if (!isAuth) {
      if (!pathname.includes('/login') && !pathname.includes('/register') && pathname !== '/') {
        router.push('/login');
      }
      setLoading(false);
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
    setUsername('');
    router.push('/login');
  };

  // Check authentication on component mount and when pathname changes
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return {
    username,
    loading,
    error,
    logout,
    checkAuth
  };
} 