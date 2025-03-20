'use client';

import { useState } from 'react';
import { Badge, ActionIcon, TextInput, Button, Group, Box, Text, Flex, Stack } from '@mantine/core';
import { IconX, IconPlus } from '@tabler/icons-react';

interface TodoTagsProps {
  tags: string[];
  onTagsChange?: (tags: string[]) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function TodoTags({ tags, onTagsChange, readOnly = false, disabled = false }: TodoTagsProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (!onTagsChange || readOnly) return;
    
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!onTagsChange || readOnly) return;
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  // Read-only mode for viewing tags
  if (readOnly) {
    if (tags.length === 0) return null;
    
    return (
      <Flex wrap="wrap" gap={6}>
        {tags.map(tag => (
          <Badge 
            key={tag} 
            color="blue" 
            size="sm" 
            variant="light" 
            radius="sm"
          >
            {tag}
          </Badge>
        ))}
      </Flex>
    );
  }

  // Editable mode for managing tags
  return (
    <Stack gap="xs">
      <Flex justify="space-between" align="center">
        <Text size="sm" fw={500} color="dimmed">
          Tags (max 5)
        </Text>
        <Text size="xs" color="dimmed">
          {tags.length}/5
        </Text>
      </Flex>
      
      {/* Display existing tags */}
      <Box>
        {tags.length > 0 ? (
          <Flex wrap="wrap" gap={8} mb={10}>
            {tags.map((tag) => (
              <Flex key={tag} align="center" gap={2}>
                <Badge
                  size="md"
                  variant="filled"
                  color="blue"
                >
                  {tag}
                </Badge>
                <ActionIcon
                  size="xs"
                  color="red"
                  variant="subtle"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={disabled}
                  radius="xl"
                >
                  <IconX size={14} />
                </ActionIcon>
              </Flex>
            ))}
          </Flex>
        ) : (
          <Text size="xs" color="dimmed" mb={10}>
            No tags added yet
          </Text>
        )}
      </Box>
      
      {/* Add new tag input */}
      <Flex gap="sm">
        <TextInput
          placeholder="Add a tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          disabled={disabled || tags.length >= 5}
          style={{ flex: 1 }}
          size="xs"
          rightSection={
            tags.length >= 5 ? (
              <Text size="xs" color="dimmed" mr={8}>
                Max reached
              </Text>
            ) : null
          }
        />
        <Button
          onClick={handleAddTag}
          disabled={!newTag.trim() || tags.length >= 5 || disabled}
          variant="light"
          size="xs"
          color="blue"
          leftSection={<IconPlus size={14} />}
        >
          Add
        </Button>
      </Flex>
    </Stack>
  );
} 