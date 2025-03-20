'use client';

import { Card, Group, ThemeIcon, Text, Tooltip, ActionIcon } from '@mantine/core';
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
    <Card withBorder p="xs" radius="md" className="mt-3 bg-blue-50">
      <Group gap={5} mb={5}>
        <ThemeIcon color="blue" size="sm" variant="light" radius="xl">
          <IconBulb size={14} />
        </ThemeIcon>
        <Text size="xs" fw={500} color="blue">AI Recommendation</Text>
        
        {isEditMode ? (
          <Text size="xs" color="dimmed">(will be updated when you save changes)</Text>
        ) : (
          <Tooltip label="AI-generated recommendation based on your task details">
            <ActionIcon size="xs" variant="transparent" color="gray">
              <IconInfoCircle size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      
      <Text 
        size="sm" 
        color={isErrorMessage ? 'dimmed' : 'inherit'} 
        className="ml-6"
      >
        {recommendation}
      </Text>
      
      {recommendation.includes('API key') && (
        <Text size="xs" color="red" mt={4} className="ml-6">
          To enable AI recommendations, ask your administrator to add a valid OpenAI API key.
        </Text>
      )}
    </Card>
  );
} 