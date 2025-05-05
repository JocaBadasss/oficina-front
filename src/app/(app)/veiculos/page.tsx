'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Aside } from '@/components/Aside';
import { api } from '@/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  createdAt: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    cpf: string | null;
    cnpj: string | null;
    email: string;
    phone: string;
    address: string;
    isExternal: boolean;
    createdAt: string;
  };
}

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

export default function VeiculosPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter((vehicle) => {
    return (
      vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.client?.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Veículos</h1>
            <p className='text-LIGHT_500 mt-1'>
              Gerencie os veículos cadastrados no sistema.
            </p>
          </div>

          <Link
            href='/veiculos/novo'
            className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-TINTS_CARROT_100/90 transition self-start md:self-auto'
          >
            <Plus size={16} /> Novo Veículo
          </Link>
        </header>

        <section className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          <div className='col-span-2'>
            <div className='bg-DARK_700 rounded-lg p-6 space-y-4'>
              <div className='flex items-center gap-2 border border-DARK_900 rounded-md px-3 py-2 bg-DARK_800'>
                <Search
                  size={16}
                  className='text-LIGHT_500'
                />
                <input
                  type='text'
                  placeholder='Buscar veículo...'
                  className='bg-transparent outline-none flex-1 text-sm text-LIGHT_100 placeholder:text-LIGHT_500'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <h2 className='text-xl font-semibold'>Lista de Veículos</h2>

              {loading ? (
                <div className='space-y-2'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                </div>
              ) : filtered.length === 0 ? (
                <p className='text-LIGHT_500'>Nenhum veículo encontrado.</p>
              ) : (
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm bg-DARK_800 rounded-md'>
                    <thead>
                      <tr className='text-left text-LIGHT_500'>
                        <th className='py-2 px-4'>Placa</th>
                        <th className='py-2 px-4'>Modelo</th>
                        <th className='py-2 px-4'>Marca</th>
                        <th className='py-2 px-4'>Cliente</th>
                        <th className='py-2 px-4'></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((vehicle) => (
                        <tr
                          key={vehicle.id}
                          className='border-t border-DARK_900 hover:bg-DARK_900 transition'
                        >
                          <td className='py-2 px-4 text-TINTS_CAKE_200 font-semibold'>
                            {vehicle.plate}
                          </td>
                          <td className='py-2 px-4 text-LIGHT_300'>
                            {vehicle.model}
                          </td>
                          <td className='py-2 px-4 text-LIGHT_500'>
                            {vehicle.brand}
                          </td>
                          <td className='py-2 px-4'>
                            <Link
                              href={`/clientes/${vehicle.clientId}`}
                              className='text-TINTS_CARROT_100 hover:underline'
                            >
                              {vehicle.client?.name}
                            </Link>
                          </td>
                          <td className='py-2 px-4 text-right'>
                            <Link
                              href={`/veiculos/${vehicle.id}`}
                              className='inline-flex items-center gap-1 text-TINTS_CARROT_100 hover:underline text-sm'
                            >
                              Ver detalhes
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className='text-center text-LIGHT_500 py-8'
                          >
                            Nenhum veículo encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className='bg-DARK_700 rounded-lg p-6 col-span-1 flex flex-col justify-between items-center relative overflow-hidden h-44'>
            <div className='w-full text-center'>
              <h2 className='text-sm text-LIGHT_500 uppercase tracking-wide'>
                Veículos Cadastrados
              </h2>
              {loading ? (
                <Skeleton className='h-8 w-16 mt-2 mx-auto' />
              ) : (
                <p className='text-6xl font-bold text-primary mt-1'>
                  {vehicles.length}
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
