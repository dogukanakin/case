'use client';

import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

interface TodoSearchProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export default function TodoSearch({ searchQuery, onSearchChange, onClearSearch }: TodoSearchProps) {
  return (
    <div className="mb-4">
      <TextInput
        placeholder="Search todos by title, description or tags..."
        value={searchQuery}
        onChange={onSearchChange}
        size="md"
        radius="md"
        leftSection={<IconSearch size={16} />}
        rightSection={
          searchQuery ? (
            <ActionIcon
              size="sm"
              radius="xl"
              variant="transparent"
              onClick={onClearSearch}
              color="gray"
            >
              <IconX size={16} />
            </ActionIcon>
          ) : null
        }
      />
    </div>
  );
} 