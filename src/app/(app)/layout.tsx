// app/(app)/layout.tsx
'use client';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, hasFetchedUser } = useAuth();
  // const router = useRouter();

  // ❌ Comentamos esse trecho por enquanto, já que user está sempre null
  // useEffect(() => {
  //   if (hasFetchedUser && !isLoading && !user) {
  //     router.replace('/login');
  //   }
  // }, [hasFetchedUser, isLoading, user, router]);

  if (!hasFetchedUser || isLoading) {
    return <p>Carregando…</p>; // enquanto busca ou antes do primeiro fetch
  }

  return <div>{children}</div>;
}
