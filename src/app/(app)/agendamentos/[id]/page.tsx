'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { Aside } from '@/components/Aside';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function DetalhesAgendamentoPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/appointments/${id}`);
        setAppointment(response.data);
      } catch (err) {
        console.error('Erro ao buscar agendamento:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Agendamento</h1>
            <p className='text-LIGHT_500 mt-1'>
              Informações completas do agendamento.
            </p>
          </div>

          <Link
            href='/agendamentos'
            className='w-full sm:w-auto bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10 transition flex items-center justify-center gap-2'
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </header>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
          {loading || !appointment ? (
            <div className='space-y-2'>
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='text-sm text-LIGHT_500'>
                Criado em:{' '}
                {format(new Date(appointment.createdAt), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR,
                })}
                <br />
                Agendado para:{' '}
                {format(new Date(appointment.date), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR,
                })}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Cliente</h2>
                  <p className='text-lg font-semibold text-LIGHT_100'>
                    {appointment.vehicle.client.name}
                  </p>
                </div>

                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Placa</h2>
                  <p className='text-lg font-semibold text-LIGHT_100'>
                    {appointment.vehicle.plate}
                  </p>
                </div>

                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Veículo</h2>
                  <p className='text-lg font-medium text-LIGHT_100'>
                    {appointment.vehicle.model} ({appointment.vehicle.brand})
                  </p>
                </div>

                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Status</h2>
                  <p
                    className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                      appointment.status === 'CONFIRMADO'
                        ? 'bg-TINTS_MINT_100 text-DARK_100'
                        : appointment.status === 'CANCELADO'
                        ? 'bg-TINTS_TOMATO_200 text-LIGHT_100'
                        : 'bg-TINTS_CARROT_100 text-DARK_100'
                    }`}
                  >
                    {statusLabels[appointment.status] || appointment.status}
                  </p>
                </div>
              </div>

              {appointment.notes && (
                <div>
                  <h2 className='text-sm text-LIGHT_500 uppercase mb-1'>
                    Observações
                  </h2>
                  <p className='text-sm text-LIGHT_300'>{appointment.notes}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
