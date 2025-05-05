'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Aside } from '@/components/Aside';
import { api } from '@/services/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

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
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>
              Detalhes do Veículo
            </h1>
            <p className='text-LIGHT_500 mt-1'>
              Informações completas do veículo selecionado.
            </p>
          </div>

          <div className='flex items-center gap-2'>
            {vehicle && (
              <a
                href={`/veiculos/editar/${vehicle.id}`}
                className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg text-base hover:bg-TINTS_CARROT_100/90 transition'
              >
                Editar
              </a>
            )}
            <Link
              href='/veiculos'
              className='bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10 transition flex items-center gap-2'
            >
              <ArrowLeft size={16} /> Voltar
            </Link>
          </div>
        </header>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
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
                  <h2 className='text-sm text-LIGHT_500 uppercase'>Placa</h2>
                  <p className='text-lg font-semibold text-TINTS_CAKE_200'>
                    {vehicle.plate}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-LIGHT_500 uppercase'>Ano</h2>
                  <p className='text-lg font-medium text-LIGHT_100'>
                    {vehicle.year}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-LIGHT_500 uppercase'>Marca</h2>
                  <p className='text-lg font-medium text-LIGHT_100'>
                    {vehicle.brand}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-LIGHT_500 uppercase'>Modelo</h2>
                  <p className='text-lg font-medium text-LIGHT_100'>
                    {vehicle.model}
                  </p>
                </div>
                <div>
                  <h2 className='text-sm text-LIGHT_500 uppercase'>
                    Adicionado em
                  </h2>
                  <p className='text-lg font-medium text-LIGHT_100'>
                    {format(new Date(vehicle.createdAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <hr className='border-DARK_900 my-4' />

              <div>
                <h2 className='text-sm text-LIGHT_500 uppercase mb-1'>
                  Cliente
                </h2>
                <Link
                  href={`/clientes/${vehicle.clientId}`}
                  className='block text-lg font-semibold text-TINTS_CARROT_100 hover:underline'
                >
                  {vehicle.client.name}
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
