'use client';

import React from 'react';
import Link from 'next/link';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Users } from 'lucide-react';
import { useMediaQuery } from 'usehooks-ts'; // 👈 topo do arquivo
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { formatPlate } from '@/utils/helpers/vehicles';
import { ptBR } from 'date-fns/locale';

export default function PainelPage() {
  const {
    appointments,
    openOrders,
    totalAppointmentsToday,
    totalOpenOrders,
    loading,
    totalClients,
    stats,
    monthlyStats,
  } = useDashboardData();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const mockStatsData = [
    { name: 'Agend.', value: 0 },
    { name: 'Ordens', value: 0 },
    { name: 'Clientes', value: 0 },
  ];

  const COLORS = ['#F4B400', '#8884d8'];

  const isMobile = useMediaQuery('(max-width: 639px)'); // até sm

  const cards = [
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
      value: totalClients,
      Icon: Users,
      href: '/clientes',
    },
  ];

  // Atualiza mockStatsData
  mockStatsData[0].value = totalAppointmentsToday;
  mockStatsData[1].value = totalOpenOrders;
  mockStatsData[2].value = totalClients;

  const chartPieData = [
    { name: 'Abertas', value: stats.open },
    { name: 'Finalizadas', value: stats.closed },
  ];

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return 'bg-TINTS_MINT_100 text-DARK_100';
      case 'EM_ANDAMENTO':
        return 'bg-TINTS_CARROT_100 text-DARK_100';
      default: // PENDENTE ou AGUARDANDO
        return 'bg-TINTS_CARROT_100/30 text-TINTS_CARROT_100';
    }
  };

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Painel'
          subtitle='Visão geral das operações'
          userName={user?.name}
          onLogout={() => {
            signOut();
            router.push('/login');
          }}
        />

        <section className='grid grid-cols-1 xl:grid-cols-3 gap-6 h-full'>
          {/* Cards e Listagens */}
          <div className='xl:col-span-2 space-y-6 h-full'>
            {/* Cards de Estatísticas */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'>
              {cards.map(({ label, value, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className='h-full'
                >
                  <Card className='bg-DARK_700 rounded-xl p-6 shadow-sm hover:bg-DARK_800 transition cursor-pointer h-full'>
                    <div className='flex items-center gap-4 h-full'>
                      <Icon className='w-6 h-6 text-TINTS_CARROT_100' />
                      <div className='flex flex-col justify-center flex-1'>
                        <div className='text-2xl lg:text-2xl md:text-xl font-bold text-LIGHT_100'>
                          {value}
                        </div>
                        <div className='text-sm text-LIGHT_300 truncate'>
                          {label}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Listagens */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Próximos Agendamentos */}
              <Card className='bg-DARK_700 rounded-xl overflow-hidden'>
                <div className='bg-DARK_800 p-4 border-b border-DARK_600'>
                  <h3 className='text-lg font-semibold text-LIGHT_100'>
                    Próximos Agendamentos
                  </h3>
                </div>
                <ScrollArea className='h-60 bg-DARK_700'>
                  {loading ? (
                    <div className='p-4 space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-full' />
                    </div>
                  ) : (
                    <ul className='divide-y divide-DARK_600 space-y-2'>
                      {appointments.map((appt) => (
                        <li key={appt.id}>
                          <Link
                            href={`/agendamentos/${appt.id}`}
                            className='flex justify-between items-center p-4 hover:bg-DARK_800 transition'
                          >
                            <div className='flex flex-col gap-y-1'>
                              <div className='text-sm font-medium text-LIGHT_100'>
                                {format(
                                  new Date(appt.date),
                                  "dd/MM/yyyy '•' HH:mm"
                                )}
                              </div>
                              <div className='text-sm text-LIGHT_300'>
                                {appt.vehicle.client.name}
                              </div>
                            </div>
                            <Badge
                              className={`text-[0.625rem] font-semibold px-2 py-1 rounded uppercase whitespace-nowrap ${getBadgeClass(
                                appt.status
                              )}`}
                            >
                              {appt.status === 'FINALIZADO'
                                ? 'Finalizado'
                                : appt.status === 'EM_ANDAMENTO'
                                ? 'Em andamento'
                                : 'Aguardando'}
                            </Badge>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </Card>

              {/* Ordens em Andamento */}
              <Card className='bg-DARK_700 rounded-xl overflow-hidden'>
                <div className='bg-DARK_800 p-4 border-b border-DARK_600'>
                  <h3 className='text-lg font-semibold text-LIGHT_100'>
                    Ordens em Andamento
                  </h3>
                </div>
                <ScrollArea className='h-60 bg-DARK_700'>
                  {loading ? (
                    <div className='p-4 space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-full' />
                    </div>
                  ) : (
                    <ul className='divide-y divide-DARK_600 space-y-2'>
                      {openOrders.map((order) => (
                        <li key={order.id}>
                          <Link
                            href={`/ordens/${order.id}`}
                            className='flex justify-between items-center p-4 hover:bg-DARK_800 transition'
                          >
                            <div className='truncate'>
                              <div className='text-sm font-medium text-LIGHT_100 truncate'>
                                {order.vehicle.brand} {order.vehicle.model}
                              </div>
                              <div className='text-sm text-LIGHT_300'>
                                {formatPlate(order.vehicle.plate)}
                              </div>
                            </div>
                            <Badge
                              className={`text-[0.625rem] font-semibold px-2 py-1 rounded uppercase whitespace-nowrap ${getBadgeClass(
                                order.status
                              )}`}
                            >
                              {order.status === 'FINALIZADO'
                                ? 'Finalizado'
                                : order.status === 'EM_ANDAMENTO'
                                ? 'Em andamento'
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
          </div>

          {/* Gráficos */}
          <div className='space-y-6 h-full flex flex-col justify-between'>
            {/* Pizza */}
            <Card className='bg-DARK_700 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-between '>
              <h3 className='text-base font-semibold text-LIGHT_100 mb-4 text-center'>
                Ordens Abertas vs Finalizadas
              </h3>
              <div className='w-full h-[12.5rem] sm:h-[13.75rem] md:h-[13.75rem] lg:h-full'>
                {' '}
                {/* ✅ Altura Fixa no Mobile */}
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                >
                  <PieChart>
                    <Pie
                      data={chartPieData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={isMobile ? 40 : 50}
                      label
                    >
                      {chartPieData.map((_, index: number) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#00111a',
                        borderRadius: 4,
                      }}
                      labelStyle={{ color: '#FFFFFF' }}
                      itemStyle={{ color: '#FFFFFF' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Linha */}
            <Card className='bg-DARK_700 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-between  '>
              <h3 className='text-base font-semibold text-LIGHT_100 mb-4 text-center'>
                Evolução Mensal de Ordens
              </h3>
              <div className='w-full h-[12.5rem] sm:h-[13.75rem] md:h-[13.75rem] lg:h-full'>
                {' '}
                {/* ✅ Altura Fixa no Mobile */}
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                >
                  <LineChart
                    data={monthlyStats.map((item) => ({
                      name: format(new Date(item.month + '-01'), 'MMM/yyyy', {
                        locale: ptBR,
                      }),
                      total: item.total,
                    }))}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='#0D161B'
                    />
                    <XAxis
                      dataKey='name'
                      stroke='#FFFFFF'
                      fontSize={12}
                    />
                    <YAxis
                      stroke='#FFFFFF'
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#00111a',
                        borderRadius: 4,
                      }}
                      labelStyle={{ color: '#FFFFFF' }}
                      itemStyle={{ color: '#FFFFFF' }}
                    />
                    <Line
                      type='monotone'
                      dataKey='total'
                      stroke='#F4B400'
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
