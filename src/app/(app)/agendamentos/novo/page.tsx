'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { mask } from 'remask';
import { CheckCircle2 } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { AppLayout } from '@/components/AppLayout';
import { AxiosError } from 'axios';
import { PageHeader } from '@/components/PageHeader';
import { smartFormatPlate } from '@/utils/helpers/vehicles';
import { LoadingButton } from '@/components/LoadingButton';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
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

interface ValidationErrorResponse {
  statusCode: number;
  code: string;
  message:
    | string
    | {
        code: string;
        message: string[];
      };
}

type FormData = z.infer<typeof schema>;

const initialToast = {
  title: 'Agendamento criado com sucesso!',
  description: 'Você receberá uma confirmação por WhatsApp em breve.',
  variant: 'success' as const,
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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedTime = watch('time');
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

  useEffect(() => {
    if (!date) return;

    const formattedDate = format(date, 'yyyy-MM-dd');
    setValue('date', formattedDate);

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
  }, [date, setValue, toast]);

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
        cpfOrCnpj: data.cpf.replace(/\D/g, ''),
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
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as ValidationErrorResponse;

      let errorMessage = 'Erro ao criar agendamento';

      if (typeof errorData?.message === 'string') {
        errorMessage = errorData.message;
      } else if (Array.isArray(errorData?.message?.message)) {
        errorMessage = errorData.message.message.join(', ');
      }

      toast({
        title: 'Erro ao criar agendamento',
        description: errorMessage,
        variant: 'destructive',
      });
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
    <AppLayout>
      <main className='flex-1 p-6 space-y-6'>
        <PageHeader
          title='Novo agendamento'
          backHref='/agendamentos'
        />

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
              modifiersClassNames={{ weekend: 'bg-TINTS_TOMATO_200' }}
              modifiers={{ weekend: (day) => [0, 6].includes(day.getDay()) }}
              disabled={(d) => [0, 6].includes(d.getDay())}
              className='max-w-sm flex justify-center self-center w-full rounded-md border border-DARK_900 bg-DARK_800 text-LIGHT_100 shadow-md'
            />
          </div>
        </section>

        {date && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6'
          >
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
                        setValue(
                          'cpf',
                          mask(e.target.value, ['999.999.999-99'])
                        )
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

                <LoadingButton
                  type='submit'
                  isLoading={isSubmitting}
                >
                  Agendar
                </LoadingButton>
              </section>
            )}
          </form>
        )}
      </main>
    </AppLayout>
  );
}
