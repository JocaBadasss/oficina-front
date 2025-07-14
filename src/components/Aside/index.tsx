'use client';

import {
  Home,
  UserPlus,
  Users,
  Truck,
  Wrench,
  CalendarClock,
  MoreHorizontal,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ThemeTogglePopover } from '../ui/ThemeTogglePopover';
import { useThemeHintPopover } from '@/hooks/useThemeHintPopover';

const navItems = [
  { href: '/painel', icon: Home, label: 'Painel' },

  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/veiculos', icon: Truck, label: 'Veículos' },
  { href: '/ordens', icon: Wrench, label: 'Ordens' },
  { href: '/agendamentos', icon: CalendarClock, label: 'Agendamentos' },
  {
    href: '/novo-atendimento',
    icon: UserPlus,
    label: 'Novo Atendimento',
    isNewOrder: true,
  },
];

export function Aside() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const { showPopover, dismissPopover, isMobile } = useThemeHintPopover({
    dropdownOpen: open,
  });

  const isLight = theme === 'light';

  return (
    <>
      {/* Desktop Aside */}
      <aside className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-muted p-6 space-y-6 pb-12 z-50 border borde-border'>
        <Link
          href='/painel'
          className='text-2xl font-bold text-brand flex items-center gap-2 hover:opacity-90'
        >
          <Image
            src='/gearIcon.svg'
            alt='Ícone de engrenagem'
            width={32}
            height={32}
          />
          <span>OFICINA</span>
        </Link>

        <nav className='flex flex-col justify-between h-full text-foreground'>
          <div className='flex flex-col gap-4'>
            {navItems.map(({ href, icon: Icon, label, isNewOrder }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex gap-2 items-center transition ${
                    isActive
                      ? 'text-tertiary'
                      : 'text-foreground hover:text-tertiary'
                  }  ${isNewOrder && 'text-secondary-highlight'}`}
                >
                  <Icon size={16} /> {label}
                </Link>
              );
            })}
          </div>

          {/* Preferências */}
          {/* Preferências fixas no final do aside */}
          <div className='mt-auto pt-6 border-t border-border flex flex-col gap-2'>
            <ThemeTogglePopover
              showPopover={showPopover}
              dismissPopover={dismissPopover}
              isMobile={isMobile}
            />

            <button
              type='button'
              onClick={() => {}}
              className='hover:text-tertiary flex gap-2 items-center cursor-pointer transition'
            >
              <Wrench size={16} /> Configurações
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile BottomNav */}
      <nav className='fixed bottom-0 z-50 w-full bg-muted border-t border-border md:hidden'>
        <ul className='flex justify-around items-center p-2 relative'>
          {/* Navegação padrão */}
          {[navItems[0], navItems[1], navItems[3]].map(
            ({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex flex-col items-center text-xs gap-1 px-2 py-1 transition ${
                      isActive
                        ? 'text-tertiary'
                        : 'text-subtle-foreground hover:text-tertiary'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                </li>
              );
            }
          )}

          {/* Botão flutuante */}
          <li className='absolute -top-6 left-1/2 transform -translate-x-1/2'>
            <Link
              href='/novo-atendimento'
              className='bg-tertiary text-tertiary-foreground shadow-md w-14 h-14 rounded-full flex items-center justify-center border-4 border-muted transition hover:bg-tertiary/90'
            >
              <UserPlus size={24} />
            </Link>
          </li>

          {/* Dropdown de mais opções */}
          <li className='relative'>
            <div className='relative'>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className='flex flex-col items-center text-xs gap-1 px-2 py-1 transition text-subtle-foreground hover:text-tertiary'
              >
                <MoreHorizontal size={20} />
                Mais
              </button>

              {open && (
                <div className='absolute bottom-12 right-0 ml-3 bg-muted text-foreground shadow-lg rounded-md overflow-hidden z-50 w-40 border border-border'>
                  {[navItems[4], navItems[2]].map(
                    ({ href, icon: Icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-hover transition w-full'
                      >
                        <Icon size={16} /> {label}
                      </Link>
                    )
                  )}

                  <div className='border-t border-border my-1' />

                  <button
                    type='button'
                    onClick={toggleTheme}
                    className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-hover transition w-full'
                  >
                    {isLight ? <Moon size={16} /> : <Sun size={16} />}
                    {isLight ? 'Modo Escuro' : 'Modo Claro'}
                  </button>

                  <button
                    type='button'
                    onClick={() => {}}
                    className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-hover transition w-full'
                  >
                    <Settings size={16} /> Configurações
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
