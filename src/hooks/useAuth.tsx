// src/hooks/useAuth.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
// import { api } from '@/services/api';
import { logout } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasFetchedUser: boolean; // <— novo
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchedUser, setHasFetchedUser] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  const { toast } = useToast();

  const signOut = useCallback(async () => {
    console.log('[AuthProvider] → SIGNOUT CHAMADO');
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      toast({ title: 'Sessão encerrada', variant: 'destructive' });
      router.replace('/login');
    } finally {
      setIsLoading(false);
      setHasFetchedUser(false);
    }
  }, [router, toast]);

  useEffect(() => {
    const onExpire = () => {
      console.log(
        '[AuthProvider] sessionExpired event RECEBIDO → chamando signOut'
      );
      signOut();
    };
    window.addEventListener('sessionExpired', onExpire);
    return () => window.removeEventListener('sessionExpired', onExpire);
  }, [signOut]);

  //DESCOMENTA
  useEffect(() => {
    let isMounted = true;

    const PUBLIC_PATHS = [
      '/login',
      '/acompanhamento',
      '/politica-de-privacidade',
    ];

    if (PUBLIC_PATHS.some((publicPath) => pathname.startsWith(publicPath))) {
      setIsLoading(false);
      setHasFetchedUser(true);
      return;
    }

    // 2) Para todas as outras rotas, resetamos nosso estado
    setHasFetchedUser(false); // indica que ainda NÃO tentamos buscar
    setIsLoading(true); // entramos no modo “carregando”

    // 3) Fazemos a chamada real à API
    api
      .get<User>('/users/me', { withRefresh: true })
      .then((res) => {
        if (isMounted) setUser(res.data); // se completou, armazenamos o user
      })
      .catch((error) => {
        if (!isMounted) return;

        const shouldSignOut =
          error?.response?.status === 401 && !error?.config?.withRefresh;

        if (shouldSignOut) {
          setUser(null);
          signOut();
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false); // encerramos o “loading”
        setHasFetchedUser(true); // sinalizamos que já tentamos o fetch
      });

    // 4) Cleanup para evitar setState após componente desmontar
    return () => {
      isMounted = false;
    };
  }, [pathname, signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        hasFetchedUser,
        isAuthenticated: !!user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
