'use client';

import { Home, Users, Truck, Wrench, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Aside() {
  return (
    <aside className='hidden md:flex flex-col w-64 bg-DARK_700 p-6 space-y-6 pb-12'>
      <div className='text-2xl font-bold text-TINTS_CARROT_100 flex items-center gap-2'>
        <Image
          src='/gearIcon.svg'
          alt='Ícone de engrenagem'
          width={32}
          height={32}
        />
        <span>OFICINA</span>
      </div>
      <nav className='flex flex-col justify-between h-full text-LIGHT_100'>
        <div className='flex flex-col gap-4'>
          <a
            href='/painel'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Home size={16} /> Painel
          </a>
          <Link
            href='/novo-atendimento'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center text-TINTS_CAKE_200'
          >
            <Users size={16} /> Novo atendimento
          </Link>
          <Link
            href='/clientes'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Users size={16} /> Clientes
          </Link>
          <Link
            href='/veiculos'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Truck size={16} /> Veículos
          </Link>
          <Link
            href='/ordens'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Wrench size={16} /> Ordens de serviço
          </Link>
        </div>
        <Link
          href='/configuracoes'
          className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
        >
          <Settings size={16} /> Configurações
        </Link>
      </nav>
    </aside>
  );
}
