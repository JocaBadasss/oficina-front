'use client';

import { useEffect, useState } from 'react';

import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Car, User, Calendar, ClipboardList, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatVehicleLine } from '@/utils/helpers/vehicles';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { StatusFilterComponent } from '@/components/ui/statusFilter';

interface Order {
  id: string;
  complaints: string;
  status: string;
  createdAt: string;
  vehicle: {
    plate: string;
    brand: string;
    model: string;
    year: number;
    client: {
      name: string;
    };
  };
}

const statusLabels: Record<string, string> = {
  AGUARDANDO: 'Aguardando',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
};

export default function OrdensPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/service-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Erro ao buscar ordens:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      order.vehicle.plate?.toLowerCase().includes(searchLower) ||
      order.vehicle.model?.toLowerCase().includes(searchLower) ||
      order.vehicle.client.name?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter ? order.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const mockChartData = [
    { value: 10 },
    { value: 20 },
    { value: 15 },
    { value: 25 },
    { value: 20 },
    { value: 30 },
    { value: 25 },
    { value: 35 },
  ];

  return (
    <AppLayout>
      <main className='flex-1 p-4 sm:p-6 space-y-6'>
        <PageHeader
          title='Ordens de Serviço'
          subtitle='Visualize e gerencie as ordens de serviço cadastradas.'
          rightSlot={
            <Link
              href='/ordens/nova'
              className='bg-tertiary text-muted-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-tertiary/90 transition text-sm sm:text-base self-start sm:self-auto w-full justify-center'
            >
              <Plus size={16} /> Nova Ordem
            </Link>
          }
          backHref='/painel'
        />

        <section className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>
          <div className='col-span-1 xl:col-span-2'>
            <div className='bg-muted rounded-lg p-4 sm:p-6 space-y-4 border borde-border'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                <div className='flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background flex-1'>
                  <Search
                    size={16}
                    className='text-subtle-foreground'
                  />
                  <input
                    type='text'
                    placeholder='Buscar ordem...'
                    className='bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-placeholder'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <StatusFilterComponent
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                />
              </div>

              <h2 className='text-lg sm:text-xl font-semibold text-foreground'>
                Lista de Ordens
              </h2>

              {loading ? (
                <div className='space-y-2'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                </div>
              ) : filteredOrders.length === 0 ? (
                <p className='text-subtle-foreground text-sm'>
                  Nenhuma ordem encontrada.
                </p>
              ) : (
                <ul className='space-y-4'>
                  {filteredOrders.map((order) => (
                    <li
                      key={order.id}
                      className='bg-background rounded-xl border border-border p-4 shadow-sm hover:bg-hover transition flex flex-col gap-4'
                    >
                      <Link
                        href={`/ordens/${order.id}`}
                        className='block space-y-4'
                      >
                        {/* Data + Status */}
                        <div className='flex justify-between items-center'>
                          <div className='flex items-center gap-2 text-sm text-subtle-foreground'>
                            <Calendar
                              size={16}
                              className='text-tertiary'
                            />
                            {format(
                              new Date(order.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </div>
                          <span
                            className={`text-[0.625rem] font-semibold px-2 py-1 rounded uppercase whitespace-nowrap
                          ${
                            order.status === 'FINALIZADO'
                              ? 'bg-success text-success-foreground'
                              : 'bg-tertiary text-tertiary-foreground'
                          }`}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>

                        {/* Veículo */}
                        <div className='flex items-start gap-3'>
                          <Car
                            size={20}
                            className='text-tertiary mt-0.5'
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm text-subtle-foreground'>
                              Veículo
                            </p>
                            <p className='text-base font-semibold text-secondary-highlight truncate'>
                              {formatVehicleLine({
                                plate: order.vehicle.plate,
                                model: order.vehicle.model,
                                brand: order.vehicle.brand,
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Cliente */}
                        <div className='flex items-start gap-3'>
                          <User
                            size={20}
                            className='text-tertiary mt-0.5'
                          />
                          <div className='flex-1'>
                            <p className='text-sm text-subtle-foreground'>
                              Cliente
                            </p>
                            <p className='text-sm text-foreground truncate'>
                              {order.vehicle.client.name}
                            </p>
                          </div>
                        </div>

                        {/* Reclamação */}
                        <div className='flex items-start gap-3'>
                          <ClipboardList
                            size={20}
                            className='text-tertiary mt-0.5'
                          />
                          <div className='flex-1'>
                            <p className='text-sm text-subtle-foreground'>
                              Reclamação
                            </p>
                            <p className='text-sm text-soft-foreground'>
                              {order.complaints}
                            </p>
                          </div>
                        </div>

                        {/* Link final */}
                        <div className='flex justify-end pt-3 border-t border-border mt-2'>
                          <span className='inline-flex items-center gap-1 text-sm font-semibold text-tertiary hover:underline'>
                            Ver detalhes <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Painel lateral com gráfico */}
          <div className='bg-muted rounded-lg p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-hidden min-h-44 border borde-border'>
            <div className='w-full text-center'>
              <h2 className='text-sm text-subtle-foreground uppercase tracking-wide'>
                Ordens Criadas
              </h2>
              {loading ? (
                <Skeleton className='h-8 w-16 mt-2 mx-auto' />
              ) : (
                <p className='text-5xl sm:text-6xl font-bold text-primary mt-1'>
                  {orders.length}
                </p>
              )}
            </div>
            <div className='w-full h-24 mt-4'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <LineChart
                  data={mockChartData}
                  margin={{ top: 10, bottom: 0, right: 10 }}
                >
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='hsl(var(--brand))'
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
