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

    // 1) Se estivermos em /login, não tentamos buscar user
    //18/06 mexi nisso chat acesso publico e subdomnio
    // if (pathname === '/login') {
    //   setIsLoading(false); // marcamos que já “carregamos” (mesmo sem buscar)
    //   setHasFetchedUser(true); // sinalizamos que o fetch já foi tentado
    //   return; // saímos do efeito
    // }

    const PUBLIC_PATHS = ['/login', '/acompanhamento'];

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
      .get<User>('/users/me')
      .then((res) => {
        if (isMounted) setUser(res.data); // se completou, armazenamos o user
      })
      .catch(() => {
        if (isMounted) {
          setUser(null); // se falhou, limpamos o user
          signOut(); // e executamos o logout (redirect + toast)
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

  // useEffect(() => {
  //   setIsLoading(false);
  //   setHasFetchedUser(true);
  // }, []);

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
