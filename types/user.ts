export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  data: User;
}

export interface MeResponse {
  message: string;
  data: User;
}
