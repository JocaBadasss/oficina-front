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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/painel', icon: Home, label: 'Painel' },
  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/ordens', icon: Wrench, label: 'Ordens' },
  { href: '/veiculos', icon: Truck, label: 'Veículos' },
  { href: '/agendamentos', icon: CalendarClock, label: 'Agendamentos' },
];

export function Aside() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Aside */}
      <aside className='hidden md:flex flex-col w-64 bg-DARK_700 p-6 space-y-6 pb-12'>
        <div className='text-2xl font-bold text-TINTS_CARROT_100 flex items-center gap-2'>
          <img
            src='/gearIcon.svg'
            alt='Ícone de engrenagem'
            width={32}
            height={32}
          />
          <span>OFICINA</span>
        </div>
        <nav className='flex flex-col justify-between h-full text-LIGHT_100'>
          <div className='flex flex-col gap-4'>
            <Link
              href='/novo-atendimento'
              className={`hover:text-TINTS_CARROT_100 flex gap-2  text-TINTS_CAKE_200 items-center ${
                pathname === '/novo-atendimento' ? 'text-TINTS_CARROT_100' : ''
              }`}
            >
              <UserPlus size={16} /> Novo atendimento
            </Link>
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-TINTS_CARROT_100 flex gap-2 items-center ${
                  pathname === href ? 'text-TINTS_CARROT_100' : ''
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </div>
          <Link
            href='/configuracoes'
            className={`hover:text-TINTS_CARROT_100 flex gap-2 items-center ${
              pathname === '/configuracoes' ? 'text-TINTS_CARROT_100' : ''
            }`}
          >
            <Wrench size={16} /> Configurações
          </Link>
        </nav>
      </aside>

      {/* Mobile BottomNav */}
      <nav className='fixed bottom-0 z-50 w-full bg-DARK_700 border-t border-DARK_600 md:hidden'>
        <ul className='flex justify-around items-center p-2 relative'>
          {/* Ícones principais no mobile: Painel, Clientes, Ordens */}
          {[navItems[0], navItems[1], navItems[2]].map(
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
            <div className='group relative'>
              <button className='flex flex-col items-center text-xs gap-1 px-2 py-1 transition text-LIGHT_500 hover:text-TINTS_CARROT_100'>
                <MoreHorizontal size={20} />
                Mais
              </button>
              <div className='absolute bottom-12 left-[-24px] transform -translate-x-1/2 ml-3 bg-DARK_700 text-LIGHT_100 shadow-lg rounded-md overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-2 transition-all z-50 w-40'>
                <Link
                  href='/agendamentos'
                  className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-DARK_800 transition w-full'
                >
                  <CalendarClock size={16} /> Agendamentos
                </Link>
                <Link
                  href='/veiculos'
                  className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-DARK_800 transition w-full'
                >
                  <Truck size={16} /> Veículos
                </Link>
                <Link
                  href='/configuracoes'
                  className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-DARK_800 transition w-full'
                >
                  <Settings size={16} /> Configurações
                </Link>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
