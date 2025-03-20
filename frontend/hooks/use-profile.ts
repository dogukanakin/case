import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';

interface UserData {
  username?: string;
  email?: string;
}

interface UseProfileReturn {
  loading: boolean;
  userData: UserData | null;
  checkAuth: () => Promise<boolean>;
}

export function useProfile(): UseProfileReturn {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
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
        setUserData(parsedUser);
      } else {
        // As a fallback, get the current user from the API
        const user = await getCurrentUser();
        setUserData(user);
      }
      return true;
    } catch (e) {
      console.error('Error getting user data:', e);
      router.push('/login');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Run the auth check on component mount
  useEffect(() => {
    checkAuth();
  }, [router]);
  
  return {
    loading,
    userData,
    checkAuth
  };
} 