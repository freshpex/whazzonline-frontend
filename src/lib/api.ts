import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('whazzonline-token');
    if (token) {
      if (config.headers && typeof (config.headers as { set?: (key: string, value: string) => void }).set === 'function') {
        (config.headers as { set: (key: string, value: string) => void }).set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = {
          ...(config.headers as AxiosRequestHeaders),
          Authorization: `Bearer ${token}`
        } as AxiosRequestHeaders;
      }
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { message?: string } | undefined)?.message;
      if (message) return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export async function apiGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const response = await apiClient.get<T>(path, { params });
  return response.data;
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
  const response = await apiClient.post<T>(path, body);
  return response.data;
}
