'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSocketBadge } from '@/contexts/SocketBadgeContext';
import { usePathname } from 'next/navigation';

type MessagePayload = {
  contactId: string;
};

type ServerToClientEvents = {
  'message:received': (payload: MessagePayload) => void;
  connect: () => void;
  connect_error: (err: Error) => void;
};

type ClientToServerEvents = {
  // Defina aqui os eventos que o client pode emitir
  // Por exemplo:
  'message:send': (data: { to: string; content: string }) => void;
};

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Global reference to avoid multiple sockets
let socket: TypedSocket | null = null;

export function useSocket(
  onMessageReceived: (contactId: string) => void
): TypedSocket | null {
  const handlerRef = useRef(onMessageReceived);
  const [currentSocket, setCurrentSocket] = useState<TypedSocket | null>(null);
  const { setHasUnread } = useSocketBadge();
  const pathname = usePathname();

  useEffect(() => {
    handlerRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (pathname === '/login' || pathname === '/politica-de-privacidade') {
      return; // ❌ Não conecta o socket na página de login
    }

    if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
      console.error('❌ NEXT_PUBLIC_SOCKET_URL não definida.');
      return;
    }

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        autoConnect: true,
        transports: ['websocket'], // Mais estável em produção
        withCredentials: true,
      });

      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'development'
      ) {
        (window as typeof window & { socket?: TypedSocket }).socket = socket;
      }

      socket.on('connect', () => {
        console.log('✅ Socket conectado com ID', socket?.id);
      });

      socket.on('message:received', (payload: MessagePayload) => {
        console.log('📩 Nova mensagem recebida via socket:', payload);

        const isCurrentChat = pathname === `/conversas/${payload.contactId}`;

        if (!isCurrentChat) {
          setHasUnread(true);
          console.log('🔴 Badge ativado!');
        } else {
          console.log('💬 Mensagem é da conversa aberta, ignorando badge.');
        }

        handlerRef.current(payload.contactId);
      });

      socket.on('connect_error', (err) => {
        console.error('❌ Erro na conexão do socket:', err.message);
      });

      setCurrentSocket(socket);
    }

    return () => {
      socket?.disconnect();
      socket = null;
      setCurrentSocket(null);
    };
  }, [pathname, setHasUnread]);

  return currentSocket;
}
