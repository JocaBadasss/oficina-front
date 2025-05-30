// src/services/authService.ts
import { api } from './api';

interface LoginData {
  email: string;
  password: string;
}

//ORIGINAL COMEÇA AQUI

// export async function login(data: LoginData) {
//   const response = await api.post('/sessions', data);

//   return response.data;
// }

// export async function logout() {
//   await api.post('/sessions/logout');
// }

// export async function refresh() {
//   const response = await api.get('/sessions/refresh');
//   return response.data;
// }

//ORIGINAL TERMINA AQUI


export async function login(data: LoginData) {
  const response = await api.post('/sessions', data);

  // ✅ Salvar tokens manualmente
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);

  return response.data.user;
}

export async function logout() {
  // ✅ Limpar localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export async function refresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await api.post('/sessions/refresh', { refreshToken });

  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  return accessToken;
}

