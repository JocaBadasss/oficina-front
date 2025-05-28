// app/(app)/layout.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasFetchedUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // só redirect se já tentou buscar e não está carregando
    if (hasFetchedUser && !isLoading && !user) {
      router.replace('/login');
    }
  }, [hasFetchedUser, isLoading, user, router]);

  if (!hasFetchedUser || isLoading) {
    return <p>Carregando…</p>; // enquanto busca ou antes do primeiro fetch
  }

  return <div>{children}</div>;
}
