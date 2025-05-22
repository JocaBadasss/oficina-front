import { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';

type BackendError =
  | string
  | string[]
  | { message: string; code?: string; field?: string }
  | Array<{ message: string; code?: string; field?: string }>;

export function handleAxiosError(
  error: unknown,
  fallbackTitle = 'Erro inesperado'
) {
  const err = error as AxiosError<{ message?: BackendError }>;

  const raw = err?.response?.data?.message;

  let parsedMessage: string;

  if (Array.isArray(raw)) {
    // array de strings ou objetos
    parsedMessage = raw
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object') return item.message;
        return '';
      })
      .filter(Boolean)
      .join('\n');
  } else if (typeof raw === 'object' && raw !== null && 'message' in raw) {
    // objeto único
    parsedMessage = raw.message;
  } else if (typeof raw === 'string') {
    parsedMessage = raw;
  } else {
    parsedMessage = 'Tente novamente.';
  }

  toast({
    title: fallbackTitle,
    description: parsedMessage,
    variant: 'destructive',
  });
}
