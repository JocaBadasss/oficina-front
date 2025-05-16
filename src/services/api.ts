// src/services/api.ts
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333', // ajuste pra URL real se for o caso
  withCredentials: true, // essencial pra enviar cookies
});

// Interceptor para tentar refresh automático no 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.get('/sessions/refresh');
        return api(originalRequest); // repete request original com novo token
      } catch (error) {
        console.error('Erro ao atualizar token:', error);
        toast({
          title: 'Sessão expirada',
          description: 'Faça login novamente.',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }

      return Promise.reject(error);
    }
  }
);
