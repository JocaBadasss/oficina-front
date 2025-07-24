'use client';

import { Bell, MessageCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSocketBadge } from '@/contexts/SocketBadgeContext';

interface GlobalHeaderProps {
  userName?: string;
}

export function GlobalHeader({
  userName = 'Administrador',
}: GlobalHeaderProps) {
  const router = useRouter();

  const { signOut } = useAuth();
  const { hasUnread } = useSocketBadge();

  return (
    <header className='sticky top-0 z-40 border-b border-border py-1 sm:py-2 pl-0 md:pl-64 pr-4 sm:pr-6 flex items-center justify-between bg-app-background '>
      {/* Saudação (à esquerda) */}
      <div className='flex items-center gap-2 opacity-0'>
        <Avatar className='w-8 h-8'>
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <span className='text-sm hidden sm:block'> {userName}</span>
      </div>

      {/* Ícones + Logout (à direita) */}
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-hover'
        >
          <Bell className='w-5 h-5 text-muted-foreground' />
        </Button>

        <Button
          variant='ghost'
          size='icon'
          className='relative hover:bg-hover'
          onClick={() => router.push('/conversas')}
        >
          <MessageCircle className='w-5 h-5 text-muted-foreground' />
          {hasUnread && (
            <span className='absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full' />
          )}
        </Button>

        {/* Mobile */}
        <Button
          variant='outline'
          size='sm'
          onClick={signOut}
          className='text-muted-foreground hover:bg-hover border-border sm:hidden p-2'
        >
          <LogOut className='w-4 h-4' />
        </Button>

        {/* Desktop */}
        <Button
          variant='outline'
          size='sm'
          onClick={signOut}
          className='text-muted-foreground hover:bg-hover border-border hidden sm:flex'
        >
          <LogOut className='w-4 h-4 mr-2' />
          Logout
        </Button>
      </div>
    </header>
  );
}
