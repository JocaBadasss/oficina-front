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
import { ChevronsDown, Plus } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';
import { smartFormatPlate } from '@/utils/helpers/vehicles';

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
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
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

  const onSubmit = async (data: NovoAtendimentoFormData) => {
    setIsSubmitting(true);

    try {
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

      const res = await api.post('/service-orders/complete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({ title: 'Atendimento criado com sucesso!' });
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
          className='space-y-6'
        >
          {/* Seção CLIENTE */}
          <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
            <h2 className='text-xl font-semibold text-LIGHT_200'>Cliente</h2>

            <Popover
              open={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
            >
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className='w-full bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-left text-LIGHT_100 flex items-center justify-between'
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
                className='p-0 mt-1 z-50 w-[var(--radix-popover-trigger-width)] border border-DARK_900 bg-DARK_800 text-LIGHT_100 shadow-lg rounded-none'
                align='start'
                sideOffset={4}
              >
                <Command className=' bg-DARK_800 '>
                  <CommandInput
                    placeholder='Buscar cliente...'
                    className='h-9  bg-DARK_800'
                  />
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>

                  <CommandGroup className=' bg-DARK_800'>
                    <CommandItem
                      value='new'
                      className='flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-TINTS_CAKE_200 bg-DARK_800  hover:bg-DARK_700 cursor-pointer'
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
                        className='px-4 py-2 text-sm text-LIGHT_100 bg-DARK_800  hover:bg-DARK_700 cursor-pointer'
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
                    className='text-sm text-LIGHT_500'
                  >
                    Nome <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='name'
                    {...register('name')}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
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
                    className='text-sm text-LIGHT_500'
                  >
                    Email <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='email'
                    id='email'
                    {...register('email')}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
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
                    className='text-sm text-LIGHT_500'
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
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
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
                    className='text-sm text-LIGHT_500'
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
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
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
                    className='text-sm text-LIGHT_500'
                  >
                    Endereço
                  </label>
                  <input
                    type='text'
                    id='address'
                    {...register('address')}
                    placeholder='Rua das Oficinas, 123'
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                  />
                </div>
              </div>
            )}
          </section>
          <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
            <h2 className='text-xl font-semibold text-LIGHT_200'>Veículo</h2>

            {selectedClient && (
              <div className='flex flex-col gap-2'>
                <label className='text-sm text-LIGHT_500'>
                  Selecionar veículo existente
                </label>
                <select
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
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
                </select>
              </div>
            )}

            {(!selectedClient || selectedVehicleId === '') && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='plate'
                    className='text-sm text-LIGHT_500'
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
                    placeholder='ABC-1234 ou ABC1AB1'
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
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
                    className='text-sm text-LIGHT_500'
                  >
                    Marca
                  </label>
                  <input
                    type='text'
                    id='brand'
                    {...register('brand')}
                    placeholder='Ex: Volkswagen'
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='model'
                    className='text-sm text-LIGHT_500'
                  >
                    Modelo
                  </label>
                  <input
                    type='text'
                    id='model'
                    {...register('model')}
                    placeholder='Ex: Fusca'
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <label
                    htmlFor='year'
                    className='text-sm text-LIGHT_500'
                  >
                    Ano
                  </label>
                  <input
                    type='number'
                    id='year'
                    {...register('year', { valueAsNumber: true })}
                    placeholder='Ex: 1989'
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                  />
                </div>
              </div>
            )}
          </section>

          {/* Seção ORDEM DE SERVIÇO */}
          <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
            <h2 className='text-xl font-semibold text-LIGHT_200'>
              Ordem de Serviço
            </h2>

            <div className='flex flex-col gap-1'>
              <label
                htmlFor='complaints'
                className='text-sm text-LIGHT_500'
              >
                Reclamações <span className='text-red-500'>*</span>
              </label>
              <textarea
                id='complaints'
                {...register('complaints', {
                  required: 'Reclamações são obrigatórias',
                })}
                placeholder='Descreva as reclamações do cliente...'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 min-h-[100px]'
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
                className='text-sm text-LIGHT_500'
              >
                Observações
              </label>
              <textarea
                id='notes'
                {...register('notes')}
                placeholder='Informações adicionais...'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 min-h-[80px]'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='km'
                  className='text-sm text-LIGHT_500'
                >
                  KM Atual
                </label>
                <input
                  type='number'
                  id='km'
                  {...register('km', { valueAsNumber: true })}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='fuelLevel'
                  className='text-sm text-LIGHT_500'
                >
                  Nível de Combustível
                </label>
                <select
                  id='fuelLevel'
                  {...register('fuelLevel')}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                >
                  <option value=''>Selecione</option>
                  <option value='RESERVA'>Reserva</option>
                  <option value='QUARTO'>1/4</option>
                  <option value='METADE'>Metade</option>
                  <option value='TRES_QUARTOS'>3/4</option>
                  <option value='CHEIO'>Cheio</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='adblueLevel'
                  className='text-sm text-LIGHT_500'
                >
                  Nível de Adblue
                </label>
                <select
                  id='adblueLevel'
                  {...register('adblueLevel')}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                >
                  <option value=''>Selecione</option>
                  <option value='VAZIO'>Vazio</option>
                  <option value='BAIXO'>Baixo</option>
                  <option value='METADE'>Metade</option>
                  <option value='CHEIO'>Cheio</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='tireStatus'
                  className='text-sm text-LIGHT_500'
                >
                  Estado dos Pneus
                </label>
                <select
                  id='tireStatus'
                  {...register('tireStatus')}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                >
                  <option value=''>Selecione</option>
                  <option value='RUIM'>Ruim</option>
                  <option value='REGULAR'>Regular</option>
                  <option value='BOM'>Bom</option>
                  <option value='NOVO'>Novo</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='mirrorStatus'
                  className='text-sm text-LIGHT_500'
                >
                  Espelhos
                </label>
                <select
                  id='mirrorStatus'
                  {...register('mirrorStatus')}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                >
                  <option value=''>Selecione</option>
                  <option value='OK'>Ok</option>
                  <option value='QUEBRADO'>Quebrado</option>
                  <option value='RACHADO'>Rachado</option>
                  <option value='FALTANDO'>Faltando</option>
                </select>
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='paintingStatus'
                  className='text-sm text-LIGHT_500'
                >
                  Pintura
                </label>
                <select
                  id='paintingStatus'
                  {...register('paintingStatus')}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100'
                >
                  <option value=''>Selecione</option>
                  <option value='INTACTA'>Intacta</option>
                  <option value='ARRANHADA'>Arranhada</option>
                  <option value='AMASSADA'>Amassada</option>
                  <option value='REPARADA'>Reparada</option>
                </select>
              </div>

              <div className='md:col-span-2 flex flex-col gap-2'>
                <label
                  htmlFor='photos'
                  className='text-sm text-LIGHT_500'
                >
                  Imagens (opcional)
                </label>
                <input
                  id='photos'
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleFiles}
                  className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
                />
                <div className='flex flex-wrap gap-2'>
                  {selectedFiles.map((file, idx) => (
                    <span
                      key={idx}
                      className='text-xs text-LIGHT_400 bg-DARK_900 rounded px-2 py-1'
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <button
            disabled={isSubmitting}
            type='submit'
            className='w-full bg-TINTS_CARROT_100 text-LIGHT_100 font-bold py-3 px-6 rounded-md hover:bg-[#d98b3e] transition-colors'
          >
            Finalizar Atendimento
          </button>
        </form>
      </main>
    </AppLayout>
  );
}
