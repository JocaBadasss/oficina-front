'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatModelBrand } from '@/utils/helpers/vehicles';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import { FinalizarAtendimentoModal } from '@/components/FinalizeOrderModal';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/styles.css';
import {
  AlertCircle,
  Notebook,
  CheckCircle,
  Clock,
  User,
  Car,
  Tag,
  Camera,
  Link2,
} from 'lucide-react';
import { EditConclusaoModal } from '@/components/EditConclusionModal';

interface PhotoDTO {
  id: string;
  filename: string;
  url: string;
}
interface Order {
  id: string;
  complaints: string;
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fuelLevel: string;
  adblueLevel: string;
  km: number;
  tireStatus: string;
  mirrorStatus: string;
  paintingStatus: string;
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    client: {
      id: string;
      name: string;
    };
  };
  report?: { description: string };
  photos: PhotoDTO[];
}

const statusLabels: Record<string, string> = {
  AGUARDANDO: 'Aguardando',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
};

const fuelLabels: Record<string, string> = {
  RESERVA: 'Reserva',
  QUARTO: '1/4',
  METADE: 'Metade',
  TRES_QUARTOS: '3/4',
  CHEIO: 'Cheio',
};

export default function DetalhesOrdemPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await api.get(`/service-orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Ordem de Serviço'
          subtitle='Detalhes completos da ordem de serviço selecionada.'
          backHref='/ordens'
          editHref={`/ordens/editar/${order?.id}`}
          showEdit
          isDetails
        />
        {order && (
          <div className='flex justify-between items-center mb-4 px-4 text-sm text-subtle-foreground'>
            {/* Timestamps */}
            <div className='flex flex-wrap gap-6'>
              <span>
                Criada em:{' '}
                {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm")}
              </span>
              {order.updatedAt !== order.createdAt && (
                <span>
                  Atualizada em:{' '}
                  {format(new Date(order.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              )}
            </div>

            {/* Botão de copiar link */}
            <a
              href={`/acompanhamento/${order.id}`}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-1 hover:text-foreground'
            >
              <Link2 className='w-4 h-4 text-subtle-foreground' />
              <span className='text-subtle-foreground'>Ver acompanhamento</span>
            </a>
          </div>
        )}

        <section className='bg-muted rounded-lg p-6 space-y-4 border-border border'>
          {loading || !order ? (
            <div className='space-y-2'>
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-6 w-1/4' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : (
            <div className='space-y-6'>
              {/* === Primário (Placa, Veículo, Cliente, Status) === */}
              {/* == LINHA 1: DADOS PRINCIPAIS == */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 truncate '>
                {/* Placa */}
                <div className='bg-background rounded-md p-4 flex flex-col items-start'>
                  <div className='flex items-center gap-2'>
                    <Tag className='w-5 h-5 text-secondary-highlight' />
                    <span className='text-xs uppercase text-subtle-foreground'>
                      Placa
                    </span>
                  </div>
                  <span className='mt-1 text-lg font-semibold text-secondary-highlight'>
                    {order.vehicle.plate}
                  </span>
                </div>

                {/* Veículo */}
                <div className='bg-background rounded-md p-4 flex flex-col items-start'>
                  <div className='flex items-center gap-2'>
                    <Car className='w-5 h-5 text-secondary-highlight' />
                    <span className='text-xs uppercase text-subtle-foreground'>
                      Veículo
                    </span>
                  </div>
                  <span className='mt-1 text-lg font-medium text-foreground'>
                    {formatModelBrand(order.vehicle.model, order.vehicle.brand)}
                  </span>
                </div>

                {/* Cliente */}
                <div className='bg-background rounded-md p-4 flex flex-col items-start'>
                  <div className='flex items-center gap-2'>
                    <User className='w-5 h-5 text-secondary-highlight' />
                    <span className='text-xs uppercase text-subtle-foreground'>
                      Cliente
                    </span>
                  </div>
                  <Link
                    href={`/clientes/${order.vehicle.client.id}`}
                    className='mt-1 text-lg font-medium text-tertiary hover:underline'
                  >
                    {order.vehicle.client.name}
                  </Link>
                </div>

                {/* Status */}
                <div className='bg-background rounded-md p-4 flex flex-col items-start'>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-5 h-5 text-secondary-highlight' />
                    <span className='text-xs uppercase text-subtle-foreground'>
                      Status
                    </span>
                  </div>
                  <span
                    className={`mt-2 inline-flex items-center px-2 py-1 text-xs rounded ${
                      order.status === 'FINALIZADO'
                        ? 'bg-success text-success-foreground'
                        : 'bg-tertiary text-tertiary-foreground'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
              </div>

              {/* == LINHA 2: DADOS SECUNDÁRIOS == */}
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4'>
                {/* Combustível */}
                <div className='bg-background rounded-lg shadow p-4 flex flex-col'>
                  <span className='text-xs uppercase text-subtle-foreground'>
                    Combustível
                  </span>
                  <p className='mt-1 text-sm font-bold text-soft-foreground'>
                    {fuelLabels[order.fuelLevel] || '-'}
                  </p>
                </div>

                {/* AdBlue */}
                <div className='bg-background rounded-lg shadow p-4 flex flex-col'>
                  <span className='text-xs uppercase text-subtle-foreground'>
                    AdBlue
                  </span>
                  <p className='mt-1 text-sm font-bold text-soft-foreground'>
                    {order.adblueLevel || '-'}
                  </p>
                </div>

                {/* Km */}
                <div className='bg-background rounded-lg shadow p-4 flex flex-col'>
                  <span className='text-xs uppercase text-subtle-foreground'>
                    Km
                  </span>
                  <p className='mt-1 text-sm font-bold text-soft-foreground'>
                    {typeof order.km === 'number'
                      ? `${order.km.toLocaleString()} km`
                      : '—'}
                  </p>
                </div>

                {/* Pneus */}
                <div className='bg-background rounded-lg shadow p-4 flex flex-col'>
                  <span className='text-xs uppercase text-subtle-foreground'>
                    Pneus
                  </span>
                  <p className='mt-1 text-sm font-bold text-soft-foreground'>
                    {order.tireStatus || '-'}
                  </p>
                </div>

                {/* Espelhos */}
                <div className='bg-background rounded-lg shadow p-4 flex flex-col'>
                  <span className='text-xs uppercase text-subtle-foreground'>
                    Espelhos
                  </span>
                  <p className='mt-1 text-sm font-bold text-soft-foreground'>
                    {order.mirrorStatus || '-'}
                  </p>
                </div>

                {/* Pintura */}
                <div className='bg-background rounded-lg shadow p-4 flex flex-col'>
                  <span className='text-xs uppercase text-subtle-foreground'>
                    Pintura
                  </span>
                  <p className='mt-1 text-sm font-bold text-soft-foreground'>
                    {order.paintingStatus || '-'}
                  </p>
                </div>
              </div>

              <hr className='border-border' />

              <section className='grid grid-cols-1 gap-6 mt-4'>
                {/* Reclamações */}
                <div className='bg-background rounded-lg shadow p-6'>
                  <h3 className='flex items-center gap-2 text-xs font-semibold uppercase text-secondary-highlight'>
                    <AlertCircle className='w-4 h-4' />
                    Reclamações
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-foreground'>
                    {order.complaints || '-'}
                  </p>
                </div>

                {/* Observações (se houver) */}
                {order.notes && (
                  <div className='bg-background rounded-lg shadow p-6'>
                    <h3 className='flex items-center gap-2 text-xs font-semibold uppercase text-secondary-highlight'>
                      <Notebook className='w-4 h-4' />
                      Observações
                    </h3>
                    <p className='mt-2 text-sm leading-relaxed text-foreground'>
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className='bg-background rounded-lg shadow p-4'>
                  <h3 className='flex items-center gap-2  text-xs font-semibold uppercase text-secondary-highlight mb-2'>
                    <Camera className='w-4 h-4' />
                    Fotos
                  </h3>
                  <div className='flex overflow-x-auto gap-2 py-1'>
                    {order.photos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className='relative w-16 h-16 flex-shrink-0 rounded overflow-hidden cursor-pointer group'
                        onClick={() => setLightboxIndex(idx)}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.filename}
                          fill
                          className='object-cover'
                        />
                        <div className='absolute inset-0 bg-tertiary-foreground/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-foreground text-[10px]'>
                          ver
                        </div>
                      </div>
                    ))}
                  </div>
                  <Lightbox
                    open={lightboxIndex !== null}
                    close={() => setLightboxIndex(null)}
                    slides={order.photos.map((photo) => ({ src: photo.url }))}
                    index={lightboxIndex ?? 0}
                    plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                    carousel={{ finite: true }}
                  />
                </div>

                {/* Conclusão (se FINALIZADO) */}
                {order.status === 'FINALIZADO' && order.report?.description && (
                  <div className='bg-background rounded-lg shadow p-6 flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='w-4 h-4 text-success' />
                        <span className='text-xs font-semibold uppercase text-success'>
                          Conclusão
                        </span>
                      </div>
                      <p className='mt-2 text-sm leading-relaxed text-foreground whitespace-pre-line'>
                        {order.report.description}
                      </p>
                    </div>

                    <EditConclusaoModal
                      orderId={order.id}
                      initialDescription={order.report.description}
                      onSuccess={(newDesc) => {
                        // Atualiza o state local para refletir a mudança sem refetch completo
                        setOrder(
                          (o) => o && { ...o, report: { description: newDesc } }
                        );
                      }}
                    />
                  </div>
                )}
              </section>

              {/* === BOTÃO FINALIZAR ATENDIMENTO === */}
              {order.status !== 'FINALIZADO' && (
                <div className='pt-4 border-t border-border flex justify-center'>
                  <FinalizarAtendimentoModal
                    orderId={order.id}
                    onSuccess={(partialOrder) => {
                      setOrder((prev) =>
                        prev ? { ...prev, ...partialOrder } : prev
                      );
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
