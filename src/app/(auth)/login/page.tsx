'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { extractErrorMessage } from '@/utils/Axios/extractErrorMessage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginSchema) {
    setGeneralError(''); // limpa erro geral antes
    try {
      await login(data);
      router.refresh();
      router.replace('/painel');
    } catch (error) {
      const message = extractErrorMessage(error);

      if (message === 'Credenciais inválidas') {
        setGeneralError('Email ou senha incorretos.');
      } else {
        toast({
          title: 'Erro ao logar',
          description: message,
          variant: 'destructive',
        });
      }
    }
  }

  return (
    <div className='flex flex-col md:flex-row h-screen overflow-hidden'>
      <div className='hidden md:flex md:w-1/2 items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='flex items-center justify-center mb-4'>
            <Image
              src='/gearIcon.svg'
              alt='Ícone de engrenagem'
              className='w-12 h-12'
              width={48}
              height={48}
            />
            <h1 className='text-3xl font-bold text-brand'>OFICINA</h1>
          </div>
          <p className='text-muted-foreground text-lg'>
            Confiança e qualidade no serviço.
          </p>
        </div>
      </div>

      <div className='flex-1 flex items-center justify-center bg-secondary h-full'>
        <div className='w-full max-w-sm px-6 py-8 sm:px-8'>
          <div className='flex items-center justify-center flex-col'>
            <div className='flex items-center justify-center mb-4 md:hidden gap-2'>
              <Image
                src='/gearIcon.svg'
                alt='Ícone de engrenagem'
                className='w-12 h-12'
                width={48}
                height={48}
              />
              <h1 className='text-3xl font-bold text-primary'>OFICINA</h1>
            </div>
            <h2 className='text-2xl font-bold text-center mb-6 text-brand'>
              Faça login
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            {/* Email */}
            <div className='grid w-full items-center gap-1.5'>
              <Label
                htmlFor='email'
                className='text-muted-foreground'
              >
                Email
              </Label>
              <Input
                id='email'
                type='text'
                placeholder='seuemail@exemplo.com'
                className='bg-muted border border-border text-foreground mt-1 placeholder:text-placeholder'
                {...register('email')}
              />
              <p className='text-destructive text-xs h-[0.75rem] mt-1'>
                {errors.email?.message || '\u00A0'}
              </p>
            </div>

            {/* Senha */}
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='password'>Senha</Label>
              <Input
                id='password'
                type='password'
                placeholder='************'
                className='bg-muted border border-border text-foreground mt-1 placeholder:text-placeholder'
                {...register('password')}
              />
              <p className='text-destructive text-xs h-[0.75rem] mt-1'>
                {errors.password?.message || '\u00A0'}
              </p>
            </div>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-brand text-primaryForeground hover:bg-brand/90 '
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className='text-destructive text-sm text-center mt-2 h-[1.25rem]'>
              {generalError}
            </p>
          </form>

          <p className='text-center text-sm text-muted-foreground hover:underline cursor-pointer pt-4'>
            Esqueceu sua senha?
          </p>
        </div>
      </div>
    </div>
  );
}
