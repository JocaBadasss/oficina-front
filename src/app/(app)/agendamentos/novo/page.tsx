'use client';

import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { Aside } from '@/components/Aside';
import { mask } from 'remask';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  plate: z.string().min(7, 'Placa é obrigatória'),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z
    .union([z.number(), z.nan()])
    .optional()
    .transform((val) => {
      if (typeof val !== 'number' || isNaN(val)) return undefined;
      return val;
    }),
  date: z.string(),
  time: z.string().min(1, 'Escolha um horário'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const initialToast: {
  title: string;
  description: string;
  variant: 'success';
  duration: number;
  icon: JSX.Element;
} = {
  title: 'Agendamento criado com sucesso!',
  description: 'Você receberá uma confirmação por WhatsApp em breve.',
  variant: 'success',
  duration: 7000,
  icon: <CheckCircle2 className='text-TINTS_MINT_100' />,
};

export default function NovoAgendamentoPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const selectedTime = watch('time');

  if (!date) return;

  const formattedDate = format(date, 'yyyy-MM-dd');

  async function fetchTimes() {
    setLoadingTimes(true);
    try {
      const res = await api.get('/appointments/available/hours', {
        params: { date: formattedDate },
      });
      setAvailableTimes(res.data);
    } catch (err) {
      console.log(err);
      toast({ title: 'Erro ao carregar horários', variant: 'destructive' });
    } finally {
      setLoadingTimes(false);
    }
  }

  fetchTimes();
  setValue('date', formattedDate);

  async function onSubmit(data: FormData) {
    try {
      setIsSubmitting(true);

      const dateTime = parse(
        `${data.date} ${data.time}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );
      const isoDate = dateTime.toISOString();

      const payload = {
        name: data.name,
        phone: data.phone.replace(/\D/g, ''),
        cpf: data.cpf.replace(/\D/g, ''),
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        date: isoDate,
        notes: data.notes,
      };

      await api.post('/public-appointments', payload);
      toast(initialToast);
      setShowSuccess(true);
      setTimeout(() => router.push('/agendamentos'), 2000);
    } catch (err) {
      console.log(err);
      toast({ title: 'Erro ao criar agendamento', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showSuccess) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-DARK_400 text-LIGHT_100'>
        <div className='flex flex-col items-center gap-4'>
          <CheckCircle2 className='h-16 w-16 text-TINTS_MINT_100 animate-pulse' />
          <h1 className='text-2xl font-bold'>Agendamento confirmado!</h1>
          <p className='text-LIGHT_500 text-center max-w-sm'>
            Você será redirecionado em instantes. Obrigado por agendar conosco.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <h1 className='text-3xl font-bold font-roboto'>Novo Agendamento</h1>
        <p className='text-LIGHT_500'>
          Escolha a data e horário disponíveis e preencha os dados.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
            <h2 className='text-xl font-semibold text-LIGHT_200'>
              Escolha a data
            </h2>
            <div className='flex justify-center items-center'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                modifiersClassNames={{
                  weekend: 'bg-TINTS_TOMATO_200',
                }}
                modifiers={{
                  weekend: (day) => {
                    const dayIndex = day.getDay(); // 0 = Domingo, 6 = Sábado
                    return dayIndex === 0 || dayIndex === 6;
                  },
                }}
                disabled={(date) => {
                  const d = date.getDay();
                  return d === 0 || d === 6; // Domingo ou Sábado
                }}
                className='max-w-sm flex justify-center self-center w-full rounded-md border border-DARK_900 bg-DARK_800 text-LIGHT_100 shadow-md'
              />
            </div>
          </section>

          {date && (
            <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
              <h2 className='text-xl font-semibold text-LIGHT_200'>
                Horários disponíveis
              </h2>
              {loadingTimes ? (
                <p className='text-LIGHT_500'>Carregando horários...</p>
              ) : availableTimes.length === 0 ? (
                <p className='text-LIGHT_500'>
                  Nenhum horário disponível para este dia.
                </p>
              ) : (
                <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
                  {availableTimes.map((time) => (
                    <Button
                      type='button'
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      onClick={() => setValue('time', time)}
                      className='text-sm'
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}
              {errors.time && (
                <span className='text-red-500 text-sm'>
                  {errors.time.message}
                </span>
              )}
            </section>
          )}

          {selectedTime && (
            <section className='bg-DARK_700 rounded-lg p-6 space-y-4'>
              <h2 className='text-xl font-semibold text-LIGHT_200'>
                Seus dados
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='name'
                    className='text-sm text-LIGHT_500'
                  >
                    Nome
                  </label>
                  <input
                    id='name'
                    type='text'
                    placeholder='Seu nome completo'
                    {...register('name')}
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
                    htmlFor='phone'
                    className='text-sm text-LIGHT_500'
                  >
                    Telefone
                  </label>
                  <input
                    id='phone'
                    type='text'
                    placeholder='(00) 00000-0000'
                    {...register('phone')}
                    onChange={(e) =>
                      setValue(
                        'phone',
                        mask(e.target.value, ['(99) 99999-9999'])
                      )
                    }
                    value={watch('phone') || ''}
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
                    htmlFor='cpf'
                    className='text-sm text-LIGHT_500'
                  >
                    CPF
                  </label>
                  <input
                    id='cpf'
                    type='text'
                    placeholder='000.000.000-00'
                    {...register('cpf')}
                    onChange={(e) =>
                      setValue('cpf', mask(e.target.value, ['999.999.999-99']))
                    }
                    value={watch('cpf') || ''}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
                  />
                  {errors.cpf && (
                    <span className='text-red-500 text-xs'>
                      {errors.cpf.message}
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
                    id='plate'
                    type='text'
                    placeholder='ABC-1234'
                    {...register('plate')}
                    onChange={(e) => {
                      const raw = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, '');
                      let formatted = raw;
                      if (raw.length > 3)
                        formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}`;
                      setValue('plate', formatted);
                    }}
                    value={watch('plate') || ''}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
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
                    id='brand'
                    type='text'
                    placeholder='Volkswagen'
                    {...register('brand')}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='model'
                    className='text-sm text-LIGHT_500'
                  >
                    Modelo
                  </label>
                  <input
                    id='model'
                    type='text'
                    placeholder='Fusca'
                    {...register('model')}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    htmlFor='year'
                    className='text-sm text-LIGHT_500'
                  >
                    Ano
                  </label>
                  <input
                    id='year'
                    type='number'
                    placeholder='2020'
                    {...register('year', { valueAsNumber: true })}
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 placeholder:text-LIGHT_500 outline-none'
                  />
                </div>

                <div className='md:col-span-2 flex flex-col gap-2'>
                  <label
                    htmlFor='notes'
                    className='text-sm text-LIGHT_500'
                  >
                    Observações
                  </label>
                  <textarea
                    id='notes'
                    {...register('notes')}
                    placeholder='Descreva o problema ou observação...'
                    className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 min-h-[100px] outline-none placeholder:text-LIGHT_500'
                  />
                </div>
              </div>

              <Button
                type='submit'
                disabled={isSubmitting}
                className='mt-4'
              >
                {isSubmitting && (
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                )}{' '}
                Agendar
              </Button>
            </section>
          )}
        </form>
      </main>
    </div>
  );
}
