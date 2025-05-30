// src/services/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/** Path do endpoint de refresh, relativo ao baseURL */
const REFRESH_PATH = '/sessions/refresh';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

/** Fila para requisições que chegam enquanto o token está sendo renovado */
interface PendingRequest {
  resolve: () => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let requestQueue: PendingRequest[] = [];

/** Processa a fila após um refresh (com ou sem erro) */
function processQueue(error: AxiosError | null) {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  requestQueue = [];
}

/** Logs de requisição/response apenas em desenvolvimento */
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

/** Interceptor principal: tenta refresh em caso de 401 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const req = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 1) Se o 401 veio do próprio endpoint de refresh, faça logout
    if (req.url === REFRESH_PATH && error.response?.status === 401) {
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(error);
    }

    // 2) Se for 401 em outra rota e ainda não tentamos (_retry = false)
    if (error.response?.status === 401 && !req._retry) {
      req._retry = true;

      // 2a) Se já estamos no meio de um refresh, aguarde na fila
      if (isRefreshing) {
        await new Promise<void>((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        });
        return api(req);
      }

      // 2b) Primeira requisição de refresh nesta sessão
      isRefreshing = true;
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.log('🌀 Tentando refresh de token…');
        }
        await api.get(REFRESH_PATH);
        processQueue(null);
        return api(req);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        if (process.env.NODE_ENV !== 'production') {
          console.log('[API] refresh falhou; redirecting to /login');
        }
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 3) Qualquer outro caso, rejeite normalmente
    return Promise.reject(error);
  }
);
