'use client';

import { useEffect, useState } from 'react';
import { mask } from 'remask';
import { Plus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';
import Link from 'next/link';
import { User, Phone, Calendar, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';

interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get<Client[]>('/clients');
        setClients(response.data);
        
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <main className='flex-1 p-4 sm:p-6 space-y-6 w-full'>
        <PageHeader
          title='Clientes'
          subtitle='Gerencie todos os seus clientes.'
          rightSlot={
            <Link
              href='/clientes/novo'
              className='bg-highlight text-muted-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-highlight/90 transition text-sm sm:text-base self-start sm:self-auto w-full justify-center'
            >
              <Plus size={16} /> Adicionar Cliente
            </Link>
          }
          backHref='/painel'
        />

        <section className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start '>
          {/* Lista de Clientes */}
          <div className='col-span-1 xl:col-span-2 '>
            <div className='bg-muted rounded-lg p-4 sm:p-6 space-y-4 border borde-border'>
              <div className='flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background focus-within:ring-2 ring-highlight transition'>
                <Search
                  size={16}
                  className='text-subtle-foreground'
                />
                <input
                  type='text'
                  placeholder='Buscar cliente...'
                  className='bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-placeholder'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <h2 className='text-lg sm:text-xl font-semibold text-foreground'>
                Lista de Clientes
              </h2>

              {loading ? (
                <div className='space-y-2'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                </div>
              ) : filteredClients.length === 0 ? (
                <p className='text-subtle-foreground text-sm'>
                  Nenhum cliente encontrado.
                </p>
              ) : (
                <ul className='space-y-4'>
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      className='bg-background rounded-xl border border-accent p-4 shadow-sm hover:bg-hover transition flex flex-col gap-4'
                    >
                      <Link
                        href={`/clientes/${client.id}`}
                        className='block space-y-4'
                      >
                        {/* Nome do cliente */}
                        <div className='flex items-start gap-3'>
                          <User
                            size={20}
                            className='text-highlight mt-0.5'
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm text-subtle-foreground'>
                              Nome
                            </p>
                            <p className='text-lg font-semibold text-secondary-highlight truncate'>
                              {client.name}
                            </p>
                          </div>
                        </div>

                        {/* Telefone */}
                        <div className='flex items-start gap-3'>
                          <Phone
                            size={20}
                            className='text-highlight mt-0.5'
                          />
                          <div className='flex-1'>
                            <p className='text-sm text-subtle-foreground'>
                              Telefone
                            </p>
                            <p className='text-sm text-foreground truncate'>
                              {mask(client.phone, '(99) 99999-9999')}
                            </p>
                          </div>
                        </div>

                        {/* Data de cadastro */}
                        <div className='flex items-start gap-3'>
                          <Calendar
                            size={20}
                            className='text-highlight mt-0.5'
                          />
                          <div>
                            <p className='text-sm text-subtle-foreground'>
                              Cadastrado em
                            </p>
                            <p className='text-sm text-softForeground'>
                              {new Date(client.createdAt).toLocaleDateString(
                                'pt-BR'
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Link de ação */}
                        <div className='flex justify-end pt-3 border-t border-border mt-2'>
                          <span className='inline-flex items-center gap-1 text-sm font-semibold text-highlight hover:underline'>
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

          {/* Total de Clientes com gráfico */}
          <div className='bg-muted rounded-lg p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-hidden min-h-44 border borde-border'>
            <div className='w-full text-center'>
              <h2 className='text-sm text-subtle-foreground uppercase tracking-wide'>
                Clientes Cadastrados
              </h2>
              {loading ? (
                <Skeleton className='h-8 w-16 mt-2 mx-auto' />
              ) : (
                <p className='text-5xl sm:text-6xl font-bold text-primary mt-1'>
                  {clients.length}
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
                    stroke='#F4B400'
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
