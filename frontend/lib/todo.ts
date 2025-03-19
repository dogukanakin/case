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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch todos');
    }

    return await response.json();
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching todo:', error);
    throw error;
  }
};

// Create a new todo
export const createTodo = async (todoData: CreateTodoInput): Promise<Todo> => {
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

    console.log('Creating todo with data:', formattedData);

    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();
    console.log('Create todo response:', responseData);

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

// Update a todo
export const updateTodo = async (id: string, todoData: UpdateTodoInput): Promise<Todo> => {
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

    console.log('Updating todo:', id, 'with data:', formattedData);

    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (response.status === 401) {
      // Handle token expiration - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication token expired or invalid');
    }

    const responseData = await response.json();
    console.log('Update todo response:', responseData);

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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete todo');
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}; 