'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Aside } from '@/components/Aside';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Cliente</h1>
            <p className='text-LIGHT_500 mt-1'>
              Gerencie as informações do cliente.
            </p>
          </div>

          {client && (
            <a
              href={`/clientes/${client.id}/editar`}
              className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg text-base hover:bg-TINTS_CARROT_100/90 transition self-start md:self-auto'
            >
              Editar
            </a>
          )}
        </header>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-6'>
          {loading ? (
            <Skeleton className='h-60 w-full' />
          ) : client ? (
            <>
              <div>
                <h3 className='text-sm text-LIGHT_500 uppercase mb-4'>
                  Informações de Contato
                </h3>
                <h2 className='text-3xl font-bold font-roboto mb-6'>
                  {client.name}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm mb-10'>
                  <div>
                    <span className='text-LIGHT_500 uppercase text-base'>
                      Telefone
                    </span>
                    <div>{formatPhone(client.phone)}</div>
                  </div>
                  <div>
                    <span className='text-LIGHT_500 uppercase text-base'>
                      E-mail
                    </span>
                    <div>{client.email}</div>
                  </div>
                  {client.cpf && (
                    <div>
                      <span className='text-LIGHT_500 uppercase text-base'>
                        CPF
                      </span>
                      <div>{formatCPF(client.cpf)}</div>
                    </div>
                  )}
                  {client.address && (
                    <div>
                      <span className='text-LIGHT_500 uppercase text-base'>
                        Endereço
                      </span>
                      <div>{client.address}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='border-t border-DARK_600 pt-6'>
                <h3 className='text-lg text-LIGHT_200 uppercase mb-4'>
                  Ordens de Serviço
                </h3>
                {orders.length === 0 ? (
                  <p className='text-LIGHT_500 text-sm text-center lg:text-left'>
                    Nenhuma ordem de serviço
                  </p>
                ) : (
                  <ul className='space-y-2'>
                    {orders.map((order) => (
                      <li key={order.id}>
                        <a
                          href={`/ordens/${order.id}`}
                          className=' text-sm border border-DARK_600 rounded p-3 bg-DARK_700 w-full flex justify-between items-start gap-4 hover:bg-DARK_800 transition duration-200'
                        >
                          <div className='text-LIGHT_100 font-medium'>
                            {format(
                              new Date(order.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              { locale: ptBR }
                            )}
                          </div>
                          <div className='text-LIGHT_500 text-center flex-1'>
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
            </>
          ) : (
            <p className='text-LIGHT_500'>Cliente não encontrado.</p>
          )}
        </section>
      </main>
    </div>
  );
}
