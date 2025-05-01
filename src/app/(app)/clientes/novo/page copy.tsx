'use client';

import { Aside } from '@/components/Aside';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NovoClientePage() {
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
          <form className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                placeholder='Ex: João da Silva'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
              />
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
                placeholder='exemplo@email.com'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
              />
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
                placeholder='(00) 00000-0000'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='cpf'
                className='text-sm text-LIGHT_500'
              >
                CPF
              </label>
              <input
                type='text'
                id='cpf'
                placeholder='000.000.000-00'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
              />
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
