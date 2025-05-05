'use client';

import { useEffect } from 'react';
import { Aside } from '@/components/Aside';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { mask } from 'remask';
import { useToast } from '@/components/ui/use-toast';

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
        const response = await api.get(`/clients/${params.id}`);
        const { name, email, phone, address, cpf, cnpj } = response.data;
        setValue('name', name);
        setValue('email', email);
        setValue('phone', mask(phone, ['(99) 99999-9999']));
        setValue('address', address);
        setValue(
          'cpfOrCnpj',
          mask(cpf || cnpj, ['999.999.999-99', '99.999.999/9999-99'])
        );
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        toast({
          title: 'Erro ao carregar cliente.',
          variant: 'destructive',
        });
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
        cpf: data.cpfOrCnpj?.length === 11 ? data.cpfOrCnpj : undefined,
        cnpj: data.cpfOrCnpj?.length === 14 ? data.cpfOrCnpj : undefined,
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
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Editar Cliente</h1>
            <p className='text-LIGHT_500 mt-1'>
              Atualize as informações do cliente.
            </p>
          </div>

          <Link
            href='/clientes'
            className='bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10 transition self-start md:self-auto flex items-center gap-2'
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </header>

        <section className='bg-DARK_700 rounded-lg p-6 space-y-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='name'
                className='text-sm text-LIGHT_500'
              >
                Nome
              </label>
              <input
                type='text'
                id='name'
                {...register('name')}
                placeholder='Ex: João da Silva'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                {...register('email')}
                placeholder='exemplo@email.com'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                Telefone
              </label>
              <input
                type='text'
                id='phone'
                {...register('phone')}
                onChange={(e) =>
                  setValue('phone', mask(e.target.value, ['(99) 99999-9999']))
                }
                value={watch('phone') || ''}
                placeholder='(00) 00000-0000'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                CPF ou CNPJ
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
                placeholder='000.000.000-00 ou 00.000.000/0001-00'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
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
                className='text-sm text-LIGHT_500'
              >
                Endereço
              </label>
              <input
                type='text'
                id='address'
                {...register('address')}
                placeholder='Rua Exemplo, 123'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
              />
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
