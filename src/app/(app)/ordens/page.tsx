'use client';

import { useEffect, useState } from 'react';
import { Aside } from '@/components/Aside';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>
              Ordens de Serviço
            </h1>
            <p className='text-LIGHT_500 mt-1'>
              Visualize e gerencie as ordens de serviço cadastradas.
            </p>
          </div>
          <Link
            href='/ordens/nova'
            className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-TINTS_CARROT_100/90 transition'
          >
            <Plus size={16} /> Nova Ordem
          </Link>
        </header>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
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
            <p className='text-LIGHT_500'>Nenhuma ordem encontrada.</p>
          ) : (
            <ul className='space-y-4'>
              {filteredOrders.map((order) => (
                <li
                  key={order.id}
                  className='border border-DARK_600 rounded-md p-4 bg-DARK_800 hover:bg-DARK_900 transition'
                >
                  <Link
                    href={`/ordens/${order.id}`}
                    className='block'
                  >
                    <div className='flex justify-between items-start'>
                      <div className='text-sm text-LIGHT_500'>
                        {format(
                          new Date(order.createdAt),
                          "dd 'de' MMMM 'de' yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded uppercase whitespace-nowrap ${
                          order.status === 'FINALIZADO'
                            ? 'bg-TINTS_MINT_100 text-DARK_100'
                            : 'bg-TINTS_CARROT_100 text-DARK_100'
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>

                    <p className='mt-1 font-semibold text-LIGHT_100'>
                      {order.vehicle.plate} — {order.vehicle.model} (
                      {order.vehicle.brand})
                    </p>
                    <p className='text-sm text-LIGHT_500'>
                      Cliente: {order.vehicle.client.name}
                    </p>
                    <p className='text-sm text-LIGHT_300 mt-1'>
                      {order.complaints}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
