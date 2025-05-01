'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Aside } from '@/components/Aside';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { api } from '@/services/api';
import Link from 'next/link';

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
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Clientes</h1>
            <p className='text-LIGHT_500 mt-1'>
              Gerencie todos os seus clientes.
            </p>
          </div>
          <Link
            href='/clientes/novo'
            className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-TINTS_CARROT_100/90 transition self-start md:self-auto'
          >
            <Plus size={16} /> Adicionar Cliente
          </Link>
        </header>

        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          {/* Lista de Clientes */}
          <div className='col-span-2'>
            <div className='bg-DARK_700 rounded-lg p-6 space-y-4'>
              <div className='flex items-center gap-2 border border-DARK_900 rounded-md px-3 py-2 bg-DARK_800'>
                <Search
                  size={16}
                  className='text-LIGHT_500'
                />
                <input
                  type='text'
                  placeholder='Buscar cliente...'
                  className='bg-transparent outline-none flex-1 text-sm text-LIGHT_100 placeholder:text-LIGHT_500'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <h2 className='text-xl font-semibold'>Lista de Clientes</h2>

              {loading ? (
                <div className='space-y-2'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                </div>
              ) : filteredClients.length === 0 ? (
                <p className='text-LIGHT_500'>Nenhum cliente encontrado.</p>
              ) : (
                <ul className='divide-y divide-LIGHT_700'>
                  {filteredClients.map((client) => (
                    <li
                      key={client.id}
                      className='py-3 flex justify-between items-center hover:bg-DARK_800 px-2 rounded transition'
                    >
                      <div>
                        <p className='font-medium text-LIGHT_100'>
                          {client.name}
                        </p>
                        <p className='text-sm text-LIGHT_500'>{client.phone}</p>
                      </div>
                      <a
                        href={`/clientes/${client.id}`}
                        className='text-sm text-TINTS_CARROT_100 hover:underline'
                      >
                        Ver detalhes
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Total de Clientes com gráfico */}
          <div className='bg-DARK_700 rounded-lg p-6 col-span-1 flex flex-col justify-between items-center relative overflow-hidden min-h-44'>
            <div className='w-full text-center'>
              <h2 className='text-sm text-LIGHT_500 uppercase tracking-wide'>
                Clientes Cadastrados
              </h2>
              {loading ? (
                <Skeleton className='h-8 w-16 mt-2 mx-auto' />
              ) : (
                <p className='text-6xl font-bold text-primary mt-1'>
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
    </div>
  );
}
