// Página pública de acompanhamento da OS
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { mask } from 'remask';
import { format } from 'date-fns';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import StepperStatus, { StepperMUI } from '@/components/Stepper';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

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

const statusLabels: Record<string, string> = {
  AGUARDANDO: 'Aguardando',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
};

const fuelLevelLabels: Record<string, string> = {
  RESERVA: 'Reserva',
  QUARTO: '1/4',
  METADE: 'Metade',
  TRES_QUARTOS: '3/4',
  CHEIO: 'Cheio',
};

export default function AcompanhamentoPage() {
  const { id } = useParams();
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      <div className='bg-DARK_900 border-b border-DARK_700 py-6 px-4 sm:px-6 shadow-md'>
        <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left'>
          {/* Branding */}
          <div className='flex items-center justify-center sm:justify-start gap-3'>
            <Image
              src='/gearIcon.svg'
              alt='Ícone de engrenagem'
              width={40}
              height={40}
            />
            <span className='text-2xl font-bold text-TINTS_CARROT_100 tracking-wide'>
              OFICINA
            </span>
          </div>

          {/* Saudação */}
          <div className='space-y-1'>
            <p className='text-sm sm:text-base text-LIGHT_100 font-semibold'>
              Olá, {data.client.name.split(' ')[0]}!
            </p>
            <p className='text-sm text-LIGHT_300 leading-snug'>
              Acompanhe abaixo o status do serviço do seu veículo.
            </p>
          </div>
        </div>
      </div>

      <main className='p-6 max-w-5xl mx-auto mb-0'>
        <header className='mb-8 space-y-4 text-center'>
          <h1 className='text-4xl font-bold font-roboto text-LIGHT_100'>
            Acompanhamento
          </h1>
          {!isFinalizado && (
            <p className='text-LIGHT_500 text-base'>
              Seu veículo está em manutenção. Acompanhe o andamento abaixo.
            </p>
          )}
          <StepperMUI currentStatus={data.status} />
          {isFinalizado && (
            <div className='mt-6 p-4 rounded-lg bg-TINTS_MINT_100/10 border border-TINTS_MINT_100 text-TINTS_MINT_100 text-sm font-medium text-center'>
              Seu veículo está pronto para retirada. Entre em contato com a
              oficina para agendar a entrega!
            </div>
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
                {statusLabels[data.status] || data.status}
              </span>
            </div>
            <div>
              <h2 className='text-sm text-LIGHT_500 uppercase'>
                Data de abertura
              </h2>
              <p>{format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>

          <div className='bg-DARK_800 border border-DARK_600 rounded-lg p-4 space-y-2'>
            <h2 className='text-sm text-LIGHT_500 uppercase'>Veículo</h2>
            <p className='text-lg font-semibold text-TINTS_CAKE_200'>
              {data.vehicle.plate}
            </p>
            <p className='text-sm text-LIGHT_100'>
              {data.vehicle.model} ({data.vehicle.brand})
            </p>
          </div>

          <div>
            <h2 className='text-sm text-LIGHT_500 uppercase mb-1'>
              Reclamações
            </h2>
            <p className='text-base text-LIGHT_300'>{data.complaints}</p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {[
              {
                label: 'KM',
                value: data.km ? `${data.km.toLocaleString()} km` : '—',
              },
              {
                label: 'Combustível',
                value: fuelLevelLabels[data.fuelLevel] || '—',
              },
              { label: 'Adblue', value: data.adblueLevel || '—' },
              { label: 'Pneus', value: data.tireStatus || '—' },
              { label: 'Espelhos', value: data.mirrorStatus || '—' },
              { label: 'Pintura', value: data.paintingStatus || '—' },
            ].map((item, i) => (
              <div
                key={i}
                className='bg-DARK_800 p-4 rounded-lg border border-DARK_600'
              >
                <p className='text-xs text-LIGHT_500 uppercase'>{item.label}</p>
                <p className='text-base font-semibold text-LIGHT_100'>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4 mt-6'>
          <h2 className='text-sm text-LIGHT_500 uppercase mb-2'>Fotos</h2>
          {data.photos && data.photos.length > 0 ? (
            <>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {data.photos.map((photo, index) => (
                  <div
                    key={`${photo.filename}-${index}`}
                    className='rounded overflow-hidden border border-DARK_900 cursor-pointer relative group'
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.filename}
                      width={400}
                      height={300}
                      className='object-cover w-full h-48'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium'>
                      Clique para ampliar
                    </div>
                  </div>
                ))}
              </div>
              <Lightbox
                open={lightboxIndex !== null}
                close={() => setLightboxIndex(null)}
                slides={data.photos.map((photo) => ({ src: photo.url }))}
                index={lightboxIndex ?? 0}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                carousel={{ finite: true }}
              />
            </>
          ) : (
            <p className='text-LIGHT_500 italic'>
              Ainda não há fotos anexadas.
            </p>
          )}
        </section>

        <section className='bg-DARK_700 rounded-lg p-6 mt-6'>
          <h2 className='text-sm text-LIGHT_500 uppercase mb-4 flex items-center gap-2'>
            <span className='inline-block w-2 h-2 bg-TINTS_CARROT_100 rounded-full'></span>
            Relatório Final
          </h2>

          {data.report ? (
            <div className='bg-DARK_800 border border-DARK_600 rounded-lg p-4 space-y-2'>
              <p className='text-base text-LIGHT_300'>
                {data.report.description}
              </p>
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
