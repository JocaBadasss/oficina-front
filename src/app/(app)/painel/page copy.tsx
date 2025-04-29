'use client';

import { Button } from '@/components/ui/button';

export default function PainelPage() {
  return (
    <div className='flex min-h-screen bg-background text-foreground'>
      {/* Sidebar */}
      <aside className='hidden md:flex flex-col w-64 bg-secondary p-6 space-y-6'>
        <div className='text-2xl font-bold text-primary flex items-center gap-2'>
          <img
            src='/gearIcon.svg'
            alt='Ícone de engrenagem'
            className='w-8 h-8'
          />{' '}
          <span>OFICINA</span>
        </div>
        <nav className='flex flex-col gap-4 text-white'>
          <a
            href='/painel'
            className='hover:text-primary'
          >
            Dashboard
          </a>
          <a
            href='#'
            className='hover:text-primary'
          >
            Clientes
          </a>
          <a
            href='#'
            className='hover:text-primary'
          >
            Veículos
          </a>
          <a
            href='#'
            className='hover:text-primary'
          >
            Configurações
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='p-6 border-b border-muted bg-background'>
          <h1 className='text-3xl font-bold font-roboto'>Painel</h1>
          <p className='text-mutedForeground mt-1 font-poppins'>
            Confiança e qualidade no serviço.
          </p>
        </header>

        {/* Cards principais */}
        <main className='flex-1 p-6 space-y-6'>
          <h1 className='text-3xl font-bold font-roboto'>Visão Geral</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-primary text-foreground rounded-lg p-6'>
              <h2 className='text-4xl font-bold'>12</h2>
              <p className='text-lg font-medium'>Agendamentos</p>
            </div>
            <div className='bg-primary text-foreground rounded-lg p-6'>
              <h2 className='text-4xl font-bold'>8</h2>
              <p className='text-lg font-medium'>Ordens Abertas</p>
            </div>
          </div>

          {/* Listas */}
          <h3 className='text-xl font-semibold mb-4'>Agendamentos</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Agendamentos */}
            <div className=' p-6 rounded-lg'>
              <ul className='space-y-2 text-sm bg-muted p-4 rounded-lg'>
                <li className='flex justify-between'>
                  <span>27 de Maio</span> <strong>João Souza</strong>
                </li>
                <li className='flex justify-between'>
                  <span>26 de Maio</span> <strong>Maria Lima</strong>
                </li>
                <li className='flex justify-between'>
                  <span>25 de Maio</span> <strong>Rafael Oliveira</strong>
                </li>
              </ul>
            </div>

            {/* Ordens de Serviço */}
            <div className=' p-6 rounded-lg'>
              <h3 className='text-xl font-semibold mb-4'>Ordens de Serviço</h3>
              <ul className='space-y-2 text-sm bg-muted p-4 rounded-lg'>
                <li>
                  <div className='flex justify-between'>
                    <div>
                      <strong>Toyota Corolla</strong>
                      <br />
                      ABC-1234
                    </div>
                    <span className='text-primary'>Em andamento</span>
                  </div>
                </li>
                <li>
                  <div className='flex justify-between'>
                    <div>
                      <strong>Honda Civic</strong>
                      <br />
                      XYZ-5678
                    </div>
                    <span className='text-primary'>Em andamento</span>
                  </div>
                </li>
                <li>
                  <div className='flex justify-between'>
                    <div>
                      <strong>Ford Fiesta</strong>
                      <br />
                      DEF-9876
                    </div>
                    <span className='text-success'>Concluída</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
