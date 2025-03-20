'use client';

import { Button, Title, Text } from '@mantine/core';
import { ProfileHeaderProps } from '@/types/auth';

export default function ProfileHeader({ username, onLogout }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <Title order={2}>Profil Sayfası</Title>
        <Text size="sm" color="dimmed">
          Merhaba, {username || 'Kullanıcı'}!
        </Text>
      </div>
      <Button onClick={onLogout} color="red" variant="outline">
        Çıkış Yap
      </Button>
    </div>
  );
} 