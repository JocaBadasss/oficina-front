'use client';

import { Aside } from '@/components/Aside';
import { GlobalHeader } from '@/components/GlobalHeader';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='min-h-screen bg-app-background text-foreground font-poppins'>
      <Aside />

      <div className='md:pl-64 flex flex-col min-h-screen'>
        <GlobalHeader userName='Administrador' />

        <main className='flex-1 flex flex-col'>{children}</main>
      </div>
    </div>
  );
}
