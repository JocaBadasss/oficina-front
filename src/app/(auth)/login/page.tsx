'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/services/authService';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });
      router.push('/painel'); // Redireciona pro painel depois do login!
    } catch (error) {
      console.error('Erro no login', error);
      alert('Erro no login. Verifique seus dados!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
      {/* Lado Esquerdo (Desktop) */}
      <div className='hidden md:flex md:w-1/2 items-center justify-center bg-secondary'>
        <div className='text-center'>
          <div className='flex items-center justify-center mb-4'>
            <Image
              src='/gearIcon.svg'
              alt='Ícone de engrenagem'
              className='w-12 h-12'
              width={48}
              height={48}
            />

            <h1 className='text-3xl font-bold text-primary '> OFICINA</h1>
          </div>
          {/* Espaço pra imagem ou logo futuramente */}
          <p className='text-mutedForeground text-lg'>
            Confiança e qualidade no serviço.
          </p>
        </div>
      </div>

      {/* Lado Direito (Formulário) */}
      <div className='flex flex-1 items-center justify-center bg-background'>
        <div className='w-full max-w-sm p-8 '>
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
            <h2 className='text-2xl font-bold text-center mb-6 lg:text-primary'>
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
                className='text-mutedForeground'
              >
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='seuemail@exemplo.com'
                className='bg-background text-foreground'
                required
              />
            </div>

            <div className='grid w-full items-center gap-1.5'>
              <Label
                htmlFor='password'
                className='text-mutedForeground'
              >
                Senha
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='********'
                className='bg-secondary text-foreground mt-1'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full bg-primary text-primaryForeground hover:opacity-90 mt-4'
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className='text-center text-sm text-mutedForeground hover:underline cursor-pointer pt-4'>
            Esqueceu sua senha?
          </p>
        </div>
      </div>
    </div>
  );
}
