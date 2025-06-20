'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';

import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatKmForDisplay, parseKmInput } from '@/utils/helpers/orders';
import { formatVehicleLine } from '@/utils/helpers/vehicles';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsDown, Upload } from 'lucide-react';
import {
  CommandEmpty,
  CommandGroup,
  Command,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { LoadingButton } from '@/components/LoadingButton';
import Image from 'next/image';
import { CustomSelect } from '@/components/ui/customSelect';

const orderSchema = z.object({
  clientId: z
    .string({
      required_error: 'Cliente é obrigatório',
      invalid_type_error: 'Valor inválido',
    })
    .nonempty('Cliente é obrigatório')
    .min(1, 'Cliente é obrigatório'),
  vehicleId: z.string().uuid({ message: 'Veículo é obrigatório' }),
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

type OrderFormData = z.infer<typeof orderSchema>;

interface Client {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  model: string;
  brand: string;
  plate: string;
  clientId: string;
}

export default function NovaOrdemPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const kmValue = watch('km')?.toString() ?? '';

  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const selectedClientId = watch('clientId');

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    setSelectedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const unique = newFiles.filter((f) => !existing.has(f.name + f.size));
      return [...prev, ...unique];
    });

    e.target.value = '';
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientRes, vehicleRes] = await Promise.all([
          api.get('/clients'),
          api.get('/vehicles'),
        ]);
        setClients(clientRes.data);
        setVehicles(vehicleRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        toast({
          title: 'Erro ao carregar dados',
          variant: 'destructive',
        });
      }
    }
    fetchData();
  }, [toast]);

  useEffect(() => {
    const filtered = vehicles.filter((v) => v.clientId === selectedClientId);
    setFilteredVehicles(filtered);
    setValue('vehicleId', '');
  }, [selectedClientId, vehicles, setValue]);

  async function onSubmit(data: OrderFormData) {
    const payload = {
      clientId: data.clientId,
      vehicleId: data.vehicleId,
      fuelLevel: data.fuelLevel,
      adblueLevel: data.adblueLevel,
      km: data.km,
      tireStatus: data.tireStatus,
      mirrorStatus: data.mirrorStatus,
      paintingStatus: data.paintingStatus,
      complaints: data.complaints,
      notes: data.notes,
    };

    console.log(payload);

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsSubmitting(true);
      await api.post('/service-orders/complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({ title: 'Ordem criada com sucesso!', variant: 'success' });
      router.push('/ordens');
    } catch (error) {
      handleAxiosError(error, 'Erro ao criar ordem');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Nova ordem de serviço'
          subtitle='Cadastre uma nova ordem de serviço.'
          backHref='/ordens'
        />

        <section className='bg-muted rounded-lg p-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='clientId'
                className='text-sm text-placeholder'
              >
                Cliente
              </label>
              <Controller
                name='clientId'
                control={control}
                render={({ field }) => (
                  <Popover
                    open={isPopoverOpen}
                    onOpenChange={setIsPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type='button'
                        className='w-full bg-background border border-border rounded-md px-4 py-2 text-sm text-left text-foreground flex items-center justify-between'
                        onClick={() => setIsPopoverOpen(true)}
                      >
                        {clients.find((c) => c.id === field.value)?.name ||
                          'Selecione um cliente'}
                        <ChevronsDown className='ml-2 h-4 w-4 opacity-50' />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      className='p-0 mt-1 z-50 w-[var(--radix-popover-trigger-width)] border border-border bg-popover text-popover-foreground shadow-lg rounded-none'
                      align='start'
                      sideOffset={4}
                    >
                      <Command className='bg-popover'>
                        <CommandInput
                          placeholder='Buscar cliente...'
                          className='h-9 bg-popover text-foreground placeholder:text-placeholder'
                        />
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>

                        <CommandGroup className='bg-popover'>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.name}
                              className='px-4 py-2 text-sm text-foreground bg-popover hover:bg-hover cursor-pointer'
                              onSelect={() => {
                                field.onChange(client.id);
                                setIsPopoverOpen(false);
                              }}
                            >
                              {client.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.clientId?.message && (
                <span className='text-red-500 text-xs'>
                  {errors.clientId?.message || 'Campo obrigatório'}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='vehicleId'
                className='text-sm text-placeholder'
              >
                Veículo
              </label>
              <CustomSelect
                id='vehicleId'
                {...register('vehicleId')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione um veículo</option>
                {filteredVehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {formatVehicleLine({
                      plate: vehicle.plate,
                      model: vehicle.model,
                      brand: vehicle.brand,
                    })}
                  </option>
                ))}
              </CustomSelect>
              {errors.vehicleId && (
                <span className='text-red-500 text-xs'>
                  {errors.vehicleId.message}
                </span>
              )}
            </div>
            {/** Os próximos campos seguem o mesmo padrão **/}
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='fuelLevel'
                className='text-sm text-placeholder'
              >
                Nível de Combustível
              </label>
              <CustomSelect
                id='fuelLevel'
                {...register('fuelLevel')}
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none'
              >
                <option value=''>Selecione</option>
                {fuelLevels.map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </CustomSelect>
              {errors.fuelLevel && (
                <span className='text-red-500 text-xs'>
                  {errors.fuelLevel.message}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='adblueLevel'
                className='text-sm text-placeholder'
              >
                Nível de Adblue
              </label>
              <CustomSelect
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
              </CustomSelect>
              {errors.adblueLevel && (
                <span className='text-red-500 text-xs'>
                  {errors.adblueLevel.message}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='paintingStatus'
                className='text-sm text-placeholder'
              >
                Pintura
              </label>
              <CustomSelect
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
              </CustomSelect>
              {errors.paintingStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.paintingStatus.message}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='tireStatus'
                className='text-sm text-placeholder'
              >
                Estado dos Pneus
              </label>
              <CustomSelect
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
              </CustomSelect>
              {errors.tireStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.tireStatus.message}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='mirrorStatus'
                className='text-sm text-placeholder'
              >
                Espelhos
              </label>
              <CustomSelect
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
              </CustomSelect>
              {errors.mirrorStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.mirrorStatus.message}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='km'
                className='text-sm text-placeholder'
              >
                KM atual
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
                htmlFor='photos'
                className='text-sm text-placeholder'
              >
                Imagens (opcional)
              </label>

              <input
                id='photos'
                type='file'
                multiple
                accept='image/*'
                onChange={handleFiles}
                className='hidden'
              />

              <label
                htmlFor='photos'
                className='inline-flex items-center gap-2 bg-background border border-border text-sm text-subtle-foreground px-4 py-2 rounded-md cursor-pointer hover:bg-hover transition w-full justify-center'
              >
                <Upload size={16} />
                Selecionar arquivos
              </label>

              <div className='flex flex-wrap gap-2 bg-muted rounded-lg p-4 border border-border mt-2'>
                {selectedFiles.length > 0 ? (
                  selectedFiles.map((file, i) => (
                    <div
                      key={i}
                      className='relative'
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={96}
                        height={96}
                        className='object-cover rounded'
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setSelectedFiles((files) =>
                            files.filter((_, index) => index !== i)
                          )
                        }
                        className='absolute -top-1 -right-1 bg-red-600 rounded-full p-1 text-foreground text-xs'
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-placeholder'>
                    Nenhuma imagem selecionada.
                  </p>
                )}
              </div>
            </div>
            <div className='md:col-span-2'>
              <LoadingButton
                type='submit'
                isLoading={isSubmitting}
              >
                Criar Ordem
              </LoadingButton>
            </div>
          </form>
        </section>
      </main>
    </AppLayout>
  );
}
