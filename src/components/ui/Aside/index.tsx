'use client';

import { Home, Users, Truck, Wrench, Settings } from 'lucide-react';
import Image from 'next/image';

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
          <a
            href='/clientes'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Users size={16} /> Clientes
          </a>
          <a
            href='/veiculos'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Truck size={16} /> Veículos
          </a>
          <a
            href='/ordens'
            className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
          >
            <Wrench size={16} /> Ordens de serviço
          </a>
        </div>
        <a
          href='/configuracoes'
          className='hover:text-TINTS_CARROT_100 flex gap-2 items-center'
        >
          <Settings size={16} /> Configurações
        </a>
      </nav>
    </aside>
  );
}
