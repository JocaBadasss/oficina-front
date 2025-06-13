'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { smartFormatPlate } from '@/utils/helpers/vehicles';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsDown } from 'lucide-react';
import {
  CommandEmpty,
  CommandGroup,
  Command,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { LoadingButton } from '@/components/LoadingButton';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';

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

export default function NovoVeiculoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchClients() {
      try {
        setIsSubmitting(true);

        const response = await api.get('/clients');
        setClients(response.data);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setIsSubmitting(false);
      }
    }
    fetchClients();
  }, [toast]);

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
      await api.post('/vehicles', data);
      toast({
        title: 'Veículo criado com sucesso!',
        variant: 'success',
      });
      router.push('/veiculos');
    } catch (error) {
      console.log(error);
      console.error('Erro ao criar veículo:', error);
      toast({
        title: 'Erro ao criar veículo',
        variant: 'destructive',
      });
    }
  }

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Novo Veículo'
          subtitle='Cadastre uma novo veículo.'
          backHref='/veiculos'
        />

        <section className='bg-muted rounded-lg p-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='clientId'
                className='text-sm text-subtle-foreground'
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
                      className='p-0 mt-1 z-50 w-[var(--radix-popover-trigger-width)] border border-border bg-background text-foreground shadow-lg rounded-none'
                      align='start'
                      sideOffset={4}
                    >
                      <Command className='bg-background'>
                        <CommandInput
                          placeholder='Buscar cliente...'
                          className='h-9 bg-background placeholder:text-placeholder'
                        />
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>

                        <CommandGroup className='bg-background'>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.name}
                              className='px-4 py-2 text-sm text-foreground bg-background hover:bg-hover cursor-pointer'
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
              {errors.clientId && (
                <span className='text-red-500 text-xs'>
                  {errors.clientId.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='plate'
                className='text-sm text-subtle-foreground'
              >
                Placa
              </label>
              <input
                type='text'
                id='plate'
                {...register('plate')}
                placeholder='ABC-1234 ou BRA0A12'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none placeholder:text-placeholder'
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
                className='text-sm text-subtle-foreground'
              >
                Marca
              </label>
              <input
                type='text'
                id='brand'
                {...register('brand')}
                placeholder='Ex: Volkswagen'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none placeholder:text-placeholder'
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
                className='text-sm text-subtle-foreground'
              >
                Modelo
              </label>
              <input
                type='text'
                id='model'
                {...register('model')}
                placeholder='Ex: Fusca'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none placeholder:text-placeholder'
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
                className='text-sm text-subtle-foreground'
              >
                Ano
              </label>
              <input
                type='number'
                id='year'
                {...register('year', { valueAsNumber: true })}
                placeholder='Ex: 1989'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground outline-none placeholder:text-placeholder'
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
                Salvar Veículo
              </LoadingButton>
            </div>
          </form>
        </section>
      </main>
    </AppLayout>
  );
}
