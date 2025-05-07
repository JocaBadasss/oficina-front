// Página pública de acompanhamento da OS
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { mask } from 'remask';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import StepperStatus from '@/components/Stepper';

interface TrackingData {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fuelLevel: string | null;
  adblueLevel: string | null;
  km: number | null;
  tireStatus: string | null;
  mirrorStatus: string | null;
  paintingStatus: string | null;
  complaints: string;
  client: {
    name: string;
    phone: string;
  };
  report?: {
    description: string;
    createdAt: string;
  } | null;
  vehicle: {
    plate: string;
    brand: string;
    model: string;
    client?: {
      name: string;
      phone: string;
    };
  };
  photos: {
    filename: string;
    url: string;
  }[];
}

const statusSteps = ['AGUARDANDO', 'EM ANDAMENTO', 'FINALIZADO'];

export default function AcompanhamentoPage() {
  const { id } = useParams();
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTracking() {
      try {
        const res = await api.get(`/tracking/${id}`);
        setData(res.data);
      } catch (error) {
        console.error('Erro ao carregar acompanhamento:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTracking();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
        <main className='p-6 space-y-6 max-w-5xl mx-auto'>
          <Skeleton className='h-12 w-2/3' />
          <Skeleton className='h-6 w-1/2' />
          <Skeleton className='h-80 w-full' />
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='min-h-screen bg-DARK_400 text-LIGHT_100 p-8'>
        Ordem não encontrada.
      </div>
    );
  }

  const isFinalizado = data.status === 'FINALIZADO';

  return (
    <div className='min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <div className='bg-DARK_900 px-6 py-6 shadow-md border-b border-DARK_700'>
        <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2'>
          <div className='flex items-center gap-3'>
            <Image
              src='/gearIcon.svg'
              alt='Ícone de engrenagem'
              width={36}
              height={36}
            />
            <span className='text-2xl font-bold text-TINTS_CARROT_100'>
              OFICINA
            </span>
          </div>
          <p className='text-sm text-LIGHT_300 font-medium'>
            Bem-vindo ao seu acompanhamento de serviço
          </p>
        </div>
      </div>

      <main className='p-6 max-w-5xl mx-auto'>
        <header className='mb-8 space-y-4 text-center'>
          <h1 className='text-4xl font-bold font-roboto text-LIGHT_100'>
            Acompanhamento
          </h1>
          {isFinalizado ? (
            <p className='text-TINTS_MINT_100 font-semibold text-lg'>
              Tudo certo, o seu veículo está pronto para retirada!
            </p>
          ) : (
            <>
              <p className='text-LIGHT_500 text-base'>
                Seu veículo está em manutenção. Acompanhe o andamento abaixo.
              </p>
              <div className='w-full max-w-lg mx-auto mt-2'>
                <StepperStatus
                  currentStatus={
                    data.status as 'AGUARDANDO' | 'EM_ANDAMENTO' | 'FINALIZADO'
                  }
                />
              </div>
            </>
          )}
        </header>

        <div className='bg-DARK_700 rounded-xl p-6 mb-6'>
          <p className='text-xl font-bold text-TINTS_CARROT_100 mb-1'>
            Cliente
          </p>
          <p className='text-lg text-LIGHT_100 font-medium'>
            {data.client.name}
          </p>
          <p className='text-sm text-LIGHT_500'>
            {mask(data.client.phone, ['(99) 99999-9999'])}
          </p>
        </div>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-6'>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <h2 className='text-sm text-LIGHT_500 uppercase'>Status</h2>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded uppercase whitespace-nowrap ${
                  isFinalizado
                    ? 'bg-TINTS_MINT_100 text-DARK_100'
                    : 'bg-TINTS_CARROT_100 text-DARK_100'
                }`}
              >
                {data.status}
              </span>
            </div>
            <div>
              <h2 className='text-sm text-LIGHT_500 uppercase'>
                Data de abertura
              </h2>
              <p>{format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>

          <div>
            <h2 className='text-sm text-LIGHT_500 uppercase mb-1'>Veículo</h2>
            <p className='text-lg font-medium text-LIGHT_100'>
              {data.vehicle.plate} - {data.vehicle.brand} {data.vehicle.model}
            </p>
          </div>

          <div>
            <h2 className='text-sm text-LIGHT_500 uppercase mb-1'>
              Reclamações
            </h2>
            <p className='text-base text-LIGHT_300'>{data.complaints}</p>
          </div>

          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <h3 className='text-sm text-LIGHT_500 uppercase'>KM</h3>
              <p>{data.km ? data.km.toLocaleString('pt-BR') + ' km' : '-'}</p>
            </div>
            <div>
              <h3 className='text-sm text-LIGHT_500 uppercase'>Combustível</h3>
              <p>{data.fuelLevel}</p>
            </div>
            <div>
              <h3 className='text-sm text-LIGHT_500 uppercase'>Adblue</h3>
              <p>{data.adblueLevel}</p>
            </div>
            <div>
              <h3 className='text-sm text-LIGHT_500 uppercase'>Pneus</h3>
              <p>{data.tireStatus}</p>
            </div>
            <div>
              <h3 className='text-sm text-LIGHT_500 uppercase'>Espelhos</h3>
              <p>{data.mirrorStatus}</p>
            </div>
            <div>
              <h3 className='text-sm text-LIGHT_500 uppercase'>Pintura</h3>
              <p>{data.paintingStatus}</p>
            </div>
          </div>
        </section>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4 mt-6'>
          <h2 className='text-sm text-LIGHT_500 uppercase mb-2'>Fotos</h2>
          {data.photos.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
              {data.photos.map((photo) => (
                <div
                  key={photo.filename}
                  className='rounded overflow-hidden border border-DARK_900'
                >
                  <Image
                    src={photo.url}
                    alt={photo.filename}
                    width={400}
                    height={300}
                    className='object-cover w-full h-48'
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className='text-LIGHT_500 italic'>
              Ainda não há fotos anexadas.
            </p>
          )}
        </section>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4 mt-6'>
          <h2 className='text-sm text-LIGHT_500 uppercase'>Relatório Final</h2>
          {data.report ? (
            <div className='space-y-2'>
              <p>{data.report.description}</p>
              <p className='text-xs text-LIGHT_500'>
                Adicionado em{' '}
                {format(new Date(data.report.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          ) : (
            <p className='text-LIGHT_500 italic'>Ainda não foi finalizado.</p>
          )}
        </section>
      </main>
    </div>
  );
}
