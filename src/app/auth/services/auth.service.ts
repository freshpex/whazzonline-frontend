import { apiPost } from '../../../lib/api';
import type { AuthResponse, AuthUser, CreateUserPayload, LoginPayload, SignupPayload } from '../types/auth';

type ApiResponse<T> = { success: boolean; data: T };

export async function signup(payload: SignupPayload) {
  const response = await apiPost<ApiResponse<AuthResponse>, SignupPayload>('/auth/signup', payload);
  return response.data;
}

export async function login(payload: LoginPayload) {
  const response = await apiPost<ApiResponse<AuthResponse>, LoginPayload>('/auth/login', payload);
  return response.data;
}

export async function createUser(payload: CreateUserPayload) {
  const response = await apiPost<ApiResponse<AuthUser>, CreateUserPayload>('/auth/users', payload);
  return response.data;
}
