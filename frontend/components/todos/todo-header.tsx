'use client';

import { Button, Group, Text, Title, Paper, Container } from '@mantine/core';
import { IconList, IconLogout, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface TodoHeaderProps {
  username: string;
  onLogout: () => void;
}

export default function TodoHeader({ username, onLogout }: TodoHeaderProps) {
  const router = useRouter();
  
  return (
    <Paper shadow="xs" className="border-b mb-8 py-4 bg-white">
      <Container size="md">
        <Group justify="space-between" align="center">
          <Group>
            <Title order={2} className="text-blue-600 flex items-center gap-2">
              <IconList size={28} className="text-blue-500" />
              Todo Master
            </Title>
          </Group>
          
          <Group>
            <Group>
              <IconUser size={16} className="text-gray-500" />
              <Text size="sm" color="dimmed" className="hidden sm:inline">
                {username}
              </Text>
            </Group>
            
            <Button 
              onClick={() => router.push('/profile')} 
              color="blue" 
              variant="subtle"
              radius="md"
              leftSection={<IconUser size={16} />}
            >
              Profile
            </Button>
            
            <Button 
              onClick={onLogout} 
              color="red" 
              variant="outline"
              radius="md"
              leftSection={<IconLogout size={16} />}
            >
              Logout
            </Button>
          </Group>
        </Group>
      </Container>
    </Paper>
  );
} 