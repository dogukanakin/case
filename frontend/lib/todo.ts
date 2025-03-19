import { API_URL } from './config';
import { CreateTodoInput, Todo, UpdateTodoInput } from '@/types/todo';

// Get all todos for the logged-in user
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/todos`, {
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

    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create todo');
    }

    return await response.json();
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

    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update todo');
    }

    return await response.json();
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