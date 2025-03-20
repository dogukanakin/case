'use client';

import { Button, Group, Text, Title, Paper, Container, ThemeIcon, Flex } from '@mantine/core';
import { IconList, IconLogout, IconUser } from '@tabler/icons-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { username, loading, logout, checkAuth } = useAuth();
  
  // Force check auth when pathname changes to /todos (after login)
  // Place all hooks before any conditional returns
  useEffect(() => {
    if (pathname === '/todos') {
      checkAuth();
    }
  }, [pathname, checkAuth]);
  
  // If we're on login or register pages, don't show navbar
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }
  
  return (
    <Paper shadow="xs" py="xs" withBorder className="mb-4 bg-white">
      <Container size="lg">
        <Group justify="space-between" align="center">
          <Flex align="center" gap={8}>
            <ThemeIcon size="md" color="blue" variant="light" radius="xl">
              <IconList size={18} />
            </ThemeIcon>
            <Title order={4} style={{ color: '#228be6' }}>Todo Master</Title>
          </Flex>
          
          {loading ? (
            <Text size="sm" c="dimmed">Loading...</Text>
          ) : username ? (
            <Group>
              <Flex align="center" gap={6}>
                <ThemeIcon size="xs" color="gray" variant="light" radius="xl">
                  <IconUser size={12} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" className="hidden sm:inline">
                  {username}
                </Text>
              </Flex>
              
              <Button 
                onClick={() => router.push('/todos')} 
                color="blue" 
                variant={pathname.includes('/todos') ? 'filled' : 'subtle'} 
                radius="md"
                size="sm"
              >
                Todos
              </Button>
              
              <Button 
                onClick={() => router.push('/profile')} 
                color="blue" 
                variant={pathname.includes('/profile') ? 'filled' : 'subtle'}
                radius="md"
                size="sm"
              >
                Profile
              </Button>
              
              <Button 
                onClick={logout} 
                color="red" 
                variant="outline"
                radius="md"
                size="sm"
              >
                Logout
              </Button>
            </Group>
          ) : (
          null
          )}
        </Group>
      </Container>
    </Paper>
  );
} 