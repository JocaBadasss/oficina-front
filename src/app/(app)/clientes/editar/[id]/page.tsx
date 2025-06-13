'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { PageHeader } from '@/components/PageHeader';
import { AppLayout } from '@/components/AppLayout';
import { formatCpfCnpjInput, formatPhoneInput } from '@/utils/helpers/clients';
import { LoadingButton } from '@/components/LoadingButton';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpfOrCnpj: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11 || val.length === 14, {
      message: 'CPF ou CNPJ inválido',
    })
    .optional(),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function EditarClientePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    async function fetchClient() {
      try {
        setIsSubmitting(true);
        const response = await api.get(`/clients/${params.id}`);
        const { name, email, phone, address, cpfOrCnpj } = response.data;
        setValue('name', name);
        setValue('email', email);
        setValue('phone', formatPhoneInput(phone));
        setValue('address', address);
        setValue('cpfOrCnpj', formatCpfCnpjInput(cpfOrCnpj));
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        toast({
          title: 'Erro ao carregar cliente.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
    fetchClient();
  }, [params.id, setValue, toast]);

  async function onSubmit(data: ClientFormData) {
    try {
      await api.patch(`/clients/${params.id}`, {
        name: data.name,
        email: data.email,
        phone: data.phone.replace(/\D/g, ''),
        address: data.address,
        cpfOrCnpj: data.cpfOrCnpj,
      });
      toast({
        title: 'Cliente atualizado com sucesso!',
        variant: 'success',
      });
      router.push('/clientes');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      toast({
        title: 'Erro ao salvar alterações.',
        variant: 'destructive',
      });
    }
  }

  return (
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Editar Cliente'
          subtitle='Atualize as informações do cliente.'
          backHref={`/clientes/${params.id}`}
        />

        <section className='bg-muted rounded-lg p-6 space-y-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='name'
                className='text-sm text-subtle-foreground'
              >
                Nome
              </label>
              <input
                type='text'
                id='name'
                {...register('name')}
                placeholder='Ex: João da Silva'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-placeholder outline-none'
              />
              {errors.name && (
                <span className='text-red-500 text-xs'>
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='email'
                className='text-sm text-subtle-foreground'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                {...register('email')}
                placeholder='exemplo@email.com'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-placeholder outline-none'
              />
              {errors.email && (
                <span className='text-red-500 text-xs'>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='phone'
                className='text-sm text-subtle-foreground'
              >
                Telefone
              </label>
              <input
                type='text'
                id='phone'
                {...register('phone')}
                onChange={(e) =>
                  setValue('phone', formatPhoneInput(e.target.value))
                }
                value={watch('phone') || ''}
                placeholder='(00) 00000-0000'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-placeholder outline-none'
              />
              {errors.phone && (
                <span className='text-red-500 text-xs'>
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='cpfOrCnpj'
                className='text-sm text-subtle-foreground'
              >
                CPF ou CNPJ
              </label>
              <input
                type='text'
                id='cpfOrCnpj'
                {...register('cpfOrCnpj')}
                onChange={(e) =>
                  setValue('cpfOrCnpj', formatCpfCnpjInput(e.target.value))
                }
                value={watch('cpfOrCnpj') || ''}
                placeholder='000.000.000-00 ou 00.000.000/0001-00'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-placeholder outline-none'
              />
              {errors.cpfOrCnpj && (
                <span className='text-red-500 text-xs'>
                  {errors.cpfOrCnpj.message}
                </span>
              )}
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
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
                placeholder='Rua Exemplo, 123'
                className='bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground placeholder:text-placeholder outline-none'
              />
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
