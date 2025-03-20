// Base API response
export interface IApiResponse {
  message?: string;
  error?: string;
}

// Success response with data
export interface ISuccessResponse<T> extends IApiResponse {
  data: T;
}

// Error response
export interface IErrorResponse extends IApiResponse {
  error: string;
  statusCode?: number;
}

// JWT token response
export interface ITokenResponse {
  token: string;
} 