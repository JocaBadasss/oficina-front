'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';

import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatKmForDisplay, parseKmInput } from '@/utils/helpers/orders';
import { formatVehicleLine } from '@/utils/helpers/vehicles';

const orderSchema = z.object({
  clientId: z.string().uuid({ message: 'Cliente é obrigatório' }),
  vehicleId: z.string().uuid({ message: 'Veículo é obrigatório' }),
  fuelLevel: z.string().min(1, 'Nível de combustível é obrigatório'),
  adblueLevel: z.string().min(1, 'Nível de Arla é obrigatório'),
  km: z
    .number({ invalid_type_error: 'KM deve ser um número' })
    .min(0, 'KM inválido'),
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
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const kmValue = watch('km')?.toString() ?? '';

  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const selectedClientId = watch('clientId');

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

    try {
      await api.post('/service-orders', payload);
      toast({ title: 'Ordem criada com sucesso!', variant: 'success' });
      router.push('/ordens');
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      toast({ title: 'Erro ao criar ordem', variant: 'destructive' });
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

        <section className='bg-DARK_700 rounded-lg p-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='clientId'
                className='text-sm text-LIGHT_500'
              >
                Cliente
              </label>
              <select
                id='clientId'
                {...register('clientId')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione um cliente</option>
                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <span className='text-red-500 text-xs'>
                  {errors.clientId.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='vehicleId'
                className='text-sm text-LIGHT_500'
              >
                Veículo
              </label>
              <select
                id='vehicleId'
                {...register('vehicleId')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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
              </select>
              {errors.vehicleId && (
                <span className='text-red-500 text-xs'>
                  {errors.vehicleId.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='fuelLevel'
                className='text-sm text-LIGHT_500'
              >
                Nível de Combustível
              </label>
              <select
                id='fuelLevel'
                {...register('fuelLevel')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                Nível de Adblue
              </label>
              <select
                id='adblueLevel'
                {...register('adblueLevel')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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
                htmlFor='paintingStatus'
                className='text-sm text-LIGHT_500'
              >
                Pintura
              </label>
              <select
                id='paintingStatus'
                {...register('paintingStatus')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='tireStatus'
                className='text-sm text-LIGHT_500'
              >
                Estado dos Pneus
              </label>
              <select
                id='tireStatus'
                {...register('tireStatus')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                Espelhos
              </label>
              <select
                id='mirrorStatus'
                {...register('mirrorStatus')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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
                htmlFor='km'
                className='text-sm text-LIGHT_500'
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
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                Reclamações
              </label>
              <textarea
                id='complaints'
                {...register('complaints')}
                placeholder='Descreva as reclamações do cliente...'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none min-h-[100px]'
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
                className='text-sm text-LIGHT_500'
              >
                Observações (opcional)
              </label>
              <textarea
                id='notes'
                {...register('notes')}
                placeholder='Informações adicionais...'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none min-h-[80px]'
              />
            </div>

            <div className='md:col-span-2'>
              <button
                type='submit'
                className='bg-TINTS_CARROT_100 text-LIGHT_200 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/90 transition w-full md:w-auto'
              >
                Criar Ordem
              </button>
            </div>
          </form>
        </section>
      </main>
    </AppLayout>
  );
}
