export type MessageMock = {
  id: string;
  sender: 'user' | 'system';
  content: string;
  timestamp: string;
};

export const messagesMock: MessageMock[] = [
  {
    id: '1',
    sender: 'user',
    content:
      'Oi! Acabei de ver a notificação. Está confirmado meu agendamento?',
    timestamp: '13:45',
  },
  {
    id: '2',
    sender: 'system',
    content:
      '📢 Este número é exclusivo para notificações automáticas.\nPara dúvidas, entre em contato no (85) 99999-0001 💬',
    timestamp: '13:46',
  },
  {
    id: '3',
    sender: 'user',
    content: 'Beleza, obrigado!',
    timestamp: '13:47',
  },
];
