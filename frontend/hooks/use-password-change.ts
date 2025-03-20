import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PasswordChangeCredentials, UsePasswordChangeReturn } from '@/types/auth';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@/components/auth/auth-provider';
import { getCurrentUser } from '@/lib/auth';

export function usePasswordChange(
  onUserDataUpdate?: (userData: any) => void
): UsePasswordChangeReturn {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { changeUserPassword } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors }, 
    watch, 
    setError: setFormError 
  } = useForm<PasswordChangeCredentials & { newPasswordConfirm: string }>();
  
  const resetForm = () => {
    reset();
    setError(null);
    setSuccess(null);
  };
  
  const onSubmit = async (data: PasswordChangeCredentials & { newPasswordConfirm: string }) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    // Password match validation
    if (data.newPassword !== data.newPasswordConfirm) {
      setFormError('newPasswordConfirm', { 
        type: 'manual', 
        message: 'Yeni şifreler eşleşmiyor' 
      });
      setIsSubmitting(false);
      return;
    }
    
    // New password should be different from current password
    if (data.currentPassword === data.newPassword) {
      setFormError('newPassword', { 
        type: 'manual', 
        message: 'Yeni şifre mevcut şifrenizle aynı olamaz' 
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const { currentPassword, newPassword } = data;
      const result = await changeUserPassword({ currentPassword, newPassword });
      
      // Update user data
      const updatedUser = await getCurrentUser();
      if (onUserDataUpdate) {
        onUserDataUpdate(updatedUser);
      }
      
      setSuccess('Şifreniz başarıyla değiştirildi');
      reset(); // Reset the form
      
      // Show success notification
      notifications.show({
        title: 'Başarılı',
        message: 'Şifreniz başarıyla değiştirildi',
        color: 'green'
      });
    } catch (err: any) {
      setError(err.message);
      
      // Show error notification
      notifications.show({
        title: 'Hata',
        message: err.message,
        color: 'red'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    error,
    success,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,
    resetForm
  };
} 