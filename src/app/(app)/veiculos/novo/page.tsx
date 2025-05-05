'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/services/api';
import { Aside } from '@/components/Aside';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
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

export default function NovoVeiculoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },

    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get('/clients');
        setClients(response.data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar clientes',
          variant: 'destructive',
        });
      }
    }
    fetchClients();
  }, [toast]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'plate' && value.plate) {
        const raw = value.plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
        let formatted = raw;
        if (raw.length > 3) {
          formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}`;
        }

        // Só atualiza se for diferente
        if (formatted !== value.plate) {
          setValue('plate', formatted);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  async function onSubmit(data: VehicleFormData) {
    try {
      await api.post('/vehicles', data);
      toast({
        title: 'Veículo criado com sucesso!',
        variant: 'success',
      });
      router.push('/veiculos');
    } catch (error) {
      toast({
        title: 'Erro ao criar veículo',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Novo Veículo</h1>
            <p className='text-LIGHT_500 mt-1'>
              Cadastre um novo veículo no sistema.
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
                Salvar Veículo
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
