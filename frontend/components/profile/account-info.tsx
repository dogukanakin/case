'use client';

import { Card, Title, Text } from '@mantine/core';
import { AccountInfoProps } from '@/types/auth';

export default function AccountInfo({ username, email }: AccountInfoProps) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3} className="mb-4">Hesap Bilgileri</Title>
      
      <div className="space-y-2">
        <div>
          <Text className="font-semibold">Kullanıcı Adı:</Text>
          <Text>{username}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">E-posta:</Text>
          <Text>{email}</Text>
        </div>
      </div>
    </Card>
  );
} 