// Página ajustada com loading visual
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatKmForDisplay, parseKmInput } from '@/utils/helpers/orders';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';
import Image from 'next/image';
import { LoadingButton } from '@/components/LoadingButton';
import { Upload } from 'lucide-react';

const orderSchema = z.object({
  fuelLevel: z.string().min(1, 'Nível de combustível é obrigatório'),
  adblueLevel: z.string().min(1, 'Nível de Arla é obrigatório'),
  km: z
    .number({
      required_error: 'KM é obrigatório',
      invalid_type_error: 'KM deve ser um número',
    })
    .min(0, 'KM inválido')
    .int()
    .max(5_000_000, 'KM muito alto — confere esse valor aí!'),
  tireStatus: z.string().min(1, 'Estado dos pneus é obrigatório'),
  mirrorStatus: z.string().min(1, 'Espelhos é obrigatório'),
  paintingStatus: z.string().min(1, 'Pintura é obrigatória'),
  complaints: z.string().min(1, 'Reclamação é obrigatória'),
  notes: z.string().optional(),
  status: z.string().min(1, 'Status é obrigatório'),
});

const fuelLevels = [
  { label: 'Reserva', value: 'RESERVA' },
  { label: '1/4', value: 'QUARTO' },
  { label: 'Metade', value: 'METADE' },
  { label: '3/4', value: 'TRES_QUARTOS' },
  { label: 'Cheio', value: 'CHEIO' },
];
const adblueLevels = ['VAZIO', 'BAIXO', 'METADE', 'CHEIO'];
const tireStatuses = ['RUIM', 'REGULAR', 'BOM', 'NOVO'];
const mirrorStatuses = ['OK', 'QUEBRADO', 'RACHADO', 'FALTANDO'];
const paintingStatuses = ['INTACTA', 'ARRANHADA', 'AMASSADA', 'REPARADA'];
const statusOptions = [
  { label: 'Aguardando', value: 'AGUARDANDO' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
];

// tipo que o backend retorna em GET /photos/:order
interface PhotoDTO {
  id: string;
  filename: string; // ← adiciona aqui
  url: string;
}

interface ServiceOrderWithPhotos {
  fuelLevel: string;
  adblueLevel: string;
  km: number;
  tireStatus: string;
  mirrorStatus: string;
  paintingStatus: string;
  complaints: string;
  notes?: string;
  status: string;
  // … outros campos que você faz reset()
  photos: PhotoDTO[];
}

type FormData = z.infer<typeof orderSchema>;
export default function EditarOrdemPage() {
  const [existingPhotos, setExistingPhotos] = useState<PhotoDTO[]>([]);
  const [removePhotoIds, setRemovePhotoIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(orderSchema) });

  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  const kmValue = watch('km')?.toString() ?? '';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderAndPhotos() {
      try {
        // agora lê tudo num GET só
        const { data: order } = await api.get<ServiceOrderWithPhotos>(
          `/service-orders/${id}`
        );
        reset(order); // preenche o form
        setExistingPhotos(order.photos); // guarda as fotos
      } catch (err) {
        console.error(err);
        toast({ title: 'Erro ao carregar ordem', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchOrderAndPhotos();
  }, [id, reset, toast]);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // 1) Campos da ordem
      Object.entries({
        fuelLevel: data.fuelLevel,
        adblueLevel: data.adblueLevel,
        km: data.km,
        tireStatus: data.tireStatus,
        mirrorStatus: data.mirrorStatus,
        paintingStatus: data.paintingStatus,
        complaints: data.complaints,
        notes: data.notes || undefined,
        status: data.status,
      }).forEach(([key, val]) => {
        if (val != null && val !== '') formData.append(key, String(val));
      });

      // 2) IDs para remover
      removePhotoIds.forEach((photoId) =>
        formData.append('removePhotoIds', photoId)
      );

      // 3) Novos arquivos
      selectedFiles.forEach((file) => formData.append('files', file));

      // 4) Chamada multipart
      await api.patch(`/service-orders/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast({ title: 'Ordem atualizada com sucesso!', variant: 'success' });
      router.push('/ordens');
    } catch (err) {
      handleAxiosError(err, 'Erro ao atualizar ordem');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-DARK_400 text-LIGHT_100'>
        <p className='text-sm text-LIGHT_500'>Carregando ordem...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Editar Ordem de serviço'
          subtitle='Atualize as informações da ordem de serviço'
          backHref={`/ordens/${id}`}
        />

        <section className='bg-muted rounded-lg p-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='fuelLevel'
                className='text-sm text-subtle-foreground'
              >
                Nível de Combustível
              </label>
              <select
                id='fuelLevel'
                {...register('fuelLevel')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {fuelLevels.map(({ label, value }) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.fuelLevel && (
                <span className='text-red-500 text-xs'>
                  {errors.fuelLevel.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='adblueLevel'
                className='text-sm text-subtle-foreground'
              >
                Nível de Adblue
              </label>
              <select
                id='adblueLevel'
                {...register('adblueLevel')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {adblueLevels.map((level) => (
                  <option
                    key={level}
                    value={level}
                  >
                    {level}
                  </option>
                ))}
              </select>
              {errors.adblueLevel && (
                <span className='text-red-500 text-xs'>
                  {errors.adblueLevel.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='km'
                className='text-sm text-subtle-foreground'
              >
                KM Atual
              </label>
              <input
                type='text'
                inputMode='numeric'
                id='km'
                value={formatKmForDisplay(kmValue)}
                onChange={(e) => {
                  const raw = parseKmInput(e.target.value);
                  setValue('km', raw, { shouldValidate: true });
                }}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              />
              {errors.km && (
                <span className='text-red-500 text-xs'>
                  {errors.km.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='tireStatus'
                className='text-sm text-subtle-foreground'
              >
                Estado dos Pneus
              </label>
              <select
                id='tireStatus'
                {...register('tireStatus')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {tireStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
              {errors.tireStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.tireStatus.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='mirrorStatus'
                className='text-sm text-subtle-foreground'
              >
                Espelhos
              </label>
              <select
                id='mirrorStatus'
                {...register('mirrorStatus')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {mirrorStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
              {errors.mirrorStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.mirrorStatus.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='paintingStatus'
                className='text-sm text-subtle-foreground'
              >
                Pintura
              </label>
              <select
                id='paintingStatus'
                {...register('paintingStatus')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {paintingStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
              {errors.paintingStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.paintingStatus.message}
                </span>
              )}
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
              <label
                htmlFor='complaints'
                className='text-sm text-placeholder'
              >
                Reclamações
              </label>
              <textarea
                id='complaints'
                {...register('complaints')}
                placeholder='Descreva as reclamações do cliente...'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none min-h-[100px]'
              />
              {errors.complaints && (
                <span className='text-red-500 text-xs'>
                  {errors.complaints.message}
                </span>
              )}
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
              <label
                htmlFor='notes'
                className='text-sm text-placeholder'
              >
                Observações (opcional)
              </label>
              <textarea
                id='notes'
                {...register('notes')}
                placeholder='Informações adicionais...'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none min-h-[80px]'
              />
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
              <label
                htmlFor='status'
                className='text-sm text-placeholder'
              >
                Status da Ordem
              </label>
              <select
                id='status'
                {...register('status')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm font-semibold text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {statusOptions.map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <span className='text-red-500 text-xs'>
                  {errors.status.message}
                </span>
              )}
            </div>

            <div className='md:col-span-2 flex flex-col gap-2 '>
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='newPhotos'
                  className='text-sm text-placeholder'
                >
                  Adicionar Fotos
                </label>

                <input
                  id='newPhotos'
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => {
                    if (!e.target.files) return;

                    const newFiles = Array.from(e.target.files);

                    // Evita arquivos duplicados com base no nome + tamanho
                    setSelectedFiles((prev) => {
                      const existing = new Set(
                        prev.map((f) => f.name + f.size)
                      );
                      const unique = newFiles.filter(
                        (f) => !existing.has(f.name + f.size)
                      );
                      return [...prev, ...unique];
                    });

                    // Reseta o input pra permitir selecionar o mesmo arquivo de novo se quiser
                    e.target.value = '';
                  }}
                  className='hidden'
                />

                <label
                  htmlFor='newPhotos'
                  className='inline-flex items-center gap-2 bg-background border border-border text-sm text-subtle-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-hover transition justify-center'
                >
                  <Upload size={16} />
                  Selecionar arquivos
                </label>
              </div>

              {/* <div className='flex flex-wrap gap-2'>
                {selectedFiles.map((f, i) => (
                  <span
                    key={i}
                    className='text-xs text-subtle-foreground bg-accent rounded px-2 py-1'
                  >
                    {f.name}
                  </span>
                ))}
              </div> */}
            </div>

            <div className='md:col-span-2 flex flex-wrap gap-2 bg-muted rounded-lg p-4 border border-border'>
              {[...existingPhotos, ...selectedFiles].map((item, i) => {
                const isExisting = 'url' in item;

                return (
                  <div
                    key={isExisting ? item.id : i}
                    className='relative'
                  >
                    <Image
                      src={isExisting ? item.url : URL.createObjectURL(item)}
                      alt={isExisting ? item.filename : item.name}
                      width={96}
                      height={96}
                      className='object-cover rounded'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        if (isExisting) {
                          setRemovePhotoIds((ids) => [...ids, item.id]);
                          setExistingPhotos((ps) =>
                            ps.filter((p) => p.id !== item.id)
                          );
                        } else {
                          setSelectedFiles((fs) =>
                            fs.filter(
                              (_, idx) => idx !== i - existingPhotos.length
                            )
                          );
                        }
                      }}
                      className='absolute -top-1 -right-1 bg-red-600 rounded-full p-1 text-foreground text-xs'
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              {existingPhotos.length === 0 && selectedFiles.length === 0 && (
                <p className='text-sm text-placeholder'>
                  Nenhuma foto cadastrada.
                </p>
              )}
            </div>

            <div className='md:col-span-2'>
              <LoadingButton
                type='submit'
                isLoading={isSubmitting}
              >
                Salvar alterações
              </LoadingButton>
            </div>
          </form>
        </section>
      </main>
    </AppLayout>
  );
}
