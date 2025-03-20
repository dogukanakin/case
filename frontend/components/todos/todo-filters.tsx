'use client';

import { Tabs, Badge, ActionIcon, Text, Group } from '@mantine/core';
import { IconList, IconClock, IconCheck } from '@tabler/icons-react';
import { Priority, TodoFiltersProps } from '@/types/todo';

export default function TodoFilters({
  activeTab,
  selectedPriority,
  totalAll,
  totalActive,
  totalCompleted,
  onTabChange,
  onPriorityChange
}: TodoFiltersProps) {
  return (
    <Group justify="space-between" mb="md">
      <Tabs value={activeTab} onChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab 
            value="all" 
            leftSection={<IconList size={14} />}
            rightSection={
              <Badge 
                size="xs" 
                variant="filled" 
                radius="sm"
                className="ml-1"
              >
                {totalAll}
              </Badge>
            }
          >
            All
          </Tabs.Tab>
          <Tabs.Tab 
            value="active" 
            leftSection={<IconClock size={14} />}
            rightSection={
              <Badge 
                size="xs" 
                variant="filled" 
                radius="sm"
                className="ml-1"
              >
                {totalActive}
              </Badge>
            }
          >
            Active
          </Tabs.Tab>
          <Tabs.Tab 
            value="completed" 
            leftSection={<IconCheck size={14} />}
            rightSection={
              <Badge 
                size="xs" 
                variant="filled" 
                radius="sm"
                className="ml-1"
              >
                {totalCompleted}
              </Badge>
            }
          >
            Completed
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      
      <Group>
        <Text size="sm" color="dimmed">Filter:</Text>
        <Group gap={4}>
          <ActionIcon 
            size="md" 
            color={selectedPriority === Priority.LOW ? "teal" : "gray"} 
            variant={selectedPriority === Priority.LOW ? "filled" : "subtle"}
            onClick={() => onPriorityChange(selectedPriority === Priority.LOW ? null : Priority.LOW)}
            radius="xl"
            title="Low Priority"
          >
            L
          </ActionIcon>
          <ActionIcon 
            size="md" 
            color={selectedPriority === Priority.MEDIUM ? "blue" : "gray"} 
            variant={selectedPriority === Priority.MEDIUM ? "filled" : "subtle"}
            onClick={() => onPriorityChange(selectedPriority === Priority.MEDIUM ? null : Priority.MEDIUM)}
            radius="xl"
            title="Medium Priority"
          >
            M
          </ActionIcon>
          <ActionIcon 
            size="md" 
            color={selectedPriority === Priority.HIGH ? "red" : "gray"} 
            variant={selectedPriority === Priority.HIGH ? "filled" : "subtle"}
            onClick={() => onPriorityChange(selectedPriority === Priority.HIGH ? null : Priority.HIGH)}
            radius="xl"
            title="High Priority"
          >
            H
          </ActionIcon>
        </Group>
      </Group>
    </Group>
  );
} 