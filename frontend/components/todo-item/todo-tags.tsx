'use client';

import { useState } from 'react';
import { Badge, ActionIcon, TextInput, Button, Group, Box, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

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
      <Group className="mt-3 gap-1">
        <Group className="flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag} color="blue" size="xs" variant="light" radius="sm">{tag}</Badge>
          ))}
        </Group>
      </Group>
    );
  }

  // Editable mode for managing tags
  return (
    <Box className="space-y-2">
      <Box className="text-sm font-medium">Tags (max 5)</Box>
      <Text size="xs" className="text-gray-500 -mt-1 mb-1">
        {tags.length}/5
      </Text>
      
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            size="lg"
            variant="filled"
            color="blue"
            rightSection={
              <ActionIcon
                size="xs"
                color="blue"
                onClick={() => handleRemoveTag(tag)}
                radius="xl"
                variant="transparent"
                disabled={disabled}
              >
                <IconX size={10} />
              </ActionIcon>
            }
          >
            {tag}
          </Badge>
        ))}
      </div>
      
      <Group>
        <TextInput
          placeholder="Add a tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          disabled={disabled || tags.length >= 5}
          className="flex-1"
          size="xs"
        />
        <Button
          type="button"
          onClick={handleAddTag}
          disabled={!newTag.trim() || tags.length >= 5 || disabled}
          variant="outline"
          size="xs"
        >
          Add
        </Button>
      </Group>
    </Box>
  );
} 