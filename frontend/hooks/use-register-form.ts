import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import { RegisterCredentials } from '@/types/auth';

interface UseRegisterFormReturn {
  // Form state
  error: string | null;
  loading: boolean;
  
  // Form handling
  register: ReturnType<typeof useForm<RegisterCredentials>>['register'];
  handleSubmit: ReturnType<typeof useForm<RegisterCredentials>>['handleSubmit'];
  errors: ReturnType<typeof useForm<RegisterCredentials>>['formState']['errors'];
  
  // Submit function
  onSubmit: (data: RegisterCredentials) => Promise<void>;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>();
  
  const onSubmit = async (data: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      await registerUser(data);
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