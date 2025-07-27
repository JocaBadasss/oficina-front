'use client';

import { useEffect, useState } from 'react';
import { Car, User, ArrowRight, Plus, Search, SquareStack } from 'lucide-react';
import { api } from '@/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import { formatPlate, formatVehicleInfo } from '@/utils/helpers/vehicles';

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

  const router = useRouter();

  const COLORS = ['hsl(var(--tertiary))'];

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
    const searchLower = search.toLowerCase();

    return (
      vehicle.plate?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.brand?.toLowerCase().includes(searchLower) ||
      vehicle.client?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Veículos'
          subtitle='Gerencie os veículos cadastrados no sistema.'
          rightSlot={
            <Link
              href='/veiculos/novo'
              className='bg-tertiary text-tertiary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-tertiary/90 transition text-sm sm:text-base self-start sm:self-auto w-full justify-center'
            >
              <Plus size={16} /> Adicionar Veículo
            </Link>
          }
          backHref='/painel'
        />

        <section className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>
          <div className='sm:col-span-1 xl:col-span-2'>
            <div className='bg-muted rounded-lg p-6 space-y-4 border borde-border'>
              <div className='flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background '>
                <Search
                  size={16}
                  className='text-subtle-foreground'
                />
                <input
                  type='text'
                  placeholder='Buscar veículo...'
                  className='bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-placeholder'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <h2 className='text-xl font-semibold text-foreground'>
                Lista de Veículos
              </h2>

              {loading ? (
                <div className='space-y-2'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                </div>
              ) : filtered.length === 0 ? (
                <p className='text-subtle-foreground'>
                  Nenhum veículo encontrado.
                </p>
              ) : (
                <ul className='space-y-4'>
                  {filtered.map((vehicle) => (
                    <li
                      key={vehicle.id}
                      className='bg-background rounded-xl border border-border p-4 shadow-sm hover:bg-hover transition flex flex-col gap-4 hover:cursor-pointer'
                      onClick={() => router.push(`/veiculos/${vehicle.id}`)}
                    >
                      {/* Placa */}
                      <div className='flex items-start gap-3'>
                        <Car
                          size={20}
                          className='text-tertiary mt-0.5'
                        />
                        <div className='flex-1'>
                          <p className='text-sm text-subtle-foreground'>
                            Placa
                          </p>
                          <p className='text-base font-semibold text-secondary-highlight truncate'>
                            {formatPlate(vehicle.plate)}
                          </p>
                        </div>
                      </div>

                      {/* Modelo */}
                      <div className='flex items-start gap-3'>
                        <SquareStack
                          size={20}
                          className='text-tertiary mt-0.5'
                        />
                        <div className='flex-1'>
                          <p className='text-sm text-subtle-foreground'>
                            Modelo
                          </p>
                          <p className='text-base font-semibold text-foreground'>
                            {formatVehicleInfo(
                              vehicle.model,
                              vehicle.brand,
                              vehicle.year
                            )}
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
                          <a
                            href={`/clientes/${vehicle.clientId}`}
                            className='text-sm font-medium text-tertiary hover:underline'
                          >
                            {vehicle.client?.name}
                          </a>
                        </div>
                      </div>

                      {/* Link final */}
                      <div className='flex justify-end pt-3 border-t border-border mt-2'>
                        <span className='inline-flex items-center gap-1 text-sm font-semibold text-tertiary hover:underline'>
                          Ver detalhes <ArrowRight size={14} />
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className='bg-muted rounded-lg p-4 sm:p-6 flex flex-col justify-between items-center relative overflow-hidden min-h-44 border borde-border'>
            <div className='w-full text-center'>
              <h2 className='text-sm text-subtle-foreground uppercase tracking-wide'>
                Veículos Cadastrados
              </h2>
              {loading ? (
                <Skeleton className='h-8 w-16 mt-2 mx-auto' />
              ) : (
                <p className='text-5xl sm:text-6xl font-bold text-tertiary mt-1'>
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
                    stroke={COLORS[0]}
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
