'use client';

import { Home, Users, Truck, Wrench, Settings, LogOut } from 'lucide-react';

export default function PainelPage() {
  return (
    <div className='flex min-h-screen bg-DARK_400 text-foreground'>
      {/* Sidebar */}
      <aside className='hidden md:flex flex-col w-64 bg-DARK_700 p-6 space-y-6 pb-12'>
        <div className='text-2xl font-bold text-primary flex items-center gap-2'>
          <img
            src='/gearIcon.svg'
            alt='Ícone de engrenagem'
            className='w-8 h-8'
          />{' '}
          <span>OFICINA</span>
        </div>
        <nav className='flex flex-col justify-between h-full text-white font-poppins '>
          <div className='flex flex-col gap-4'>
            <a
              href='/painel'
              className='hover:text-primary flex gap-2 items-center'
            >
              <Home size={16} /> Painel
            </a>
            <a
              href='#'
              className='hover:text-primary flex gap-2 items-center'
            >
              <Users size={16} /> Clientes
            </a>
            <a
              href='#'
              className='hover:text-primary flex gap-2 items-center'
            >
              <Truck size={16} /> Veículos
            </a>
            <a
              href='#'
              className='hover:text-primary flex gap-2 items-center'
            >
              <Wrench size={16} /> Ordens de serviço
            </a>
          </div>
          <a
            href='#'
            className='hover:text-primary flex gap-2 items-center'
          >
            <Settings size={16} /> Configurações
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='p-6 border-b border-muted '>
          <h1 className='text-3xl font-bold font-roboto'>Painel</h1>
          <p className='text-mutedForeground mt-1 font-poppins'>
            Confiança e qualidade no serviço.
          </p>
        </header>

        {/* Cards principais */}
        <main className='flex-1 p-6 space-y-6'>
          <h1 className='text-3xl font-bold font-roboto'>Visão Geral</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-TINTS_CARROT_100 text-foreground rounded-lg p-6 text-center'>
              <h2 className='text-4xl font-bold'>12</h2>
              <p className='text-lg font-medium '>Agendamentos</p>
            </div>
            <div className='bg-TINTS_CARROT_100 text-foreground rounded-lg p-6 text-center'>
              <h2 className='text-4xl font-bold'>8</h2>
              <p className='text-lg font-medium'>Ordens Abertas</p>
            </div>
          </div>

          {/* Listas */}
          <div className='flex  w-full gap-6'>
            {/* Agendamentos */}
            <div className=' w-full'>
              <h3 className='text-2xl font-semibold mb-2'>Agendamentos</h3>
              <div className=' '>
                <div className=' bg-DARK_700  rounded-lg'>
                  <ul className='space-y-2 text-sm  p-3 rounded-lg  divide-LIGHT_700 divide-y divide-border'>
                    <li className='flex justify-between py-2'>
                      <span>27 de Maio</span> <strong>João Souza</strong>
                    </li>
                    <li className='flex justify-between py-2'>
                      <span>26 de Maio</span> <strong>Maria Lima</strong>
                    </li>
                    <li className='flex justify-between py-2'>
                      <span>25 de Maio</span> <strong>Rafael Oliveira</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Ordens de Serviço */}
            <div className=' w-full'>
              <h3 className='text-2xl font-semibold mb-2'>Ordens de Serviço</h3>
              <div className='bg-DARK_700  rounded-lg'>
                <ul className=' space-y-2 text-sm p-3 rounded-lg divide-LIGHT_700 divide-y divide-border text-TINTS_CAKE_200'>
                  <li className='py-2 first:pt-0 last:pb-0 text'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <strong className='block text-white'>
                          Toyota Corolla
                        </strong>
                        ABC-1284
                      </div>
                      <span className='text-primary'>Em andamento</span>
                    </div>
                  </li>
                  <li className='py-2'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <strong className='block text-white'>
                          Honda Civic
                        </strong>
                        XY-5678
                      </div>
                      <span className='text-primary'>Em andamento</span>
                    </div>
                  </li>
                  <li className='py-2'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <strong className='block text-white'>
                          Ford Fiesta
                        </strong>
                        DEF-9876
                      </div>
                      <span className='text-TINTS_MINT_100'>Concluída</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
