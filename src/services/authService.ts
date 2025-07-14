// src/services/authService.ts
import { api } from './api';

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const response = await api.post('/sessions', data); // cookies são salvos automaticamente
  return response.data;
}

export async function logout() {
  await api.post('/sessions/logout');
}

export async function refresh() {
  const response = await api.get('/sessions/refresh');
  return response.data;
}
