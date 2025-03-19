export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  tags: string[];
  recommendation: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
} 