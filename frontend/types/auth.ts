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

// Hook interfaces
export interface UseProfileReturn {
  loading: boolean;
  userData: UserData | null;
  checkAuth: () => Promise<boolean>;
}

export interface UserData {
  username?: string;
  email?: string;
}

export interface UseAuthReturn {
  username: string;
  loading: boolean;
  error: string | null;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export interface UsePasswordChangeReturn {
  error: string | null;
  success: string | null;
  isSubmitting: boolean;
  register: any; // ReturnType<typeof useForm<PasswordChangeCredentials & { newPasswordConfirm: string }>>['register'];
  handleSubmit: any; // ReturnType<typeof useForm<PasswordChangeCredentials & { newPasswordConfirm: string }>>['handleSubmit'];
  errors: any; // ReturnType<typeof useForm<PasswordChangeCredentials & { newPasswordConfirm: string }>>['formState']['errors'];
  watch: any; // ReturnType<typeof useForm<PasswordChangeCredentials & { newPasswordConfirm: string }>>['watch'];
  onSubmit: (data: PasswordChangeCredentials & { newPasswordConfirm: string }) => Promise<void>;
  resetForm: () => void;
}

// Auth context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  changeUserPassword: (credentials: PasswordChangeCredentials) => Promise<{ message: string; user: User }>;
  isAuth: boolean;
}

// Component interfaces
export interface PasswordChangeFormProps {
  onUserDataUpdate: (userData: any) => void;
}

export interface AccountInfoProps {
  username?: string;
  email?: string;
}

export interface ProfileHeaderProps {
  username: string;
  onLogout: () => void;
} 