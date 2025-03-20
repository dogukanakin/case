export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface TodoFilterParams {
  status?: 'active' | 'completed' | 'all';
  priority?: Priority | null;
  page?: number;
  limit?: number;
  search?: string;
}

export interface TodosResponse {
  todos: Todo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  counts: {
    all: number;
    active: number;
    completed: number;
  };
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

// Hook interfaces
export interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  activeTab: string;
  selectedPriority: Priority | null;
  currentPage: number;
  totalPages: number;
  totalTodos: number;
  totalAll: number;
  totalActive: number;
  totalCompleted: number;
  searchQuery: string;
  
  fetchTodos: () => Promise<void>;
  handleAddTodo: (newTodo: Todo) => Promise<void>;
  handleUpdateTodo: (updatedTodo: Todo) => Promise<void>;
  handleDeleteTodo: (id: string) => Promise<void>;
  handleTabChange: (value: string | null) => void;
  handlePageChange: (newPage: number) => void;
  handlePriorityChange: (priority: Priority | null) => void;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearSearch: () => void;
  clearPriority: () => void;
}

export interface UseTodoEditFormReturn {
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  removeImage: boolean;
  removeFile: boolean;
  newImageFile: File | null;
  newAttachmentFile: File | null;
  isLoading: boolean;
  
  priorityOptions: { value: Priority; label: string }[];
  
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setPriority: (value: Priority) => void;
  setTags: (value: string[]) => void;
  setRemoveImage: (value: boolean) => void;
  setRemoveFile: (value: boolean) => void;
  setNewImageFile: (file: File | null) => void;
  setNewAttachmentFile: (file: File | null) => void;
  
  handleSubmit: () => Promise<void>;
}

export interface UseTodoItemReturn {
  isEditing: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  
  setIsEditing: (value: boolean) => void;
  
  handleToggleComplete: () => Promise<void>;
  handleSaveEdit: (
    updateData: UpdateTodoInput, 
    newImageFile?: File | null, 
    newAttachmentFile?: File | null
  ) => Promise<void>;
  handleDelete: () => Promise<void>;
  
  getPriorityColor: (priority: string) => string;
}

// Component interfaces
export interface TodoFiltersProps {
  activeTab: string;
  selectedPriority: Priority | null;
  totalAll: number;
  totalActive: number;
  totalCompleted: number;
  onTabChange: (value: string | null) => void;
  onPriorityChange: (priority: Priority | null) => void;
}

export interface TodoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export interface TodoHeaderProps {
  username: string;
  onLogout: () => void;
}

export interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  activeTab: string;
  selectedPriority: Priority | null;
  totalTodos: number;
  searchQuery: string;
  onUpdateTodo: (updatedTodo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onClearPriority: () => void;
}

export interface TodoSearchProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
} 