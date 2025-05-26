'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

  const router = useRouter();

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

        <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
          {loading || !order ? (
            <div className='space-y-2'>
              <Skeleton className='h-6 w-1/2' />
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-6 w-1/4' />
              <Skeleton className='h-6 w-full' />
            </div>
          ) : (
            <div className='space-y-6'>
              <div className='text-sm text-LIGHT_500'>
                Criada em:{' '}
                {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                <br />
                Atualizada em:{' '}
                {format(new Date(order.updatedAt), 'dd/MM/yyyy HH:mm')}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Placa</h2>
                  <p className='text-lg font-semibold text-TINTS_CAKE_200'>
                    {order.vehicle.plate}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Veículo</h2>
                  <p className='text-lg font-medium text-LIGHT_100'>
                    {formatModelBrand(order.vehicle.model, order.vehicle.brand)}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Cliente</h2>
                  <Link
                    href={`/clientes/${order.vehicle.client.id}`}
                    className='text-lg font-medium text-TINTS_CARROT_100 hover:underline'
                  >
                    {order.vehicle.client.name}
                  </Link>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Status</h2>
                  <p
                    className={`text-xs font-semibold px-2 py-1 rounded w-fit ${
                      order.status === 'FINALIZADO'
                        ? 'bg-TINTS_MINT_100 text-DARK_100'
                        : 'bg-TINTS_CARROT_100 text-DARK_100'
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>
                    Nível de Combustível
                  </h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {fuelLabels[order.fuelLevel] || '-'}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>
                    Nível de Adblue
                  </h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {order.adblueLevel || '-'}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>
                    Quilometragem
                  </h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {typeof order.km === 'number'
                      ? `${order.km.toLocaleString()} km`
                      : '—'}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>
                    Estado dos Pneus
                  </h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {order.tireStatus || '-'}
                  </p>
                </div>
                <div>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Espelhos</h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {order.mirrorStatus || '-'}
                  </p>
                </div>
                <div className='sm:col-span-2 lg:col-span-3'>
                  <h2 className='text-xs text-LIGHT_500 uppercase'>Pintura</h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {order.paintingStatus || '-'}
                  </p>
                </div>
              </div>

              <hr className='border-DARK_900' />

              <div>
                <h2 className='text-sm font-bold text-LIGHT_500 uppercase mb-1'>
                  Reclamações
                </h2>
                <p className='text-sm font-bold text-LIGHT_300'>
                  {order.complaints || '-'}
                </p>
              </div>

              {order.notes && (
                <div>
                  <h2 className='text-sm font-bold text-LIGHT_500 uppercase mb-1'>
                    Observações
                  </h2>
                  <p className='text-sm font-bold text-LIGHT_300'>
                    {order.notes}
                  </p>
                </div>
              )}

              <hr className='border-DARK_900' />

              {order.status === 'FINALIZADO' && order.report?.description && (
                <div className='bg-TINTS_MINT_900  rounded-md '>
                  <h2 className='text-xs font-semibold uppercase text-TINTS_MINT_100'>
                    Conclusão
                  </h2>
                  <p className=' text-sm text-LIGHT_100 whitespace-pre-line'>
                    {order.report.description}
                  </p>
                </div>
              )}

              <hr className='border-DARK_900' />

              <div className='space-y-2'>
                <h2 className='text-sm font-bold text-LIGHT_500 uppercase'>
                  Fotos
                </h2>

                {order.photos.length > 0 ? (
                  <>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                      {order.photos.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className='relative w-24 h-10 pb-[75%] rounded overflow-hidden cursor-pointer group'
                          onClick={() => setLightboxIndex(idx)}
                        >
                          <Image
                            src={photo.url}
                            alt={photo.filename}
                            fill
                            className='object-cover'
                          />
                          {/* Overlay “Clique para ampliar” */}
                          <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium'>
                            Clique para ampliar
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lightbox */}
                    <Lightbox
                      open={lightboxIndex !== null}
                      close={() => setLightboxIndex(null)}
                      slides={order.photos.map((photo) => ({ src: photo.url }))}
                      index={lightboxIndex ?? 0}
                      plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
                      carousel={{ finite: true }}
                    />
                  </>
                ) : (
                  <p className='text-sm text-LIGHT_500 italic'>
                    Ainda não há fotos nesta ordem.
                  </p>
                )}
              </div>

              {/* === BOTÃO FINALIZAR ATENDIMENTO === */}
              <div className='pt-4 border-t border-DARK_900 flex justify-center'>
                <FinalizarAtendimentoModal
                  orderId={order.id}
                  onSuccess={() => {
                    router.refresh();
                  }}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
