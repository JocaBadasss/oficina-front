// Componente de navegação inferior estilo Instagram (mobile only)
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
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/painel', icon: Home, label: 'Painel', isNewOrder: false },
  {
    href: '/novo-atendimento',
    icon: UserPlus,
    label: 'Novo Atendimento',
    isNewOrder: true,
  },
  { href: '/clientes', icon: Users, label: 'Clientes', isNewOrder: false },
  { href: '/veiculos', icon: Truck, label: 'Veículos', isNewOrder: false },
  { href: '/ordens', icon: Wrench, label: 'Ordens', isNewOrder: false },
  { href: '/agendamentos', icon: CalendarClock, label: 'Agendamentos' },
];

export function Aside() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Aside */}
      <aside className='hidden md:fixed  md:inset-y-0 md:flex md:w-64 md:flex-col bg-muted p-6 space-y-6 pb-12 z-50'>
        <Link
          href='/painel'
          className='text-2xl font-bold text-TINTS_PASSION_100 flex items-center gap-2 hover:opacity-90'
        >
          <Image
            src='/gearIcon.svg'
            alt='Ícone de engrenagem'
            width={32}
            height={32}
          />
          <span>OFICINA</span>
        </Link>
        <nav className='flex flex-col justify-between h-full text-LIGHT_100'>
          <div className='flex flex-col gap-4'>
            {navItems.map(({ href, icon: Icon, label, isNewOrder }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-TINTS_CARROT_100 flex gap-2 ${
                  isNewOrder ? 'text-TINTS_CAKE_200' : ''
                } items-center ${
                  pathname === href ? 'text-TINTS_CARROT_100' : ''
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>
          {/* QUANDO FOR USAR CONFIGS DESCOMENTAR */}
          {/* <Link
            href='/#'
            className={`hover:text-TINTS_CARROT_100 flex gap-2 items-center ${
              pathname === '/configuracoes' ? 'text-TINTS_CARROT_100' : ''
            }`}
          >
            <Wrench size={16} /> Configurações
          </Link> */}
          {/* QUANDO FOR USAR CONFIGS DESCOMENTAR */}

          <button
            type='button'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center text-LIGHT_100 cursor-default hover:cursor-pointer'
            onClick={() => {}}
          >
            <Wrench size={16} /> Configurações
          </button>
        </nav>
      </aside>

      {/* Mobile BottomNav */}
      <nav className='fixed bottom-0 z-50 w-full bg-DARK_700 border-t border-DARK_600 md:hidden'>
        <ul className='flex justify-around items-center p-2 relative'>
          {/* Ícones principais no mobile: Painel, Clientes, Ordens */}
          {[navItems[0], navItems[2], navItems[4]].map(
            ({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex flex-col items-center text-xs gap-1 px-2 py-1 transition ${
                      isActive
                        ? 'text-TINTS_CARROT_100'
                        : 'text-LIGHT_500 hover:text-TINTS_CARROT_100'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                </li>
              );
            }
          )}

          {/* Botão flutuante central para Novo Atendimento */}
          <li className='absolute -top-6 left-1/2 transform -translate-x-1/2'>
            <Link
              href='/novo-atendimento'
              className='bg-TINTS_CARROT_100 text-DARK_100 shadow-md w-14 h-14 rounded-full flex items-center justify-center border-4 border-DARK_700 transition hover:bg-TINTS_CARROT_100/90 '
            >
              <UserPlus size={24} />
            </Link>
          </li>

          {/* Botão de mais opções */}
          <li className='relative'>
            <div className='relative'>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className='flex flex-col items-center text-xs gap-1 px-2 py-1 transition text-LIGHT_500 hover:text-TINTS_CARROT_100'
              >
                <MoreHorizontal size={20} />
                Mais
              </button>

              {open && (
                <div className='absolute bottom-12 right-0 ml-3 bg-DARK_700 text-LIGHT_100 shadow-lg rounded-md overflow-hidden z-50 w-40'>
                  <Link
                    href='/agendamentos'
                    className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-hover transition w-full'
                  >
                    <CalendarClock size={16} /> Agendamentos
                  </Link>
                  <Link
                    href='/veiculos'
                    className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-DARK_800 transition w-full'
                  >
                    <Truck size={16} /> Veículos
                  </Link>
                  {/* QUANDO FOR USAR CONFIGS DESCOMENTAR */}
                  {/* <Link
                    href='/#'
                    className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-DARK_800 transition w-full'
                  >
                    <Settings size={16} /> Configurações
                  </Link> */}
                  {/* QUANDO FOR USAR CONFIGS DESCOMENTAR */}
                  <button
                    type='button'
                    onClick={() => {}}
                    className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-DARK_800 transition hover:cursor-pointer text-left w-full'
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
