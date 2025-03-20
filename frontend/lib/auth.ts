import api from './api';
import { LoginCredentials, RegisterCredentials, User, PasswordChangeCredentials } from '@/types/auth';

// Cookie helpers - HTTP Only olmayan bir cookie ayarlama (middleware erişebilmeli)
const setCookie = (name: string, value: string, days: number) => {
  if (typeof window === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  
  // SameSite=Lax ile yönlendirme sırasında cookie korunur
  document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
};

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, ...user } = response.data;
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      
      // Set the token in cookie for middleware to access
      setCookie('token', token, 7);
      
      // Store user data for quick access
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    // Prepare error message
    let message = 'Login failed. Please try again later.';
    
    // Message based on API error conditions
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        message = 'Email or password is incorrect. Please check your credentials.';
      } else if (status === 404) {
        message = 'User not found. Please check your email address.';
      } else if (status === 429) {
        message = 'Too many failed login attempts. Please try again later.';
      }
    }
    
    // Create a single error object for all errors
    const customError = new Error(message);
    // Override error class
    customError.name = 'AuthError';
    throw customError;
  }
};

// Register user
export const registerUser = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const response = await api.post('/auth/register', credentials);
    const { token, ...user } = response.data;
    
    // Store token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      
      // Set the token in cookie for middleware to access
      setCookie('token', token, 7);
      
      // Store user data for quick access
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error: any) {
    // Prepare error message
    let message = 'Registration failed. Please try again later.';
    
    // Message based on API error conditions
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        if (data && data.error) {
          message = data.error;
        } else {
          message = 'Invalid registration information. Please check your details.';
        }
      } else if (status === 409) {
        message = 'This email address is already in use. Please try a different email.';
      }
    }
    
    // Create a single error object for all errors
    const customError = new Error(message);
    // Override error class
    customError.name = 'AuthError';
    throw customError;
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove the cookie too
    setCookie('token', '', -1);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
};

// Change user password
export const changePassword = async (credentials: PasswordChangeCredentials): Promise<{ message: string; user: User }> => {
  try {
    const response = await api.put('/auth/change-password', credentials);
    return response.data;
  } catch (error: any) {
    // Prepare error message
    let message = 'Password change failed. Please try again later.';
    
    // Message based on API error conditions
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        if (data && data.error === 'Current password is incorrect') {
          message = 'Your current password is incorrect. Please try again.';
        } else {
          message = 'Your session has expired. Please login again.';
        }
      } else if (status === 400) {
        if (data && data.error) {
          message = data.error;
        } else {
          message = 'Invalid password information. Your password must be at least 6 characters.';
        }
      }
    }
    
    // Create a single error object for all errors
    const customError = new Error(message);
    // Override error class
    customError.name = 'AuthError';
    throw customError;
  }
}; 