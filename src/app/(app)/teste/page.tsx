'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function TestSocketComponent() {
  useEffect(() => {
    const socket = io('http://localhost:3333');

    socket.on('connect', () => {
      console.log('✅ TESTE: Conectado com ID', socket.id);
    });

    socket.on('message:received', (data) => {
      console.log('🎯 TESTE: Evento recebido', data);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ TESTE: Erro ao conectar:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <p>Componente de teste de socket conectado</p>;
}
