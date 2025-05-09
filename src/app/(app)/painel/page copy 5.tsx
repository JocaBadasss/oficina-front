'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Aside } from '@/components/Aside';
import Link from 'next/link';

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

      {/* Conteúdo Principal */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='p-6 border-b border-DARK_600 bg-DARK_400 flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Painel</h1>
            <p className='text-LIGHT_500 mt-1'>
              Confiança e qualidade no serviço.
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-LIGHT_100'>
              Olá, {user?.name || 'Usuário'}
            </span>
            <button
              onClick={() => {
                signOut();
                router.push('/login');
              }}
              className='bg-TINTS_CARROT_100 hover:bg-TINTS_CARROT_100/90 text-DARK_100 font-semibold px-4 py-2 rounded transition'
            >
              Logout
            </button>
          </div>
        </header>

        <main className='flex-1 p-6 space-y-6'>
          <h1 className='text-3xl font-bold font-roboto'>Visão Geral</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {loading ? (
              <Skeleton className='h-28 rounded-lg w-full' />
            ) : (
              <Link
                href='/agendamentos'
                className='bg-TINTS_CARROT_100 text-LIGHT_200 rounded-lg p-6 text-center font-roboto shadow-md hover:bg-TINTS_CARROT_100/90 transition cursor-pointer'
              >
                <h2 className='text-4xl font-bold'>{totalAppointmentsToday}</h2>
                <p className='text-lg font-medium'>Agendamentos</p>
              </Link>
            )}
            {loading ? (
              <Skeleton className='h-28 rounded-lg w-full' />
            ) : (
              <Link
                href='/ordens'
                className='bg-TINTS_CARROT_100 text-LIGHT_200 rounded-lg p-6 text-center font-roboto shadow-md hover:bg-TINTS_CARROT_100/90 transition cursor-pointer'
              >
                <h2 className='text-4xl font-bold'>{totalOpenOrders}</h2>
                <p className='text-lg font-medium'>Ordens Abertas</p>
              </Link>
            )}
          </div>

          <div className='flex w-full gap-6 flex-col md:flex-row'>
            {/* Agendamentos */}
            <div className='w-full'>
              <h3 className='text-2xl font-semibold mb-2'>Agendamentos</h3>
              <div className='bg-DARK_700 rounded-lg min-h-[140px] flex flex-col justify-center'>
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
                        <a
                          href={`/agendamentos/${appt.id}`}
                          className='flex justify-between py-2 mt-[6px] hover:bg-DARK_800 px-2 rounded transition cursor-pointer'
                        >
                          <span>
                            {format(
                              new Date(appt.date),
                              "d 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </span>
                          <strong>{appt.vehicle.client.name}</strong>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Ordens de Serviço */}
            <div className='w-full'>
              <h3 className='text-2xl font-semibold mb-2'>Ordens de Serviço</h3>
              <div className='bg-DARK_700 rounded-lg min-h-[140px] flex flex-col justify-center'>
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
                        <a
                          href={`/ordens/${order.id}`}
                          className='block py-2 mt-[6px] hover:bg-DARK_800 px-2 rounded transition cursor-pointer'
                        >
                          <div className='flex justify-between items-center'>
                            <div>
                              <strong className='block text-LIGHT_100'>
                                {order.vehicle.brand} {order.vehicle.model}{' '}
                                {order.vehicle.year}
                              </strong>
                              {order.vehicle.plate}
                            </div>
                            <span className='text-TINTS_CARROT_100'>
                              {order.status}
                            </span>
                          </div>
                        </a>
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
