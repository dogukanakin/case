'use client';

import { useState } from 'react';
import { Button, TextInput, Textarea, Select, Paper, Group, Box, Badge, ActionIcon, Title } from '@mantine/core';
import { createTodo } from '@/lib/todo';
import { Todo, Priority } from '@/types/todo';
import { IconPlus, IconX, IconListCheck } from '@tabler/icons-react';

interface AddTodoFormProps {
  onAddTodo: (newTodo: Todo) => void;
}

export default function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priorityOptions = [
    { value: Priority.LOW, label: 'Low Priority' },
    { value: Priority.MEDIUM, label: 'Medium Priority' },
    { value: Priority.HIGH, label: 'High Priority' },
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log('Submitting todo with data:', {
        title: title.trim(),
        description: description.trim(),
        priority,
        tags: tags || []
      });
      
      const newTodo = await createTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        tags: tags.length > 0 ? tags : undefined
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority(Priority.MEDIUM);
      setTags([]);
      
      // Add the new todo to the list
      onAddTodo(newTodo);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper shadow="sm" p="md" withBorder mb="lg" className="bg-white">
      <form onSubmit={handleSubmit}>
        <Group justify="space-between" mb="md">
          <Title order={4} className="flex items-center gap-2">
            <IconListCheck size={22} className="text-blue-500" />
            Add New Todo
          </Title>
        </Group>
        
        <div className="space-y-4">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            label="Title"
            required
            error={error}
            disabled={isSubmitting}
            size="md"
          />
          
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details (optional)"
            label="Description"
            minRows={3}
            disabled={isSubmitting}
            size="md"
          />
          
          <Select
            label="Priority Level"
            placeholder="Select priority"
            value={priority}
            onChange={(value) => setPriority(value as Priority)}
            data={priorityOptions}
            disabled={isSubmitting}
            size="md"
          />
          
          <Box>
            <Group justify="space-between" mb="xs">
              <Box className="text-sm font-medium">Tags</Box>
              <Badge size="sm" radius="sm" color="gray">
                {tags.length}/5
              </Badge>
            </Group>
            
            {tags.length > 0 && (
              <Group mb="sm" className="flex-wrap">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    color="blue" 
                    variant="outline"
                    className="py-1"
                    rightSection={
                      <ActionIcon 
                        size="xs" 
                        color="blue" 
                        variant="transparent"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1"
                      >
                        <IconX size={12} />
                      </ActionIcon>
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </Group>
            )}
            
            <Group className="mb-2">
              <TextInput
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                disabled={isSubmitting || tags.length >= 5}
                className="flex-1"
                size="sm"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.length >= 5 || isSubmitting}
                variant="outline"
                size="sm"
                radius="md"
              >
                Add Tag
              </Button>
            </Group>
          </Box>
          
          <Group justify="right" mt="lg">
            <Button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              leftSection={<IconPlus size={16} />}
              size="md"
              radius="md"
              fullWidth
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Create Task
            </Button>
          </Group>
        </div>
      </form>
    </Paper>
  );
} 