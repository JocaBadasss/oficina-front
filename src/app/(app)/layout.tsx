// app/(app)/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, hasFetchedUser } = useAuth();

  if (!hasFetchedUser || isLoading) {
    return <p>Carregando…</p>; // enquanto busca ou antes do primeiro fetch
  }

  return <div>{children}</div>;
}
