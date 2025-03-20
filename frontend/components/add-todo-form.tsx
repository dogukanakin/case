'use client';

import { Button, TextInput, Textarea, Select, Paper, Group, Box, Title, FileInput, Text, Image, Stack, Card, ThemeIcon, Flex } from '@mantine/core';
import { IconPlus, IconListCheck, IconFile, IconPhoto } from '@tabler/icons-react';
import { Todo } from '@/types/todo';
import { useAddTodoForm } from '@/hooks/use-add-todo-form';
import TodoTags from '@/components/todo-item/todo-tags';

interface AddTodoFormProps {
  onAddTodo: (newTodo: Todo) => void;
}

export default function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const {
    title,
    description,
    priority,
    tags,
    newTag,
    imageFile,
    pdfFile,
    imagePreview,
    isSubmitting,
    error,
    priorityOptions,
    setTitle,
    setDescription,
    setPriority,
    setTags,
    setNewTag,
    handleAddTag,
    handleImageChange,
    setPdfFile,
    handleSubmit
  } = useAddTodoForm(onAddTodo);

  return (
    <Paper shadow="sm" p="md" withBorder mb="lg" radius="md">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Group justify="space-between" mb="md">
            <Flex align="center" gap={8}>
              <ThemeIcon size="md" color="blue" variant="light" radius="xl">
                <IconListCheck size={18} />
              </ThemeIcon>
              <Title order={4}>Add New Todo</Title>
            </Flex>
          </Group>
          
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
            onChange={(value) => setPriority(value as any)}
            data={priorityOptions}
            disabled={isSubmitting}
            size="md"
          />
          
          <Box>
            <TodoTags 
              tags={tags}
              onTagsChange={setTags}
              disabled={isSubmitting}
            />
          </Box>

          {/* Image Upload */}
          <Card withBorder p="sm" radius="md">
            <Stack gap="xs">
              <Box>
                <Flex align="center" gap={6} mb={5}>
                  <ThemeIcon size="sm" color="blue" variant="light">
                    <IconPhoto size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">Image Thumbnail</Text>
                </Flex>
                <FileInput
                  accept="image/jpeg,image/png"
                  placeholder="Upload an image (optional)"
                  leftSection={<IconPhoto size={16} />}
                  value={imageFile}
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  clearable
                  size="md"
                  description="Supported formats: JPG, PNG"
                />
                {imagePreview && (
                  <Box mt="xs">
                    <Text size="xs" c="dimmed" mb={4}>Preview:</Text>
                    <Image 
                      src={imagePreview} 
                      width={200} 
                      height={200} 
                      fit="contain" 
                      radius="sm"
                      style={{ width: 200, height: 200, objectFit: 'contain' }}
                      className="border"
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </Card>

          {/* File Upload */}
          <Card withBorder p="sm" radius="md">
            <Stack gap="xs">
              <Box>
                <Flex align="center" gap={6} mb={5}>
                  <ThemeIcon size="sm" color="blue" variant="light">
                    <IconFile size={14} />
                  </ThemeIcon>
                  <Text fw={500} size="sm">File Attachment</Text>
                </Flex>
                <FileInput
                  accept="application/pdf"
                  placeholder="Upload a PDF (optional)"
                  leftSection={<IconFile size={16} />}
                  value={pdfFile}
                  onChange={setPdfFile}
                  disabled={isSubmitting}
                  clearable
                  size="md"
                  description="Supported format: PDF"
                />
                {pdfFile && (
                  <Text size="xs" c="dimmed" mt={4}>
                    Selected file: {pdfFile.name} ({Math.round(pdfFile.size / 1024)} KB)
                  </Text>
                )}
              </Box>
            </Stack>
          </Card>
          
          <Button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            leftSection={<IconPlus size={16} />}
            size="md"
            radius="md"
            fullWidth
            loading={isSubmitting}
            color="blue"
          >
            Create Task
          </Button>
        </Stack>
      </form>
    </Paper>
  );
} 