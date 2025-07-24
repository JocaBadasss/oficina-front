'use client';

import { useEffect, useRef, useState } from 'react';
import { useSocketBadge } from '@/contexts/SocketBadgeContext';

import { useParams } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { SendHorizonal } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';
import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id: string;
  body: string;
  timestamp: string; // ou Date se você já estiver convertendo
  direction: 'INBOUND' | 'OUTBOUND';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'UNKNOWN';
}

export default function ConversationDetails() {
  const params = useParams();
  console.log(params.id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contact, setContact] = useState<{ name: string; waId: string } | null>(
    null
  );
  const endRef = useRef<HTMLDivElement | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(
    null
  );
  const { setHasUnread } = useSocketBadge();

  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: 'auto' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleRetry(msg: Message) {
    setRetryingMessageId(msg.id);

    try {
      await api.post('/webhook/whatsapp/send', {
        phone: contact?.waId,
        message: msg.body,
        messageId: msg.id, // já tipado
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? { ...m, status: 'SENT', timestamp: new Date().toISOString() }
            : m
        )
      );

      toast({ title: 'Mensagem reenviada', variant: 'success' });
    } catch (error) {
      handleAxiosError(error, 'Erro ao reenviar mensagem');
    } finally {
      setRetryingMessageId(null);
    }
  }

  useEffect(() => {
    async function loadConversation() {
      const { data } = await api.get(`/conversations/${params.id}`);
      setMessages(data.messages);
      setContact(data.contact);
      setHasUnread(false); // limpa badge visual

      await api.patch(`/conversations/${params.id}/read`); // backend também marca como lido
    }

    loadConversation();
  }, [params.id, setHasUnread]);

  useSocket((incomingContactId) => {
    if (incomingContactId === params.id) {
      api
        .get(`/conversations/${params.id}`)
        .then(({ data }) => {
          setMessages(data.messages);
        })
        .catch((err) => {
          console.error('Erro ao buscar mensagens:', err);
        });
    }
  });

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed.length > 1024) {
      toast({
        title: 'Mensagem não enviada',
        description: 'Mensagem muito longa. Máximo de 1024 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSending(true);
      await api.post('/webhook/whatsapp/send', {
        phone: contact?.waId,
        message: trimmed,
      });

      const now = new Date();

      const newMessage = {
        id: String(messages.length + 1),
        body: trimmed,
        timestamp: now.toISOString(),
        direction: 'OUTBOUND',
        status: 'SENT',
      } as const;

      setMessages((prev) => [...prev, newMessage]);
      setInput('');

      toast({
        title: 'Mensagem enviada',
        description: 'Mensagem enviada com sucesso',
        variant: 'success',
      });
    } catch (error) {
      handleAxiosError(error, 'Erro ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  }

  if (!contact) return null;

  return (
    <AppLayout>
      <main className='flex-1 p-4 sm:p-6 space-y-6'>
        <PageHeader
          title={`Conversa com ${contact.name}`}
          subtitle='Histórico de mensagens recebidas'
          backHref='/conversas'
        />

        <section className='bg-background border border-border rounded-2xl p-4 h-[600px] flex flex-col justify-between overflow-hidden'>
          <div className='overflow-y-auto pr-2 space-y-4 flex-1'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`w-fit max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-2 text-sm shadow-sm ${
                  msg.direction === 'INBOUND'
                    ? 'bg-muted text-foreground self-start'
                    : 'bg-accent text-accent-foreground self-end ml-auto'
                }`}
              >
                <div className='flex flex-col items-end gap-1'>
                  <p>{msg.body}</p>

                  <div className='flex items-center gap-1 text-xs text-subtle-foreground'>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {msg.status === 'FAILED' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleRetry(msg)}
                            disabled={retryingMessageId === msg.id}
                            className='text-destructive hover:text-destructive/80 disabled:opacity-60'
                          >
                            {retryingMessageId === msg.id ? (
                              <div className='h-4 w-4 animate-spin rounded-full border border-muted-foreground border-t-transparent' />
                            ) : (
                              <AlertCircle size={16} />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className='text-sm'>
                            <p className='font-medium'>Falha ao enviar</p>
                            <p className='underline underline-offset-2'>
                              Clique para tentar novamente
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div ref={endRef} />
              </div>
            ))}
          </div>

          <div className='border-t border-border mt-4 pt-4 flex gap-2 items-end'>
            <textarea
              rows={1}
              className='flex-1 resize-none overflow-hidden bg-input text-foreground border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-border'
              placeholder='Escreva uma resposta automática...'
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />

            <button
              onClick={handleSend}
              disabled={isSending}
              className='bg-tertiary text-muted-foreground text-sm sm:text-base px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[hsl(var(--button-hover))] transition disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isSending ? (
                <>
                  <div className='h-4 w-4 animate-spin rounded-full border border-muted-foreground border-t-transparent' />
                  Enviando...
                </>
              ) : (
                <>
                  <SendHorizonal size={16} />
                  Enviar (R$ 0,03)
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
