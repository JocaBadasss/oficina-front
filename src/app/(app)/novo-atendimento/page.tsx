'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { mask } from 'remask';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PageHeader } from '@/components/PageHeader';
import { fullSchema, NovoAtendimentoFormData } from './schemas/novoAtendimento';
import { ChevronsDown, Plus, Upload } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';
import { smartFormatPlate } from '@/utils/helpers/vehicles';
import { LoadingButton } from '@/components/LoadingButton';
import { formatKmForDisplay, parseKmInput } from '@/utils/helpers/orders';
import Image from 'next/image';
import { CustomSelect } from '@/components/ui/customSelect';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpfOrCnpj?: string;
  address?: string;
  createdAt?: string;
}

interface Vehicle {
  id: string;
  plate: string;
  model?: string;
  brand?: string;
  year?: number;
  createdAt?: string;
  clientId?: string;
}

export default function NovoAtendimentoPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [createNewClient, setCreateNewClient] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<NovoAtendimentoFormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      createNewClient: false,
      selectedVehicleId: '',
      complaints: '',
      notes: '',
      km: undefined,
      fuelLevel: '',
      adblueLevel: '',
      tireStatus: '',
      mirrorStatus: '',
      paintingStatus: '',
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'plate' && value.plate) {
        const formatted = smartFormatPlate(value.plate);
        if (formatted !== value.plate) {
          setValue('plate', formatted);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await api.get('/clients');
        setClients(res.data);
      } catch (err) {
        console.log(err);
        toast({ title: 'Erro ao carregar clientes', variant: 'destructive' });
      }
    }
    fetchClients();
  }, [toast]);

  useEffect(() => {
    async function fetchVehicles() {
      if (!selectedClient) return;
      try {
        const res = await api.get(`/clients/${selectedClient.id}/vehicles`);
        setVehicles(res.data);
      } catch (err) {
        console.log(err);
        toast({ title: 'Erro ao carregar veículos', variant: 'destructive' });
      }
    }
    fetchVehicles();
  }, [selectedClient, toast]);

  const kmValue = watch('km')?.toString() ?? '';

  const onSubmit = async (data: NovoAtendimentoFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // 👤 Cliente
      if (createNewClient) {
        formData.append('name', data.name || '');
        formData.append('email', data.email || '');
        formData.append('phone', data.phone!.replace(/\D/g, '') || '');
        formData.append('cpfOrCnpj', data.cpfOrCnpj!.replace(/\D/g, '') || '');
        if (data.address) formData.append('address', data.address);
      } else if (selectedClient) {
        formData.append('clientId', selectedClient.id);
      }

      // 🚘 Veículo
      if (selectedVehicleId) {
        formData.append('vehicleId', selectedVehicleId);
      } else {
        formData.append('plate', data.plate || '');
        if (data.brand) formData.append('brand', data.brand);
        if (data.model) formData.append('model', data.model);
        if (data.year !== undefined) formData.append('year', String(data.year));
      }

      // 🛠 Ordem de serviço
      formData.append('complaints', data.complaints);
      if (data.notes) formData.append('notes', data.notes);
      if (data.km !== undefined) formData.append('km', String(data.km));
      if (data.fuelLevel) formData.append('fuelLevel', data.fuelLevel);
      if (data.adblueLevel) formData.append('adblueLevel', data.adblueLevel);
      if (data.tireStatus) formData.append('tireStatus', data.tireStatus);
      if (data.mirrorStatus) formData.append('mirrorStatus', data.mirrorStatus);
      if (data.paintingStatus)
        formData.append('paintingStatus', data.paintingStatus);

      // 📎 Fotos
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      console.log(formData);

      const res = await api.post('/service-orders/complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({ title: 'Atendimento criado com sucesso!', variant: 'success' });
      router.push(`/ordens/${res.data.orderId}`);
      setCreateNewClient(false);
      setSelectedVehicleId('');
      reset();
      setSelectedFiles([]);
    } catch (err) {
      handleAxiosError(err, 'Erro ao criar atendimento');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    setValue('createNewClient', createNewClient);
  }, [createNewClient, setValue]);

  useEffect(() => {
    setValue('selectedVehicleId', selectedVehicleId);
  }, [selectedVehicleId, setValue]);

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6 overflow-x-hidden'>
        <PageHeader
          title='Novo Atendimento'
          subtitle='Cadastre cliente, veículo e ordem de serviço em um só lugar.'
          backHref='/painel'
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6 '
        >
          {/* Seção CLIENTE */}
          <section className='bg-muted rounded-lg p-6 space-y-4 border borde-border'>
            <h2 className='text-xl font-semibold text-muted-foreground'>
              Cliente
            </h2>

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
                  {selectedClient ? (
                    selectedClient.name
                  ) : createNewClient ? (
                    <div className='inline-flex items-center gap-1'>
                      <Plus className='w-4 h-4 opacity-70' />
                      <span>Novo cliente</span>
                    </div>
                  ) : (
                    'Selecione um cliente'
                  )}
                  <ChevronsDown className='ml-2 h-4 w-4 opacity-50' />
                </button>
              </PopoverTrigger>

              <PopoverContent
                className='p-0 mt-1 z-50 w-[var(--radix-popover-trigger-width)]  shadow-lg rounded-none'
                align='start'
                sideOffset={4}
              >
                <Command className=''>
                  <CommandInput
                    placeholder='Buscar cliente...'
                    className='h-9 border-0 focus:ring-0 focus:outline-none shadow-none bg-transparent text-foreground placeholder:text-placeholder px-3 text-sm'
                  />

                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>

                  <CommandGroup className=''>
                    <CommandItem
                      value='new'
                      className='flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-secondary-highlight  cursor-pointer'
                      onSelect={() => {
                        setSelectedClient(null);
                        setCreateNewClient(true);
                        setIsPopoverOpen(false);
                      }}
                    >
                      <Plus size={16} /> Criar novo cliente
                    </CommandItem>

                    {clients.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.name}
                        className='px-4 py-2 text-sm text-foreground    cursor-pointer'
                        onSelect={() => {
                          setSelectedClient(client);
                          setCreateNewClient(false);
                          setIsPopoverOpen(false);
                          setValue('clientId', client.id);
                        }}
                      >
                        {client.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {isSubmitted && !selectedClient && !createNewClient && (
              <span className='text-red-500 text-xs mt-1 block'>
                É necessário selecionar ou criar um cliente.
              </span>
            )}

            {createNewClient && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='name'
                    className='text-sm text-subtle-foreground'
                  >
                    Nome <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='name'
                    {...register('name')}
                    className='bg-muted border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                  {errors.name && (
                    <span className='text-red-500 text-xs'>
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='email'
                    className='text-sm text-subtle-foreground'
                  >
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    id='email'
                    {...register('email')}
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                  {errors.email && (
                    <span className='text-red-500 text-xs'>
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='phone'
                    className='text-sm text-subtle-foreground'
                  >
                    Telefone <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='phone'
                    {...register('phone')}
                    onChange={(e) => {
                      const masked = mask(e.target.value.replace(/\D/g, ''), [
                        '(99) 99999-9999',
                      ]);
                      setValue('phone', masked);
                    }}
                    value={watch('phone') || ''}
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />

                  {errors.phone && (
                    <span className='text-red-500 text-xs'>
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='cpfOrCnpj'
                    className='text-sm text-subtle-foreground'
                  >
                    CPF ou CNPJ <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='cpfOrCnpj'
                    {...register('cpfOrCnpj')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      const newValue =
                        raw.length <= 11
                          ? mask(raw, ['999.999.999-99'])
                          : mask(raw, ['99.999.999/9999-99']);
                      setValue('cpfOrCnpj', newValue);
                    }}
                    value={watch('cpfOrCnpj') || ''}
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                  {errors.cpfOrCnpj && (
                    <span className='text-red-500 text-xs'>
                      {errors.cpfOrCnpj.message}
                    </span>
                  )}
                </div>
                <div className='md:col-span-2 flex flex-col gap-1'>
                  <label
                    htmlFor='address'
                    className='text-sm text-subtle-foreground'
                  >
                    Endereço
                  </label>
                  <input
                    type='text'
                    id='address'
                    {...register('address')}
                    placeholder='Rua das Oficinas, 123'
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                </div>
              </div>
            )}
          </section>
          <section className='bg-muted rounded-lg p-6 space-y-4 border borde-border'>
            <h2 className='text-xl font-semibold text-muted-foreground'>
              Veículo
            </h2>

            {selectedClient && (
              <div className='flex flex-col gap-2 '>
                <label className='text-sm text-subtle-foreground'>
                  Selecionar veículo existente
                </label>

                <CustomSelect
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground appearance-none w-full '
                  onChange={(e) => {
                    const vehicleId = e.target.value;
                    setSelectedVehicleId(vehicleId);
                    const found = vehicles.find((v) => v.id === vehicleId);
                    if (found) {
                      setValue('plate', found.plate);
                      setValue('brand', found.brand);
                      setValue('model', found.model);
                      setValue('year', found.year);
                    } else {
                      setValue('plate', '');
                      setValue('brand', '');
                      setValue('model', '');
                      setValue('year', undefined);
                    }
                  }}
                >
                  <option value=''>+ Criar novo veículo</option>
                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >
                      {vehicle.plate} - {vehicle.model} ({vehicle.brand})
                    </option>
                  ))}
                </CustomSelect>
              </div>
            )}

            {(!selectedClient || selectedVehicleId === '') && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 '>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='plate'
                    className='text-sm text-subtle-foreground'
                  >
                    Placa <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='plate'
                    {...register('plate')}
                    onChange={(e) => {
                      const raw = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '');
                      let formatted = raw;
                      if (raw.length > 3) {
                        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}`;
                      }
                      setValue('plate', formatted);
                    }}
                    value={watch('plate') || ''}
                    placeholder='ABC-0123 ou ABC0B23'
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                  {errors.plate && (
                    <span className='text-red-500 text-xs'>
                      {errors.plate.message}
                    </span>
                  )}
                </div>

                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='brand'
                    className='text-sm text-subtle-foreground'
                  >
                    Marca
                  </label>
                  <input
                    type='text'
                    id='brand'
                    {...register('brand')}
                    placeholder='Ex: Volkswagen'
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='model'
                    className='text-sm text-subtle-foreground'
                  >
                    Modelo
                  </label>
                  <input
                    type='text'
                    id='model'
                    {...register('model')}
                    placeholder='Ex: Fusca'
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='year'
                    className='text-sm text-subtle-foreground'
                  >
                    Ano
                  </label>
                  <input
                    type='number'
                    id='year'
                    {...register('year', { valueAsNumber: true })}
                    placeholder='Ex: 1989'
                    className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                  />
                </div>
              </div>
            )}
          </section>

          {/* Seção ORDEM DE SERVIÇO */}
          <section className='bg-muted rounded-lg p-6 space-y-4 border borde-border'>
            <h2 className='text-xl font-semibold text-muted-foreground'>
              Ordem de Serviço
            </h2>

            <div className='flex flex-col gap-1'>
              <label
                htmlFor='complaints'
                className='text-sm text-subtle-foreground'
              >
                Reclamações <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='complaints'
                {...register('complaints', {
                  required: 'Reclamações são obrigatórias',
                })}
                placeholder='Descreva as reclamações do cliente...'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground min-h-[100px]'
              />
              {errors.complaints && (
                <span className='text-red-500 text-xs'>
                  {errors.complaints.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <label
                htmlFor='notes'
                className='text-sm text-subtle-foreground'
              >
                Observações
              </label>
              <textarea
                id='notes'
                {...register('notes')}
                placeholder='Informações adicionais...'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground min-h-[80px]'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='fuelLevel'
                  className='text-sm text-subtle-foreground'
                >
                  Nível de Combustível
                </label>
                <CustomSelect
                  id='fuelLevel'
                  {...register('fuelLevel')}
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                >
                  <option value=''>Selecione</option>
                  <option value='RESERVA'>Reserva</option>
                  <option value='QUARTO'>1/4</option>
                  <option value='METADE'>Metade</option>
                  <option value='TRES_QUARTOS'>3/4</option>
                  <option value='CHEIO'>Cheio</option>
                </CustomSelect>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='adblueLevel'
                  className='text-sm text-subtle-foreground'
                >
                  Nível de Adblue
                </label>
                <CustomSelect
                  id='adblueLevel'
                  {...register('adblueLevel')}
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                >
                  <option value=''>Selecione</option>
                  <option value='VAZIO'>Vazio</option>
                  <option value='BAIXO'>Baixo</option>
                  <option value='METADE'>Metade</option>
                  <option value='CHEIO'>Cheio</option>
                </CustomSelect>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='tireStatus'
                  className='text-sm text-subtle-foreground'
                >
                  Estado dos Pneus
                </label>
                <CustomSelect
                  id='tireStatus'
                  {...register('tireStatus')}
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                >
                  <option value=''>Selecione</option>
                  <option value='RUIM'>Ruim</option>
                  <option value='REGULAR'>Regular</option>
                  <option value='BOM'>Bom</option>
                  <option value='NOVO'>Novo</option>
                </CustomSelect>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='mirrorStatus'
                  className='text-sm text-subtle-foreground'
                >
                  Espelhos
                </label>
                <CustomSelect
                  id='mirrorStatus'
                  {...register('mirrorStatus')}
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                >
                  <option value=''>Selecione</option>
                  <option value='OK'>Ok</option>
                  <option value='QUEBRADO'>Quebrado</option>
                  <option value='RACHADO'>Rachado</option>
                  <option value='FALTANDO'>Faltando</option>
                </CustomSelect>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='paintingStatus'
                  className='text-sm text-subtle-foreground'
                >
                  Pintura
                </label>
                <CustomSelect
                  id='paintingStatus'
                  {...register('paintingStatus')}
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                >
                  <option value=''>Selecione</option>
                  <option value='INTACTA'>Intacta</option>
                  <option value='ARRANHADA'>Arranhada</option>
                  <option value='AMASSADA'>Amassada</option>
                  <option value='REPARADA'>Reparada</option>
                </CustomSelect>
              </div>

              <div className='flex flex-col gap-1'>
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
                  className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground'
                />
                {errors.km && (
                  <span className='text-red-500 text-xs'>
                    {errors.km.message}
                  </span>
                )}
              </div>

              <div className='md:col-span-2 flex flex-col gap-2'>
                <label
                  htmlFor='photos'
                  className='text-sm text-subtle-foreground'
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
            </div>
          </section>
          <LoadingButton
            type='submit'
            isLoading={isSubmitting}
          >
            Finalizar atendimento
          </LoadingButton>
        </form>
      </main>
    </AppLayout>
  );
}
