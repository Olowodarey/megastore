export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
