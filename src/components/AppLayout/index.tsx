'use client';

import { Aside } from '@/components/Aside';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />
      <div className='md:pl-64 flex flex-col min-h-screen'>{children}</div>
    </div>
  );
}
