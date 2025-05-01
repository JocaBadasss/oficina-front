'use client';

import { Aside } from '@/components/Aside';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .refine((val) => /^\d{10,11}$/.test(val), {
      message: 'Formato inválido de telefone',
    }),
  document: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(\d{3}\.\d{3}\.\d{3}\-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2})$/.test(
          val
        ),
      {
        message: 'CPF ou CNPJ inválido',
      }
    ),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function NovoClientePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  function onSubmit(data: ClientFormData) {
    console.log('Cliente:', data);
  }

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Novo Cliente</h1>
            <p className='text-LIGHT_500 mt-1'>
              Adicione um novo cliente ao sistema.
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
                htmlFor='document'
                className='text-sm text-LIGHT_500'
              >
                CPF ou CNPJ
              </label>
              <input
                type='text'
                id='document'
                {...register('document')}
                placeholder='000.000.000-00 ou 00.000.000/0000-00'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
              />
              {errors.document && (
                <span className='text-red-500 text-xs'>
                  {errors.document.message}
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
                Salvar Cliente
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
