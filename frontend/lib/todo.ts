import { API_URL } from './config';
import { CreateTodoInput, Todo, UpdateTodoInput, Priority } from '@/types/todo';

interface TodoFilterParams {
  status?: 'active' | 'completed' | 'all';
  priority?: Priority | null;
  page?: number;
  limit?: number;
  search?: string;
}

interface TodosResponse {
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

// Get all todos for the logged-in user with filters and pagination
export const getTodos = async ({ status, priority, page = 1, limit = 3, search }: TodoFilterParams = {}): Promise<TodosResponse> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // URL query parametrelerini oluştur
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    if (priority) {
      params.append('priority', priority);
    }
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    // Sayfalama parametrelerini ekle
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const response = await fetch(`${API_URL}/todos${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching todos:', responseData);
      throw new Error(responseData.message || responseData.error || 'Failed to fetch todos');
    }

    return responseData;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Get a single todo by ID
export const getTodoById = async (id: string): Promise<Todo> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error fetching todo:', responseData);
      throw new Error(responseData.message || responseData.error || 'Failed to fetch todo');
    }

    return responseData;
  } catch (error) {
    console.error('Error fetching todo:', error);
    throw error;
  }
};

// Create a new todo with file uploads
export const createTodo = async (
  todoData: CreateTodoInput,
  imageFile?: File | null,
  attachmentFile?: File | null
): Promise<Todo> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Make sure the priority value is lowercase if it exists
    const formattedData = { ...todoData };
    if (formattedData.priority) {
      formattedData.priority = formattedData.priority.toLowerCase() as Priority;
    }

    // Use FormData to handle file uploads
    const formData = new FormData();
    
    // Add todo data as JSON
    formData.append('title', formattedData.title);
    if (formattedData.description) formData.append('description', formattedData.description);
    if (formattedData.priority) formData.append('priority', formattedData.priority);
    
    // Add tags as array
    if (formattedData.tags && formattedData.tags.length > 0) {
      formattedData.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }
    
    // Add files if available
    if (imageFile) formData.append('image', imageFile);
    if (attachmentFile) formData.append('file', attachmentFile);


    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header, it will be set automatically with boundary by the browser
      },
      body: formData,
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error creating todo:', responseData);
      throw new Error(responseData.message || responseData.error || 'Failed to create todo');
    }

    return responseData;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// Update a todo with file uploads
export const updateTodo = async (
  id: string, 
  todoData: UpdateTodoInput,
  imageFile?: File | null,
  attachmentFile?: File | null
): Promise<Todo> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Make sure the priority value is lowercase if it exists
    const formattedData = { ...todoData };
    if (formattedData.priority) {
      formattedData.priority = formattedData.priority.toLowerCase() as Priority;
    }

    // Use FormData to handle file uploads
    const formData = new FormData();
    
    // Add todo data
    if (formattedData.title !== undefined) formData.append('title', formattedData.title);
    if (formattedData.description !== undefined) formData.append('description', formattedData.description);
    if (formattedData.completed !== undefined) formData.append('completed', String(formattedData.completed));
    if (formattedData.priority !== undefined) formData.append('priority', formattedData.priority);
    
    // Add tags as array
    if (formattedData.tags && formattedData.tags.length > 0) {
      formattedData.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    } else if (formattedData.tags !== undefined) {
      // Send empty array if tags is explicitly set to empty
      formData.append('tags', '');
    }
    
    // Add file removal flags
    if (formattedData.removeImage) formData.append('removeImage', 'true');
    if (formattedData.removeFile) formData.append('removeFile', 'true');
    
    // Add files if available
    if (imageFile) formData.append('image', imageFile);
    if (attachmentFile) formData.append('file', attachmentFile);


    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header, it will be set automatically with boundary by the browser
      },
      body: formData,
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error updating todo:', responseData);
      throw new Error(responseData.message || responseData.error || 'Failed to update todo');
    }

    return responseData;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error deleting todo:', responseData);
      throw new Error(responseData.message || responseData.error || 'Failed to delete todo');
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}; 