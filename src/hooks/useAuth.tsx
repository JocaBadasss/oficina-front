'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  async function loadUser() {
    try {
      const response = await api.get<User>('/users/me');
      setUser(response.data);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const error = err as { response?: { status: number } };
        if (error.response?.status === 401) {
          try {
            await api.get('/sessions/refresh');
            const response = await api.get<User>('/users/me');
            setUser(response.data);
          } catch {
            toast({
              title: 'Sessão expirada',
              description: 'Faça login novamente para continuar.',
              variant: 'destructive',
            });
            router.push('/login');
          }
        }
      } else {
        console.error('Erro ao carregar usuário:', err);
      }
    }
  }

  function signOut() {
    api.post('/sessions/logout').finally(() => {
      setUser(null);
      router.push('/login');
    });
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
