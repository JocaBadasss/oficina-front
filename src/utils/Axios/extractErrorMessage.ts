// src/utils/Axios/extractErrorMessage.ts
import { AxiosError } from 'axios';

type BackendError =
  | string
  | string[]
  | { message: string; code?: string; field?: string }
  | Array<{ message: string; code?: string; field?: string }>;

export function extractErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ message?: BackendError }>;
  const raw = err?.response?.data?.message;

  if (Array.isArray(raw)) {
    return raw
      .map((item) => (typeof item === 'string' ? item : item.message))
      .filter(Boolean)
      .join('\n');
  }

  if (typeof raw === 'object' && raw !== null && 'message' in raw) {
    return raw.message;
  }

  if (typeof raw === 'string') {
    return raw;
  }

  return 'Tente novamente.';
}
