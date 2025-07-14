'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/services/authService';
import Image from 'next/image';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //ORIGINAL AQUI ORIGINAL AQUI ORIGINAL AQUI
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) Faz o login e recebe os cookies
      await login({ email, password });

      // 2) REFRESHA o App Router inteiro, reiniciando o AuthProvider
      router.refresh();

      // 3) Aí sim, vai pro painel
      // window.location.href = '/painel';
      router.replace('/painel');
    } catch (error) {
      handleAxiosError(error, 'Erro ao logar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col md:flex-row h-screen overflow-hidden'>
      {/* Lado Esquerdo (Desktop) */}
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

            <h1 className='text-3xl font-bold text-brand '> OFICINA</h1>
          </div>
          {/* Espaço pra imagem ou logo futuramente */}
          <p className='text-muted-foreground text-lg'>
            Confiança e qualidade no serviço.
          </p>
        </div>
      </div>

      {/* Lado Direito (Formulário) */}
      <div className='flex-1 flex items-center justify-center bg-secondary  h-full'>
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

              <h1 className='text-3xl font-bold text-primary '> OFICINA</h1>
            </div>
            <h2 className='text-2xl font-bold text-center mb-6 text-brand'>
              Faça login
            </h2>
          </div>

          <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}
          >
            <div className='grid w-full items-center gap-1.5'>
              <Label
                htmlFor='email'
                className='text-muted-foreground'
              >
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='seuemail@exemplo.com'
                className='bg-muted border border-border text-foreground mt-1 placeholder:text-placeholder'
                required
              />
            </div>

            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='password'>Senha</Label>
              <Input
                id='password'
                type='password'
                placeholder='************'
                className='bg-muted border border-border text-foreground mt-1 placeholder:text-placeholder'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-brand text-primaryForeground hover:bg-brand/90 mt-4'
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className='text-center text-sm text-muted-foreground hover:underline cursor-pointer pt-4'>
            Esqueceu sua senha?
          </p>
        </div>
      </div>
    </div>
  );
}
