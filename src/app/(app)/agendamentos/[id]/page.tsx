'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
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
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Agendamento'
          subtitle='Informações completas do agendamento.'
          backHref='/agendamentos'
          isDetails
        />

        <section className='bg-muted rounded-lg p-6 space-y-4 border border-border'>
          {loading || !appointment ? (
            <div className='space-y-2'>
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='text-sm text-subtle-foreground'>
                Agendado para:{' '}
                {format(new Date(appointment.date), "dd/MM/yyyy 'ás'  HH:mm", {
                  locale: ptBR,
                })}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    Cliente
                  </h2>
                  <p className='text-lg font-semibold text-foreground'>
                    {appointment.vehicle.client.name}
                  </p>
                </div>

                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    Placa
                  </h2>
                  <p className='text-lg font-semibold text-foreground'>
                    {appointment.vehicle.plate}
                  </p>
                </div>

                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    Veículo
                  </h2>
                  <p className='text-lg font-medium text-foreground'>
                    {appointment.vehicle.model} ({appointment.vehicle.brand})
                  </p>
                </div>

                <div>
                  <h2 className='text-xs text-subtle-foreground uppercase'>
                    Status
                  </h2>
                  <p
                    className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                      appointment.status === 'CONFIRMADO'
                        ? 'bg-success text-success-foreground'
                        : appointment.status === 'CANCELADO'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-tertiary text-tertiary-foreground'
                    }`}
                  >
                    {statusLabels[appointment.status] || appointment.status}
                  </p>
                </div>
              </div>

              {appointment.notes && (
                <div>
                  <h2 className='text-sm text-subtle-foreground uppercase mb-1'>
                    Observações
                  </h2>
                  <p className='text-sm text-soft-foreground'>
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
