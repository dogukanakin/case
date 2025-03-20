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
  imageUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  // File fields will be sent as FormData
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  removeImage?: boolean;
  removeFile?: boolean;
  // File fields will be sent as FormData
} 