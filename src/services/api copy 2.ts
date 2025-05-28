// src/services/api.ts
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ajuste pra URL real se for o caso
  withCredentials: true, // essencial pra enviar cookies
});

let isRefreshing = false;
// Interceptor para tentar refresh automático no 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;

      try {
        await api.get('/sessions/refresh');
        isRefreshing = false;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        toast({ title: 'Sessão expirada', variant: 'destructive' });
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
