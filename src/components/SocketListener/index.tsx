// src/components/SocketListener.tsx
'use client';

import { useSocket } from '@/hooks/useSocket';
import { usePathname } from 'next/navigation';
import { useSocketBadge } from '@/contexts/SocketBadgeContext';

export function SocketListener() {
  const pathname = usePathname();
  const { setHasUnread } = useSocketBadge();

  useSocket((contactId) => {
    const id = pathname.split('/').pop();
    const isCurrentChat = pathname.startsWith('/conversas') && id === contactId;

    if (!isCurrentChat) {
      setHasUnread(true);
    }
  });

  return null;
}
