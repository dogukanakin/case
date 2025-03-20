'use client';

import { Card, Group, ThemeIcon, Text, Tooltip, ActionIcon, Stack, Flex, Box } from '@mantine/core';
import { IconBulb, IconInfoCircle } from '@tabler/icons-react';

interface TodoRecommendationProps {
  recommendation: string;
  isEditMode?: boolean;
}

export default function TodoRecommendation({ recommendation, isEditMode = false }: TodoRecommendationProps) {
  if (!recommendation) return null;
  
  const isErrorMessage = recommendation.includes('unavailable') || 
                        recommendation.includes('Sorry') || 
                        recommendation.includes('API key');
  
  return (
    <Card withBorder p="md" radius="md" bg="blue.0" shadow="xs">
      <Stack gap="xs">
        <Flex align="center" gap="xs">
          <ThemeIcon color="blue" size="sm" variant="light" radius="xl">
            <IconBulb size={16} />
          </ThemeIcon>
          <Text size="sm" fw={600} color="blue">AI Recommendation</Text>
          
          {isEditMode ? (
            <Text size="xs" color="dimmed" ml="auto">
              (will be updated when you save changes)
            </Text>
          ) : (
            <Tooltip label="AI-generated recommendation based on your task details">
              <ActionIcon size="xs" variant="transparent" color="gray" ml="auto">
                <IconInfoCircle size={16} />
              </ActionIcon>
            </Tooltip>
          )}
        </Flex>
        
        <Text 
          size="sm" 
          color={isErrorMessage ? 'dimmed' : 'inherit'}
          pl="xs"
        >
          {recommendation}
        </Text>
        
        {recommendation.includes('API key') && (
          <Text size="xs" color="red.6" mt={4} pl="xs">
            To enable AI recommendations, ask your administrator to add a valid OpenAI API key.
          </Text>
        )}
      </Stack>
    </Card>
  );
} 