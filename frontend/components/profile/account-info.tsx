'use client';

import { Card, Title, Text, Group, ThemeIcon, Stack } from '@mantine/core';
import { IconUser, IconMail } from '@tabler/icons-react';
import { AccountInfoProps } from '@/types/auth';

export default function AccountInfo({ username, email }: AccountInfoProps) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3} mb="lg">Account Information</Title>
      
      <Stack gap="md">
        <Group>
          <ThemeIcon size="md" color="blue" variant="light" radius="xl">
            <IconUser size={16} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500} c="dimmed">Username</Text>
            <Text>{username || 'Not available'}</Text>
          </div>
        </Group>
        
        <Group>
          <ThemeIcon size="md" color="blue" variant="light" radius="xl">
            <IconMail size={16} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500} c="dimmed">Email Address</Text>
            <Text>{email || 'Not available'}</Text>
          </div>
        </Group>
      </Stack>
    </Card>
  );
} 