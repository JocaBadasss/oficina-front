'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Users2 } from 'lucide-react';
import { api } from '@/services/api';
import { CardSkeleton } from '@/components/Skeletons';

type Conversation = {
  contactId: string;
  name: string;
  waId: string;
  hasUnread: boolean;
  lastMessage: {
    body: string;
    timestamp: string;
    direction: string;
    status: string;
    type: string;
  } | null;
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/conversations')
      .then(({ data }) => setConversations(data))
      .finally(() => setLoading(false));
  }, []);

  console.log(conversations);

  return (
    <AppLayout>
      <main className='flex-1 p-4 sm:p-6 space-y-6'>
        <PageHeader
          title='Conversas'
          subtitle='Visualize o histórico de mensagens com seus clientes.'
          backHref='/painel'
        />

        <section className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : conversations.map((conv) => (
                <Link
                  key={conv.contactId}
                  href={`/conversas/${conv.contactId}`}
                  className='rounded-2xl border border-border p-4 bg-background hover:bg-hover transition-colors space-y-2 shadow-sm'
                >
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <Users2
                        size={18}
                        className='text-muted-foreground'
                      />

                      <span className='font-semibold text-foreground text-sm sm:text-base'>
                        {conv.name}
                      </span>

                      {conv.hasUnread && (
                        <div className='w-2.5 h-2.5 rounded-full bg-destructive animate-pulse' />
                      )}
                    </div>
                    <span className='text-xs text-subtle-foreground'>
                      {new Date(
                        conv.lastMessage?.timestamp ?? ''
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className={`text-sm line-clamp-2 ${
                      conv.hasUnread
                        ? 'text-foreground font-semibold'
                        : 'text-subtle-foreground'
                    }`}
                  >
                    {conv.lastMessage?.body ?? 'Nenhuma mensagem ainda.'}
                  </div>
                </Link>
              ))}
        </section>
      </main>
    </AppLayout>
  );
}
