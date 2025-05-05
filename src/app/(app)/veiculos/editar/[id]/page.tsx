'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/services/api';
import { Aside } from '@/components/Aside';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const vehicleSchema = z.object({
  clientId: z.string().uuid({ message: 'Cliente é obrigatório' }),
  plate: z
    .string()
    .min(8, 'Placa inválida')
    .regex(/^[A-Z]{3}-\d{4}$/, 'Formato da placa inválido'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  year: z
    .number({ invalid_type_error: 'Ano deve ser um número' })
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear(), 'Ano inválido'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

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

  const [vehicle, setVehicle] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await api.get(`/vehicles/${params.id}`);
        const data = response.data;
        setVehicle(data);
        reset({
          clientId: data.clientId,
          plate: data.plate,
          brand: data.brand,
          model: data.model,
          year: data.year,
        });
      } catch (error) {
        toast({ title: 'Erro ao carregar veículo', variant: 'destructive' });
      }
    }
    fetchVehicle();
  }, [params.id, reset, toast]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'plate' && value.plate) {
        const raw = value.plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const formatted =
          raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3, 7)}` : raw;
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
      toast({ title: 'Erro ao atualizar veículo', variant: 'destructive' });
    }
  }

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Editar Veículo</h1>
            <p className='text-LIGHT_500 mt-1'>
              Altere os dados do veículo selecionado.
            </p>
          </div>

          <Link
            href='/veiculos'
            className='bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10 transition flex items-center gap-2'
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </header>

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
                placeholder='ABC-1234'
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
              <button
                type='submit'
                className='bg-TINTS_CARROT_100 text-LIGHT_200 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/90 transition w-full md:w-auto'
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
