'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Car, User, ClipboardList, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';

interface Appointment {
  id: string;
  date: string;
  status: string;
  notes?: string;
  createdAt: string;
  vehicle: {
    plate: string;
    brand: string;
    model: string;
    client: {
      name: string;
    };
  };
}

const statusLabels: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
};

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await api.get('/appointments');
        setAppointments(response.data);
      } catch (err) {
        console.error('Erro ao buscar agendamentos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    return (
      appt.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
      appt.vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
      appt.vehicle.client.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const pendingCount = appointments.filter(
    (appt) => appt.status === 'PENDENTE'
  ).length;

  return (
    <AppLayout>


      <main className='flex-1 p-4 sm:p-6 space-y-6 '>
        <PageHeader
          title='Agendamentos'
          subtitle='Gerencie os agendamentos cadastrados.'
          rightSlot={
            <Link
              href='/agendamentos/novo'
              className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-TINTS_CARROT_100/90 transition text-sm sm:text-base self-start sm:self-auto w-full justify-center'
            >
              <Plus size={16} /> Novo Agendamento
            </Link>
          }
          backHref='/painel'
        />

        <section className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>
          <div className='col-span-1 xl:col-span-2'>
            <div className='bg-DARK_700 rounded-lg p-4 space-y-4'>
              <div className='flex items-center gap-2 border border-DARK_900 rounded-md px-3 py-2 bg-DARK_800'>
                <Search
                  size={16}
                  className='text-LIGHT_500'
                />
                <input
                  type='text'
                  placeholder='Buscar agendamento...'
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
              ) : filteredAppointments.length === 0 ? (
                <p className='text-LIGHT_500'>Nenhum agendamento encontrado.</p>
              ) : (
                <ul className='space-y-4'>
                  {filteredAppointments.map((appt) => (
                    <li
                      key={appt.id}
                      className='bg-DARK_800 rounded-xl border border-DARK_600 p-4 shadow-sm hover:bg-DARK_900 transition flex flex-col gap-4'
                    >
                      <Link
                        href={`/agendamentos/${appt.id}`}
                        className='block space-y-4'
                      >
                        {/* Data e Status */}
                        <div className='flex justify-between items-center flex-wrap gap-2'>
                          <div className='flex items-center gap-2 text-sm text-LIGHT_500'>
                            <CalendarClock
                              size={16}
                              className='text-TINTS_CARROT_100'
                            />
                            {format(
                              new Date(appt.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              {
                                locale: ptBR,
                              }
                            )}
                          </div>

                          <span
                            className={`text-[10px] font-semibold px-3 py-1 rounded capitalize w-fit
              ${
                appt.status === 'CONFIRMADO'
                  ? 'bg-TINTS_MINT_100 text-DARK_100'
                  : appt.status === 'CANCELADO'
                  ? 'bg-TINTS_TOMATO_200 text-LIGHT_100'
                  : 'bg-TINTS_CARROT_100 text-DARK_100'
              }`}
                          >
                            {statusLabels[appt.status] || appt.status}
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
                              {appt.vehicle.plate}
                            </p>
                            <p className='text-sm text-LIGHT_100'>
                              {appt.vehicle.model} ({appt.vehicle.brand})
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
                              {appt.vehicle.client.name}
                            </p>
                          </div>
                        </div>

                        {/* Observações */}
                        {appt.notes && (
                          <div className='flex items-start gap-3'>
                            <ClipboardList
                              size={20}
                              className='text-TINTS_CARROT_100 mt-0.5'
                            />
                            <div className='flex-1'>
                              <p className='text-sm text-LIGHT_500'>
                                Observações
                              </p>
                              <p className='text-sm text-LIGHT_300 leading-snug'>
                                {appt.notes}
                              </p>
                            </div>
                          </div>
                        )}

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
            </div>
          </div>

          <div className='bg-DARK_700  rounded-lg p-4 sm:p-6  flex flex-col justify-center items-center gap-4 min-h-44 text-center '>
            <CalendarClock
              size={32}
              className='text-TINTS_CARROT_100'
            />
            <div className='w-full text-center'>
              <h2 className='text-sm text-LIGHT_500 uppercase tracking-wide'>
                Agendamentos Pendentes
              </h2>
              {loading ? (
                <Skeleton className='h-8 w-16 mt-2 mx-auto' />
              ) : (
                <p className='text-4xl font-bold text-primary mt-1'>
                  {pendingCount}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
