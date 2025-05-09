// Página revisada do Painel com melhorias de responsividade e legibilidade no mobile
'use client';
import './painel-scroll.css';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Aside } from '@/components/Aside';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, FileText } from 'lucide-react';

const statusLabels: Record<string, string> = {
  AGUARDANDO: 'Aguardando',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
};

export default function PainelPage() {
  const {
    appointments,
    openOrders,
    totalAppointmentsToday,
    totalOpenOrders,
    loading,
  } = useDashboardData();

  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <div className='flex-1 flex flex-col'>
        <header className='px-4 py-4 md:px-6 md:py-6 border-b border-DARK_600 bg-DARK_400 flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold font-roboto'>
              Painel
            </h1>
            <p className='text-LIGHT_500 mt-1 text-sm md:text-base'>
              Confiança e qualidade no serviço.
            </p>
          </div>
          <div className='flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end'>
            <span className='text-sm truncate max-w-[160px] md:max-w-none'>
              Olá, {user?.name || 'Usuário'}
            </span>
            <button
              onClick={() => {
                signOut();
                router.push('/login');
              }}
              className='bg-TINTS_CARROT_100 hover:bg-TINTS_CARROT_100/90 text-DARK_100 font-semibold px-4 py-2 rounded transition text-sm md:text-base'
            >
              Logout
            </button>
          </div>
        </header>

        <main className='flex-1 p-4 md:p-6 space-y-8'>
          <h1 className='text-2xl md:text-3xl font-bold font-roboto'>
            Visão Geral
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
            {loading ? (
              <Skeleton className='h-28 rounded-lg w-full' />
            ) : (
              <Link
                href='/agendamentos'
                className='bg-DARK_700 border border-DARK_900 text-LIGHT_100 rounded-lg p-4 md:p-6 shadow-md hover:bg-DARK_800 transition cursor-pointer'
              >
                <div className='flex items-center justify-between'>
                  <div className='text-left'>
                    <h2 className='text-2xl md:text-4xl font-bold'>
                      {totalAppointmentsToday}
                    </h2>
                    <p className='text-sm md:text-lg text-LIGHT_500 font-medium mt-1'>
                      Agendamentos Hoje
                    </p>
                  </div>
                  <CalendarDays className='w-6 h-6 md:w-8 md:h-8 text-TINTS_CARROT_100' />
                </div>
              </Link>
            )}

            {loading ? (
              <Skeleton className='h-28 rounded-lg w-full' />
            ) : (
              <Link
                href='/ordens'
                className='bg-DARK_700 border border-DARK_900 text-LIGHT_100 rounded-lg p-4 md:p-6 shadow-md hover:bg-DARK_800 transition cursor-pointer'
              >
                <div className='flex items-center justify-between'>
                  <div className='text-left'>
                    <h2 className='text-2xl md:text-4xl font-bold'>
                      {totalOpenOrders}
                    </h2>
                    <p className='text-sm md:text-lg text-LIGHT_500 font-medium mt-1'>
                      Ordens Abertas
                    </p>
                  </div>
                  <FileText className='w-6 h-6 md:w-8 md:h-8 text-TINTS_CARROT_100' />
                </div>
              </Link>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            {/* Agendamentos */}
            <div>
              <h3 className='text-xl md:text-2xl font-semibold mb-2'>
                Agendamentos
              </h3>
              <div className='bg-DARK_700 rounded-lg min-h-[140px] max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin scrollbar-thumb-TINTS_CARROT_100 scrollbar-track-DARK_900 rounded-md'>
                {loading ? (
                  <div className='p-3 space-y-3'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ) : appointments.length === 0 ? (
                  <p className='text-center text-LIGHT_500'>
                    Nenhum agendamento pendente.
                  </p>
                ) : (
                  <ul className='space-y-2 text-sm p-3 divide-LIGHT_700 divide-y'>
                    {appointments.map((appt) => (
                      <li key={appt.id}>
                        <Link
                          href={`/agendamentos/${appt.id}`}
                          className='flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 py-2 mt-[6px] hover:bg-DARK_800 px-2 rounded transition cursor-pointer'
                        >
                          <span className='text-xs sm:text-sm'>
                            {format(
                              new Date(appt.date),
                              "d 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </span>
                          <strong className='text-sm truncate text-right sm:text-left'>
                            {appt.vehicle.client.name}
                          </strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Ordens */}
            <div>
              <h3 className='text-xl md:text-2xl font-semibold mb-2'>
                Ordens de Serviço
              </h3>
              <div className='bg-DARK_700 rounded-lg min-h-[140px] max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin scrollbar-thumb-TINTS_CARROT_100 scrollbar-track-DARK_900 rounded-md p-3'>
                {loading ? (
                  <div className='p-3 space-y-3'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ) : openOrders.length === 0 ? (
                  <p className='text-center text-LIGHT_500'>
                    Nenhuma ordem de serviço aberta.
                  </p>
                ) : (
                  <ul className='space-y-2 text-sm p-3 divide-LIGHT_700 divide-y text-TINTS_CAKE_200'>
                    {openOrders.map((order) => (
                      <li key={order.id}>
                        <Link
                          href={`/ordens/${order.id}`}
                          className='block py-2 mt-[6px] hover:bg-DARK_800 px-2 rounded transition cursor-pointer'
                        >
                          <div className='flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center'>
                            <div className='text-sm sm:text-base'>
                              <strong className='block text-LIGHT_100 truncate'>
                                {order.vehicle.brand} {order.vehicle.model}{' '}
                                {order.vehicle.year}
                              </strong>
                              <span className='text-xs sm:text-sm text-LIGHT_500'>
                                {order.vehicle.plate}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs mt-1 sm:mt-0 text-center rounded font-bold \
                                ${
                                  order.status === 'AGUARDANDO'
                                    ? 'bg-LIGHT_500/10 text-LIGHT_500 border border-LIGHT_500/30'
                                    : ''
                                } \
                                ${
                                  order.status === 'EM_ANDAMENTO'
                                    ? 'bg-TINTS_CARROT_100/10 text-TINTS_CARROT_100 border border-TINTS_CARROT_100/30'
                                    : ''
                                } \
                                ${
                                  order.status === 'FINALIZADO'
                                    ? 'bg-TINTS_MINT_100/10 text-TINTS_MINT_100 border border-TINTS_MINT_100/30'
                                    : ''
                                }`}
                            >
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
