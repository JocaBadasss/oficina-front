'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  isLoggingOut: boolean;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  function signOut() {
    setIsLoggingOut(true);
    logout().finally(() => {
      setUser(null);
      toast({
        title: 'Sessão encerrada',
        description: 'Você foi desconectado.',
        variant: 'destructive',
      });
      router.push('/login');
    });
  }

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (isLoggingOut || user) return;
      if (pathname === '/login') return;

      try {
        const response = await api.get<User>('/users/me');
        if (isMounted) {
          setUser(response.data);
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          toast({
            title: 'Sessão expirada',
            description: 'Faça login novamente.',
            variant: 'destructive',
          });
          signOut();
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [isLoggingOut, user, router, pathname, signOut, toast]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut,
        isLoggingOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
