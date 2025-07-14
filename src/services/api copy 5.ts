// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const REFRESH_PATH = '/sessions/refresh';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 👈 ESSENCIAL pra cookies funcionarem
});

// Dev logs
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  api.interceptors.request.use((req) => {
    console.log(`[DEV API] → ${req.method?.toUpperCase()} ${req.url}`);
    return req;
  });

  api.interceptors.response.use(
    (res) => {
      console.log(`[API] ← ${res.status} ${res.config.url}`);
      return res;
    },
    (err) => {
      const failedUrl = (err.config as AxiosRequestConfig).url;
      console.log('[API] ERR', err.response?.status, failedUrl);
      return Promise.reject(err);
    }
  );
}

// 🔁 REFRESH AUTOMÁTICO
let isRefreshing = false;
let requestQueue: {
  resolve: () => void;
  reject: (error: AxiosError) => void;
}[] = [];

function processQueue(error: AxiosError | null) {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  requestQueue = [];
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const req = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (req.url === REFRESH_PATH && error.response?.status === 401) {
      // if (typeof window !== 'undefined') window.location.href = '/login';
      window.dispatchEvent(new Event('sessionExpired'));
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !req._retry) {
      req._retry = true;

      if (isRefreshing) {
        await new Promise<void>((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        });
        return api(req);
      }

      isRefreshing = true;
      try {
        console.log('🌀 Tentando refresh de token…');
        await api.get(REFRESH_PATH); // cookies automaticamente
        processQueue(null);
        return api(req);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        if (typeof window !== 'undefined') {
          console.log('[API] refresh falhou; redirecionando pro login');
          // window.location.href = '/login';
          window.dispatchEvent(new Event('sessionExpired'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
