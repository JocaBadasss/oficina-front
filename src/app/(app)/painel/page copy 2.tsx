'use client';

import Link from 'next/link';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatPlate } from '@/utils/helpers/vehicles';

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

  const stats = [
    {
      label: 'Agendamentos Hoje',
      value: totalAppointmentsToday,
      Icon: CalendarDays,
      href: '/agendamentos',
    },
    {
      label: 'Ordens Abertas',
      value: totalOpenOrders,
      Icon: FileText,
      href: '/ordens',
    },
    {
      label: 'Clientes Cadastrados',
      value: user?.clientsCount ?? 0,
      Icon: Users,
      href: '/clientes',
    },
  ];

  const statusBadgeStyles = {
    AGUARDANDO: 'bg-TINTS_CARROT_100 text-DARK_100',
    EM_ANDAMENTO: 'bg-TINTS_CAKE_200 text-DARK_100',
    FINALIZADO: 'bg-TINTS_MINT_100 text-DARK_100',
    PENDENTE: 'bg-TINTS_TOMATO_300 text-LIGHT_100',
  };

  return (
    <AppLayout>
      <PageHeader
        title='Painel'
        subtitle='Confiança e qualidade no serviço'
        userName={user?.name}
        onLogout={() => {
          signOut();
          router.push('/login');
        }}
      />

      <main className='flex-1 p-4 md:p-6 space-y-8'>
        <h1 className='text-2xl md:text-3xl font-bold font-roboto text-LIGHT_100'>
          Visão Geral
        </h1>

        {/* Estatísticas Principais */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
          {stats.map(({ label, value, Icon, href }) => (
            <Link
              key={label}
              href={href}
              className='block'
            >
              <Card className='bg-DARK_700 border border-DARK_600 rounded-lg hover:bg-DARK_800 transition cursor-pointer shadow-md p-6'>
                <CardContent className='flex flex-col items-center justify-center text-center'>
                  <Icon className='w-7 h-7 text-TINTS_CARROT_100 mb-2' />
                  <p className='text-3xl font-bold text-LIGHT_100'>{value}</p>
                  <p className='text-sm font-medium text-LIGHT_400'>{label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Listas de Agendamentos e Ordens */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Agendamentos */}
          <Card className='bg-DARK_700 rounded-lg overflow-hidden'>
            <div className='bg-DARK_800 p-4 border-b border-DARK_600'>
              <h2 className='text-xl font-semibold text-LIGHT_100'>
                Próximos Agendamentos
              </h2>
            </div>
            <ScrollArea className='h-60 bg-DARK_700'>
              {loading ? (
                <p className='text-center py-8 text-LIGHT_500'>Carregando...</p>
              ) : appointments.length === 0 ? (
                <p className='text-center py-8 text-LIGHT_500'>
                  Nenhum agendamento.
                </p>
              ) : (
                <ul className='divide-y divide-DARK_600'>
                  {appointments.map((appt) => (
                    <li key={appt.id}>
                      <Link
                        href={`/agendamentos/${appt.id}`}
                        className='flex justify-between items-center p-4 hover:bg-DARK_800 transition'
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium text-LIGHT_100'>
                            {appt.vehicle.client.name}
                          </span>
                          <span className='text-xs text-LIGHT_300'>
                            {format(
                              new Date(appt.date),
                              "dd/MM/yyyy 'às' HH:mm"
                            )}
                          </span>
                        </div>
                        <Badge
                          className={
                            statusBadgeStyles[appt.status] ||
                            'bg-TINTS_CARROT_100 text-DARK_100'
                          }
                        >
                          {appt.status}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </Card>

          {/* Ordens */}
          <Card className='bg-DARK_700 rounded-lg overflow-hidden'>
            <div className='bg-DARK_800 p-4 border-b border-DARK_600'>
              <h2 className='text-xl font-semibold text-LIGHT_100'>
                Ordens em Andamento
              </h2>
            </div>
            <ScrollArea className='h-60 bg-DARK_700'>
              {loading ? (
                <p className='text-center py-8 text-LIGHT_500'>Carregando...</p>
              ) : openOrders.length === 0 ? (
                <p className='text-center py-8 text-LIGHT_500'>
                  Sem ordens em aberto.
                </p>
              ) : (
                <ul className='divide-y divide-DARK_600'>
                  {openOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        href={`/ordens/${order.id}`}
                        className='flex justify-between items-center p-4 hover:bg-DARK_800 transition'
                      >
                        <div className='flex flex-col truncate'>
                          <span className='text-sm font-medium text-LIGHT_100 truncate'>
                            {order.vehicle.brand} {order.vehicle.model}
                          </span>
                          <span className='text-sm font-semibold text-LIGHT_300'>
                            {formatPlate(order.vehicle.plate)}
                          </span>
                        </div>
                        <Badge className={statusBadgeStyles[order.status]}>
                          {order.status === 'EM_ANDAMENTO'
                            ? 'Em andamento'
                            : order.status === 'FINALIZADO'
                            ? 'Finalizado'
                            : 'Aguardando'}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
