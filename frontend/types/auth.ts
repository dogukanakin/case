export interface User {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface PasswordChangeCredentials {
  currentPassword: string;
  newPassword: string;
} 