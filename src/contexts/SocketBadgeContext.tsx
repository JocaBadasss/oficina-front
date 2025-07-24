// src/contexts/SocketBadgeContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/services/api';
import { usePathname } from 'next/navigation';

type SocketBadgeContextType = {
  hasUnread: boolean;
  setHasUnread: (value: boolean) => void;
};

const SocketBadgeContext = createContext<SocketBadgeContextType>({
  hasUnread: false,
  setHasUnread: () => {},
});

export function SocketBadgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasUnread, setHasUnread] = useState(false);
  const pathname = usePathname();

  // 🚀 1. Roda quando o app abre
  useEffect(() => {
    if (!pathname.startsWith('/conversas')) {
      api
        .get('/conversations')
        .then((res) => {
          const hasUnread = res.data.some(
            (conv: { hasUnread: boolean }) => conv.hasUnread
          );
          if (hasUnread) {
            setHasUnread(true);
          }
        })
        .catch(() => {
          // opcional: tratar erro
        });
    }
  }, [pathname]);

  // 🚀 2. Continua escutando WebSocket normalmente
  useSocket((contactId) => {
    const pathname = window.location.pathname;
    const id = pathname.split('/').pop();
    const isCurrentChat = pathname.startsWith('/conversas') && id === contactId;

    if (!isCurrentChat) {
      setHasUnread(true);
    }
  });

  return (
    <SocketBadgeContext.Provider value={{ hasUnread, setHasUnread }}>
      {children}
    </SocketBadgeContext.Provider>
  );
}

export function useSocketBadge() {
  return useContext(SocketBadgeContext);
}
