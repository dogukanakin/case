'use client';

import { Button, Card, Title, Alert, PasswordInput, Stack, ThemeIcon } from '@mantine/core';
import { IconCheck, IconLock } from '@tabler/icons-react';
import { usePasswordChange } from '@/hooks/use-password-change';
import { PasswordChangeFormProps } from '@/types/auth';

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
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3} mb="lg">Change Password</Title>
      
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert color="green" mb="md">
          {success}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            required
            leftSection={<IconLock size={16} />}
            {...register('currentPassword', { 
              required: 'Current password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.currentPassword?.message}
          />
          
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            required
            leftSection={<IconLock size={16} />}
            {...register('newPassword', { 
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.newPassword?.message}
          />
          
          <PasswordInput
            label="Confirm New Password"
            placeholder="Enter your new password again"
            required
            leftSection={<IconLock size={16} />}
            {...register('newPasswordConfirm', { 
              required: 'Password confirmation is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              },
              validate: (value: string) => {
                return watch('newPassword') === value || 'Passwords do not match'
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
            Change Password
          </Button>
        </Stack>
      </form>
    </Card>
  );
} 