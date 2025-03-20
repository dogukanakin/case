'use client';

import { Paper, Title, Text } from '@mantine/core';
import { IconList } from '@tabler/icons-react';

export default function TodoEmptyState() {
  return (
    <Paper shadow="sm" p="xl" withBorder className="mt-8 text-center">
      <IconList size={48} className="text-gray-300 mx-auto mb-4" />
      <Title order={3} className="text-gray-700 mb-2">No todos yet</Title>
      <Text color="dimmed">
        Create your first todo using the form above!
      </Text>
    </Paper>
  );
} 