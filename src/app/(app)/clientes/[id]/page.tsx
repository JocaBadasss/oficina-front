'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Aside } from '@/components/Aside';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageHeader } from '@/components/PageHeader';

interface ServiceOrder {
  id: string;
  status: string;
  createdAt: string;
  complaints: string;
  vehicle?: {
    model: string;
    brand: string;
    plate: string;
  };
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf?: string;
  address?: string;
  createdAt?: string;
}

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export default function DetalhesClientePage() {
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientRes, ordersRes] = await Promise.all([
          api.get<Client>(`/clients/${params.id}`),
          api.get<ServiceOrder[]>(`/clients/${params.id}/orders`),
        ]);

        const sortedOrders = ordersRes.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setClient(clientRes.data);
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Erro ao buscar cliente ou ordens:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        {client && (
          <PageHeader
            title='Detalhes do Cliente'
            subtitle='Informações completas do cliente selecionado.'
            backHref='/clientes'
            editHref={`/clientes/editar/${client.id}`}
            showEdit
            isDetails
          />
        )}

        <section className='bg-DARK_700 rounded-lg p-6 space-y-6'>
          {loading ? (
            <Skeleton className='h-60 w-full' />
          ) : client ? (
            <div className='space-y-6'>
              {client.createdAt && (
                <div className='text-sm text-LIGHT_500'>
                  Criado em:{' '}
                  {format(new Date(client.createdAt), 'dd/MM/yyyy HH:mm', {
                    locale: ptBR,
                  })}
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Nome</h2>
                  <p className='text-lg font-semibold text-LIGHT_100'>
                    {client.name}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Telefone</h2>
                  <p className='text-lg font-semibold  text-LIGHT_100'>
                    {formatPhone(client.phone)}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>E-mail</h2>
                  <p className='text-lg font-semibold  text-LIGHT_100'>
                    {client.email}
                  </p>
                </div>
                {client.cpf && (
                  <div>
                    <h2 className='text-xs text-LIGHT_500 uppercase'>CPF</h2>
                    <p className='text-lg font-semibold  text-LIGHT_100'>
                      {formatCPF(client.cpf)}
                    </p>
                  </div>
                )}
                {client.address && (
                  <div>
                    <h2 className='text-xs text-LIGHT_500 uppercase'>
                      Endereço
                    </h2>
                    <p className='text-lg font-semibold  text-LIGHT_100'>
                      {client.address}
                    </p>
                  </div>
                )}
              </div>

              <hr className='border-DARK_900 my-4' />

              <div>
                <h2 className='text-xs text-LIGHT_500 uppercase mb-4'>
                  Ordens de Serviço
                </h2>
                {orders.length === 0 ? (
                  <p className='text-LIGHT_500 text-xs'>
                    Nenhuma ordem de serviço encontrada.
                  </p>
                ) : (
                  <ul className='space-y-2'>
                    {orders.map((order) => (
                      <li key={order.id}>
                        <a
                          href={`/ordens/${order.id}`}
                          className='text-base border border-DARK_600 rounded p-3 bg-DARK_700 w-full flex justify-between items-start gap-4 hover:bg-DARK_800 transition duration-200'
                        >
                          <div className='text-base text-LIGHT_100 font-semibold '>
                            {format(
                              new Date(order.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              {
                                locale: ptBR,
                              }
                            )}
                          </div>
                          <div className='text-base text-LIGHT_500 text-center flex-1'>
                            {order.complaints}
                          </div>
                          <div
                            className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                              order.status === 'FINALIZADO'
                                ? 'bg-TINTS_MINT_100 text-DARK_100'
                                : 'bg-TINTS_CARROT_100 text-DARK_100'
                            }`}
                          >
                            {order.status}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <p className='text-LIGHT_500'>Cliente não encontrado.</p>
          )}
        </section>
      </main>
    </div>
  );
}
