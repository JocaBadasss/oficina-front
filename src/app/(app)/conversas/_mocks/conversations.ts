export type ConversationMock = {
  id: string;
  name: string;
  lastMessage: string;
  lastTimestamp: string;
};

export const conversationsMock: ConversationMock[] = [
  {
    id: '1',
    name: 'João da Silva',
    lastMessage: 'Olá, recebi a notificação do agendamento e quero confirmar.',
    lastTimestamp: '13:45',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    lastMessage: 'Vocês abrem no sábado? Queria levar meu carro.',
    lastTimestamp: '11:02',
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    lastMessage: 'Tudo certo com o orçamento que enviaram?',
    lastTimestamp: 'Ontem',
  },
  {
    id: '4',
    name: 'Fernanda Costa',
    lastMessage: 'Recebi as fotos, obrigada pelo serviço!',
    lastTimestamp: 'Segunda',
  },
];
