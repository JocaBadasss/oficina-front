// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Tipagem para requisições que aguardam o refresh
interface PendingRequest {
  resolve: () => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const processQueue = (error: AxiosError | null): void => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  pendingRequests = [];
};

// src/services/api.ts
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // ◀️ SE FOR A CHAMADA DE REFRESH, rejeita de cara e não tenta nada
    if (originalRequest.url?.endsWith('/sessions/refresh')) {
      return Promise.reject(error)
    }

    // ◀️ fluxo normal de 401 pra outras rotas
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      if (isRefreshing) {
        return new Promise<void>((res, rej) => {
          pendingRequests.push({ resolve: res, reject: rej })
        }).then(() => api(originalRequest))
      }
      isRefreshing = true
      return new Promise<AxiosResponse>((resolve, reject) => {
        console.log('🌀 Tentando refresh de token…')
        api.get('/sessions/refresh')    // essa chamará o endpoint, mas bypassa o interceptor
          .then(() => {
            processQueue(null)
            api(originalRequest).then(resolve).catch(reject)
          })
          .catch((refreshError) => {
            processQueue(refreshError)
            console.log('[API] refresh falhou; redirecionando…')
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
            reject(refreshError)
          })
          .finally(() => {
            isRefreshing = false
          })
      })
    }

    return Promise.reject(error)
  }
)

