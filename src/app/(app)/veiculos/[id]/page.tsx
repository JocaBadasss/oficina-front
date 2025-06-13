'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatPlate } from '@/utils/helpers/vehicles';

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

export default function DetalhesVeiculoPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await api.get(`/vehicles/${id}`);
        setVehicle(response.data);
      } catch (error) {
        console.error('Erro ao carregar veículo:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Detalhes do Veículo'
          subtitle='Informações completas do veículo selecionado.'
          backHref='/veiculos'
          editHref={`/veiculos/editar/${vehicle?.id}`}
          showEdit
          isDetails
        />

        <section className='bg-muted rounded-lg p-6 space-y-4 border border-border'>
          {loading || !vehicle ? (
            <div className='space-y-2'>
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-6 w-1/4' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h2 className='text-sm text-subtle-foreground uppercase'>
                    Placa
                  </h2>
                  <p className='text-lg font-semibold text-secondary-highlight'>
                    {formatPlate(vehicle.plate)}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-subtle-foreground uppercase'>
                    Ano
                  </h2>
                  <p className='text-lg font-medium text-foreground'>
                    {vehicle.year || '-'}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-subtle-foreground uppercase'>
                    Marca
                  </h2>
                  <p className='text-lg font-medium text-foreground'>
                    {vehicle.brand || '-'}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-subtle-foreground uppercase'>
                    Modelo
                  </h2>
                  <p className='text-lg font-medium text-foreground'>
                    {vehicle.model || '-'}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-subtle-foreground uppercase'>
                    Adicionado em
                  </h2>
                  <p className='text-lg font-medium text-foreground'>
                    {format(new Date(vehicle.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <hr className='border-border my-4' />

              <div>
                <h2 className='text-sm text-subtle-foreground uppercase mb-1'>
                  Cliente
                </h2>
                <Link
                  href={`/clientes/${vehicle.clientId}`}
                  className='block text-lg font-semibold text-tertiary hover:underline'
                >
                  {vehicle.client.name}
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
