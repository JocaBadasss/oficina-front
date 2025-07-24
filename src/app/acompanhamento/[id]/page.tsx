// Página pública de acompanhamento da OS
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { mask } from 'remask';
import { format } from 'date-fns';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import StepperMUI from '@/components/Stepper';

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
    publicId: string;
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

        console.log(res.data);
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
      <div className='min-h-screen bg-app-background text-foreground font-poppins'>
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
      <div className='min-h-screen bg-app-background text-foreground p-8'>
        Ordem não encontrada.
      </div>
    );
  }

  const isFinalizado = data.status === 'FINALIZADO';

  return (
    <div className='min-h-screen bg-app-background text-foreground font-poppins'>
      <div className='bg-muted border-b border-muted py-6 px-4 sm:px-6 shadow-md'>
        <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left'>
          {/* Branding */}
          <div className='flex items-center justify-center sm:justify-start gap-3'>
            <Image
              src='/gearIcon.svg'
              alt='Ícone de engrenagem'
              width={40}
              height={40}
            />
            <span className='text-2xl font-bold text-tertiary tracking-wide'>
              OFICINA
            </span>
          </div>

          {/* Saudação */}
          <div className='space-y-1'>
            <p className='text-sm sm:text-base font-semibold'>
              Olá, {data.client.name.split(' ')[0]}!
            </p>
            <p className='text-sm text-soft-foreground leading-snug'>
              Acompanhe abaixo o status do serviço do seu veículo.
            </p>
          </div>
        </div>
      </div>

      <main className='p-6 max-w-5xl mx-auto mb-0'>
        <header className='mb-8 space-y-4 text-center'>
          <h1 className='text-4xl font-bold font-roboto'>Acompanhamento</h1>
          {!isFinalizado && (
            <p className='text-placeholder text-base'>
              Seu veículo está em manutenção. Acompanhe o andamento abaixo.
            </p>
          )}
          <StepperMUI currentStatus={data.status} />
          {isFinalizado && (
            <div className='mt-6 p-4 rounded-lg bg-success/10 border border-success text-success text-sm font-medium text-center'>
              Seu veículo está pronto para retirada. Entre em contato com a
              oficina para agendar a entrega!
            </div>
          )}
        </header>

        <div className='bg-muted rounded-xl p-6 mb-6'>
          <div className='p-4'>
            <p className='text-xl font-bold text-tertiary mb-1'>Cliente</p>
            <p className='text-lg font-medium'>{data.client.name}</p>
            <p className='text-sm text-subtle-foreground'>
              {mask(data.client.phone, ['(99) 99999-9999'])}
            </p>
          </div>
        </div>

        <section className='bg-muted rounded-lg p-6 space-y-6'>
          <div className='grid md:grid-cols-2 gap-4 p-4'>
            <div>
              <h2 className='text-sm text-subtle-foreground uppercase'>
                Status
              </h2>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded uppercase whitespace-nowrap ${
                  isFinalizado
                    ? 'bg-success text-tertiary-foreground'
                    : 'bg-tertiary text-tertiary-foreground'
                }`}
              >
                {statusLabels[data.status] || data.status}
              </span>
            </div>
            <div>
              <h2 className='text-sm text-subtle-foreground uppercase'>
                Data de abertura
              </h2>
              <p>{format(new Date(data.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>

          <div className='bg-background border border-border rounded-lg p-4 space-y-2 '>
            <h2 className='text-sm text-subtle-foreground uppercase'>
              Veículo
            </h2>
            <p className='text-lg font-semibold text-secondary-highlight'>
              {data.vehicle.plate}
            </p>
            <p className='text-sm '>
              {data.vehicle.model} ({data.vehicle.brand})
            </p>
          </div>

          <div className='bg-background border border-border rounded-lg p-4 space-y-2'>
            <h2 className='text-sm text-subtle-foreground uppercase mb-1'>
              Reclamações
            </h2>
            <p className='text-base text-soft-foreground'>{data.complaints}</p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            {[
              {
                label: 'KM',
                value: data.km ? `${data.km.toLocaleString()} km` : '—',
              },
              {
                label: 'Combustível',
                value: fuelLevelLabels[data.fuelLevel ?? ''] || '—',
              },
              { label: 'Adblue', value: data.adblueLevel || '—' },
              { label: 'Pneus', value: data.tireStatus || '—' },
              { label: 'Espelhos', value: data.mirrorStatus || '—' },
              { label: 'Pintura', value: data.paintingStatus || '—' },
            ].map((item, i) => (
              <div
                key={i}
                className='bg-background p-4 rounded-lg border border-border'
              >
                <p className='text-xs text-subtle-foreground uppercase'>
                  {item.label}
                </p>
                <p className='text-base font-semibold'>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='bg-muted rounded-lg p-6 space-y-4 mt-6'>
          <h2 className='text-sm text-subtle-foreground uppercase mb-2'>
            Fotos
          </h2>
          {data.photos && data.photos.length > 0 ? (
            <>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {data.photos.map((photo, index) => (
                  <div
                    key={`${photo.filename}-${index}`}
                    className='rounded overflow-hidden border border-border cursor-pointer relative group'
                    onClick={() => setLightboxIndex(index)}
                  >
                    <Image
                      src={`https://rech.gumlet.io/${photo.publicId}`}
                      alt={photo.filename}
                      width={400}
                      height={300}
                      className='object-cover w-full h-48'
                    />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-foreground text-xs font-medium'>
                      Clique para ampliar
                    </div>
                  </div>
                ))}
              </div>
              <Lightbox
                open={lightboxIndex !== null}
                close={() => setLightboxIndex(null)}
                slides={data.photos.map((photo) => ({
                  src: `https://rech.gumlet.io/${photo.publicId}.jpeg`,
                }))}
                index={lightboxIndex ?? 0}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                carousel={{ finite: true }}
              />
            </>
          ) : (
            <p className='text-subtle-foreground italic'>
              Ainda não há fotos anexadas.
            </p>
          )}
        </section>

        <section className='bg-muted rounded-lg p-6 mt-6'>
          <h2 className='text-sm text-subtle-foreground uppercase mb-4 flex items-center gap-2'>
            <span className='inline-block w-2 h-2 bg-tertiary rounded-full'></span>
            Relatório Final
          </h2>

          {data.report ? (
            <div className='bg-background border border-border rounded-lg p-4 space-y-2'>
              <p className='text-base text-soft-foreground'>
                {data.report.description}
              </p>
              <p className='text-xs text-subtle-foreground'>
                Adicionado em{' '}
                {format(new Date(data.report.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          ) : (
            <p className='text-subtle-foreground italic'>
              Ainda não foi finalizado.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
