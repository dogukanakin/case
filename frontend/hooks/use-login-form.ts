import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';
import { LoginCredentials } from '@/types/auth';

interface UseLoginFormReturn {
  // Form state
  error: string | null;
  loading: boolean;
  
  // Form handling
  register: ReturnType<typeof useForm<LoginCredentials>>['register'];
  handleSubmit: ReturnType<typeof useForm<LoginCredentials>>['handleSubmit'];
  errors: ReturnType<typeof useForm<LoginCredentials>>['formState']['errors'];
  
  // Submit function
  onSubmit: (data: LoginCredentials) => Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();
  
  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      await loginUser(data);
      router.push('/todos');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    error,
    loading,
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
} 