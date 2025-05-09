'use client';

import { useEffect, useState } from 'react';
import { Aside } from '@/components/Aside';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, CalendarClock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Agendamentos</h1>
            <p className='text-LIGHT_500 mt-1'>
              Gerencie os agendamentos cadastrados.
            </p>
          </div>
          <Link
            href='/agendamentos/novo'
            className='w-full sm:w-auto bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-TINTS_CARROT_100/90 transition'
          >
            <Plus size={16} /> Novo Agendamento
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
                      className='border border-DARK_600 rounded-md p-4 bg-DARK_800 hover:bg-DARK_900 transition'
                    >
                      <Link
                        href={`/agendamentos/${appt.id}`}
                        className='block'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='text-sm text-LIGHT_500'>
                            {format(
                              new Date(appt.createdAt),
                              "dd 'de' MMMM 'de' yyyy",
                              {
                                locale: ptBR,
                              }
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded uppercase whitespace-nowrap ${
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

                        <p className='mt-1 font-semibold text-LIGHT_100'>
                          {appt.vehicle.plate} — {appt.vehicle.model} (
                          {appt.vehicle.brand})
                        </p>
                        <p className='text-sm text-LIGHT_500'>
                          Cliente: {appt.vehicle.client.name}
                        </p>
                        {appt.notes && (
                          <p className='text-sm text-LIGHT_300 mt-1'>
                            {appt.notes}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className='bg-DARK_700 rounded-lg p-6 col-span-1 flex flex-col justify-center items-center gap-4 h-44 text-center'>
            <CalendarClock
              size={32}
              className='text-TINTS_CARROT_100'
            />
            <div>
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
    </div>
  );
}
