'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { smartFormatPlate } from '@/utils/helpers/vehicles';
import { LoadingButton } from '@/components/LoadingButton';

const vehicleSchema = z.object({
  clientId: z.string().uuid({ message: 'Cliente é obrigatório' }),
  plate: z
    .string()
    .min(7, 'Placa inválida')
    .refine(
      (val) => {
        const raw = val.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        return (
          /^[A-Z]{3}[0-9]{4}$/.test(raw) || // Antiga sem hífen
          /^[A-Z]{3}-[0-9]{4}$/.test(val) || // Antiga com hífen (visual)
          /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(raw) // Mercosul
        );
      },
      {
        message: 'Formato de placa inválido',
      }
    ),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z
    .number({ invalid_type_error: 'Ano deve ser um número' })
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear(), 'Ano inválido'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  clientId: string;
  client: {
    id: string;
    name: string;
  };
};

export default function EditarVeiculoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchVehicle() {
      try {
        setIsSubmitting(true);
        const response = await api.get(`/vehicles/${params.id}`);
        const data = response.data;
        setVehicle(data);
        reset({
          clientId: data.clientId,
          plate: smartFormatPlate(data.plate),
          brand: data.brand,
          model: data.model,
          year: data.year,
        });
      } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        toast({ title: 'Erro ao carregar veículo', variant: 'destructive' });
      } finally {
        setIsSubmitting(false);
      }
    }
    fetchVehicle();
  }, [params.id, reset, toast]);

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

  async function onSubmit(data: VehicleFormData) {
    try {
      await api.patch(`/vehicles/${params.id}`, data);
      toast({ title: 'Veículo atualizado com sucesso!', variant: 'success' });
      router.push('/veiculos');
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      toast({ title: 'Erro ao atualizar veículo', variant: 'destructive' });
    }
  }

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Editar veículo'
          subtitle='Atualize as informações do veículo selecionado.'
          backHref={`/veiculos/${params.id}`}
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
              <input
                type='text'
                id='clientId'
                disabled
                value={vehicle?.client?.name || ''}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none cursor-not-allowed'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='plate'
                className='text-sm text-LIGHT_500'
              >
                Placa
              </label>
              <input
                type='text'
                id='plate'
                {...register('plate')}
                placeholder='ABC-1234 ou BRA0A12'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              />
              {errors.plate && (
                <span className='text-red-500 text-xs'>
                  {errors.plate.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
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
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              />
              {errors.brand && (
                <span className='text-red-500 text-xs'>
                  {errors.brand.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
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
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              />
              {errors.model && (
                <span className='text-red-500 text-xs'>
                  {errors.model.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
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
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              />
              {errors.year && (
                <span className='text-red-500 text-xs'>
                  {errors.year.message}
                </span>
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
