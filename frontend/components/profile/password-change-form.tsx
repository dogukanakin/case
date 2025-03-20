'use client';

import { Button, Card, Title, Alert, PasswordInput } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { usePasswordChange } from '@/hooks/use-password-change';

interface PasswordChangeFormProps {
  onUserDataUpdate: (userData: any) => void;
}

export default function PasswordChangeForm({ onUserDataUpdate }: PasswordChangeFormProps) {
  const {
    error,
    success,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit
  } = usePasswordChange(onUserDataUpdate);

  return (
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
          leftSection={<IconCheck size={16} />}
        >
          Şifreyi Değiştir
        </Button>
      </form>
    </Card>
  );
} 