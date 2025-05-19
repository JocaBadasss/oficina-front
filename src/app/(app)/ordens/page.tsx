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
    return (
      order.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
      order.vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
      order.vehicle.client.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <AppLayout>

      <main className='flex-1 p-4 sm:p-6 space-y-6'>
        <PageHeader
          title='Ordens de Serviço'
          subtitle='Visualize e gerencie as ordens de serviço cadastradas.'
          rightSlot={
            <Link
              href='/ordens/nova'
              className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-TINTS_CARROT_100/90 transition text-sm sm:text-base self-start sm:self-auto w-full justify-center'
            >
              <Plus size={16} /> Nova Ordem
            </Link>
          }
          backHref='/painel'
        />

        <section className='bg-DARK_700 rounded-lg p-4 sm:p-6 space-y-4'>
          <div className='flex items-center gap-2 border border-DARK_900 rounded-md px-3 py-2 bg-DARK_800'>
            <Search
              size={16}
              className='text-LIGHT_500'
            />
            <input
              type='text'
              placeholder='Buscar ordem...'
              className='bg-transparent outline-none flex-1 text-sm text-LIGHT_100 placeholder:text-LIGHT_500'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className='space-y-2'>
              <Skeleton className='h-6 w-full' />
              <Skeleton className='h-6 w-full' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className='text-LIGHT_500 text-sm'>Nenhuma ordem encontrada.</p>
          ) : (
            <ul className='space-y-4'>
              {filteredOrders.map((order) => (
                <li
                  key={order.id}
                  className='bg-DARK_800 rounded-xl border border-DARK_600 p-4 shadow-sm hover:bg-DARK_900 transition flex flex-col gap-4'
                >
                  <Link
                    href={`/ordens/${order.id}`}
                    className='block space-y-4'
                  >
                    {/* Data + Status */}
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-2 text-sm text-LIGHT_500'>
                        <Calendar
                          size={16}
                          className='text-TINTS_CARROT_100'
                        />
                        {format(
                          new Date(order.createdAt),
                          "dd 'de' MMMM 'de' yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </div>
                      <span
                        className={`text-[0.625rem] font-semibold px-2 py-1 rounded uppercase whitespace-nowrap
              ${
                order.status === 'FINALIZADO'
                  ? 'bg-TINTS_MINT_100 text-DARK_100'
                  : 'bg-TINTS_CARROT_100 text-DARK_100'
              }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>

                    {/* Veículo */}
                    <div className='flex items-start gap-3'>
                      <Car
                        size={20}
                        className='text-TINTS_CARROT_100 mt-0.5'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm text-LIGHT_500'>Veículo</p>
                        <p className='text-base font-semibold text-TINTS_CAKE_200 truncate'>
                          {order.vehicle.plate} — {order.vehicle.model} (
                          {order.vehicle.brand})
                        </p>
                      </div>
                    </div>

                    {/* Cliente */}
                    <div className='flex items-start gap-3'>
                      <User
                        size={20}
                        className='text-TINTS_CARROT_100 mt-0.5'
                      />
                      <div className='flex-1'>
                        <p className='text-sm text-LIGHT_500'>Cliente</p>
                        <p className='text-sm text-LIGHT_100 truncate'>
                          {order.vehicle.client.name}
                        </p>
                      </div>
                    </div>

                    {/* Reclamação */}
                    <div className='flex items-start gap-3'>
                      <ClipboardList
                        size={20}
                        className='text-TINTS_CARROT_100 mt-0.5'
                      />
                      <div className='flex-1'>
                        <p className='text-sm text-LIGHT_500'>Reclamação</p>
                        <p className='text-sm text-LIGHT_300'>
                          {order.complaints}
                        </p>
                      </div>
                    </div>

                    {/* Link final */}
                    <div className='flex justify-end pt-3 border-t border-DARK_900 mt-2'>
                      <span className='inline-flex items-center gap-1 text-sm font-semibold text-TINTS_CARROT_100 hover:underline'>
                        Ver detalhes <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
