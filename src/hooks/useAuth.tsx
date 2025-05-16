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
import { logout } from '@/services/authService';
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

  async function loadUser(isMounted: boolean) {
    try {
      const response = await api.get<User>('/users/me');
      if (isMounted) setUser(response.data);
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
      if (isMounted) {
        toast({
          title: 'Sessão expirada',
          description: 'Faça login novamente para continuar.',
          variant: 'destructive',
        });
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    }
  }

  function signOut() {
    logout().finally(() => {
      setUser(null);
      router.push('/login');
      toast({
        title: 'Sessão encerrada',
        description: 'Você foi desconectado.',
        variant: 'destructive',
      });
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    });
  }

  useEffect(() => {
    let isMounted = true;

    loadUser(isMounted);

    return () => {
      isMounted = false;
    };
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
