'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatCpfOrCnpj } from '@/utils/helpers/clients';

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
  cpfOrCnpj?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  AGUARDANDO: 'Aguardando',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
};

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

        console.log(clientRes.data);

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
    <AppLayout>
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

        {client && (
          <div className='flex justify-between items-center mb-4 px-4 text-sm text-subtle-foreground'>
            <div className='flex flex-wrap gap-6'>
              <span>
                Criado em:{' '}
                {format(new Date(client.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        )}

        <section className='bg-muted rounded-lg p-6 space-y-6 border-border border'>
          {loading ? (
            <Skeleton className='h-60 w-full' />
          ) : client ? (
            <div className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    Nome
                  </h2>
                  <p className='text-lg font-semibold text-foreground'>
                    {client.name}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    Telefone
                  </h2>
                  <p className='text-lg font-semibold  text-foreground'>
                    {formatPhone(client.phone)}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    E-mail
                  </h2>
                  <p className='text-lg font-semibold  text-foreground'>
                    {client.email}
                  </p>
                </div>
                {client.cpfOrCnpj && (
                  <div>
                    <h2 className='text-xs text-subtle-foreground uppercase'>
                      CPF ou CNPJ
                    </h2>
                    <p className='text-lg font-semibold  text-foreground'>
                      {formatCpfOrCnpj(client.cpfOrCnpj)}
                    </p>
                  </div>
                )}
                {client.address && (
                  <div>
                    <h2 className='text-xs text-subtle-foreground uppercase'>
                      Endereço
                    </h2>
                    <p className='text-lg font-semibold  text-foreground'>
                      {client.address}
                    </p>
                  </div>
                )}
              </div>

              <hr className='border-border my-4' />

              <div>
                <h2 className='text-xs text-subtle-foreground uppercase mb-4'>
                  Ordens de Serviço
                </h2>
                {orders.length === 0 ? (
                  <p className='text-subtle-foreground text-xs'>
                    Nenhuma ordem de serviço encontrada.
                  </p>
                ) : (
                  <ul className='space-y-2'>
                    {orders.map((order) => (
                      <li key={order.id}>
                        <a
                          href={`/ordens/${order.id}`}
                          className='text-base border border-border rounded p-3 bg-muted w-full flex justify-between items-start gap-4 hover:bg-hover transition duration-200'
                        >
                          <div className='text-base text-foreground font-semibold '>
                            {format(
                              new Date(order.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              {
                                locale: ptBR,
                              }
                            )}
                          </div>
                          <div className='text-base text-softForeground text-center flex-1'>
                            {order.complaints}
                          </div>
                          <div
                            className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                              order.status === 'FINALIZADO'
                                ? 'bg-success text-tertiary-foreground'
                                : 'bg-tertiary text-tertiary-foreground'
                            }`}
                          >
                            {statusLabels[order.status]}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <p className='text-subtle-foreground'>Cliente não encontrado.</p>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
