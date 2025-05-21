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
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);

  const pathname = usePathname();

  const router = useRouter();
  const { toast } = useToast();

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

    async function loadUser() {
      if (isLoggingOut || hasFetchedUser) return;
      if (pathname === '/login') return; // 👈 Ponto crucial

      try {
        const response = await api.get<User>('/users/me');
        if (isMounted) {
          setUser(response.data);
          setHasFetchedUser(true);
        }
      } catch (err) {
        console.log(err);
        if (isMounted) {
          setIsLoggingOut(true);
          setTimeout(() => router.push('/login'), 1000);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [isLoggingOut, hasFetchedUser, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
