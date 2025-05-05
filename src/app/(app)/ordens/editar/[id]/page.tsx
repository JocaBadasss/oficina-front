'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Aside } from '@/components/Aside';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const orderSchema = z.object({
  fuelLevel: z.string().min(1, 'Nível de combustível é obrigatório'),
  adblueLevel: z.string().min(1, 'Nível de Arla é obrigatório'),
  km: z
    .number({ invalid_type_error: 'KM deve ser um número' })
    .min(0, 'KM inválido'),
  tireStatus: z.string().min(1, 'Estado dos pneus é obrigatório'),
  mirrorStatus: z.string().min(1, 'Espelhos é obrigatório'),
  paintingStatus: z.string().min(1, 'Pintura é obrigatória'),
  complaints: z.string().min(1, 'Reclamação é obrigatória'),
  notes: z.string().optional(),
  status: z.string().min(1, 'Status é obrigatório'),
});

const fuelLevels = [
  { label: 'Reserva', value: 'RESERVA' },
  { label: '1/4', value: 'QUARTO' },
  { label: 'Metade', value: 'METADE' },
  { label: '3/4', value: 'TRES_QUARTOS' },
  { label: 'Cheio', value: 'CHEIO' },
];
const adblueLevels = ['VAZIO', 'BAIXO', 'METADE', 'CHEIO'];
const tireStatuses = ['RUIM', 'REGULAR', 'BOM', 'NOVO'];
const mirrorStatuses = ['OK', 'QUEBRADO', 'RACHADO', 'FALTANDO'];
const paintingStatuses = ['INTACTA', 'ARRANHADA', 'AMASSADA', 'REPARADA'];
const statusOptions = [
  { label: 'Aguardando', value: 'AGUARDANDO' },
  { label: 'Em andamento', value: 'EM_ANDAMENTO' },
  { label: 'Finalizado', value: 'FINALIZADO' },
];

export default function EditarOrdemPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(orderSchema) });

  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await api.get(`/service-orders/${id}`);
        reset(response.data);
      } catch (error) {
        toast({ title: 'Erro ao carregar ordem', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, reset, toast]);

  async function onSubmit(data) {
    try {
      await api.patch(`/service-orders/${id}`, data);
      toast({ title: 'Ordem atualizada com sucesso!', variant: 'success' });
      router.push('/ordens');
    } catch (error) {
      toast({ title: 'Erro ao atualizar ordem', variant: 'destructive' });
    }
  }

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Editar Ordem</h1>
            <p className='text-LIGHT_500 mt-1'>
              Atualize os dados da ordem de serviço.
            </p>
          </div>

          <Link
            href='/ordens'
            className='bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10 transition flex items-center gap-2'
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </header>

        <section className='bg-DARK_700 rounded-lg p-6'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'
          >
            <div className='flex flex-col gap-2'>
              <label
                htmlFor='fuelLevel'
                className='text-sm text-LIGHT_500'
              >
                Nível de Combustível
              </label>
              <select
                id='fuelLevel'
                {...register('fuelLevel')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione</option>
                {fuelLevels.map(({ label, value }) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.fuelLevel && (
                <span className='text-red-500 text-xs'>
                  {errors.fuelLevel.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='adblueLevel'
                className='text-sm text-LIGHT_500'
              >
                Nível de Adblue
              </label>
              <select
                id='adblueLevel'
                {...register('adblueLevel')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione</option>
                {adblueLevels.map((level) => (
                  <option
                    key={level}
                    value={level}
                  >
                    {level}
                  </option>
                ))}
              </select>
              {errors.adblueLevel && (
                <span className='text-red-500 text-xs'>
                  {errors.adblueLevel.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='km'
                className='text-sm text-LIGHT_500'
              >
                KM Atual
              </label>
              <input
                type='number'
                id='km'
                {...register('km', { valueAsNumber: true })}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              />
              {errors.km && (
                <span className='text-red-500 text-xs'>
                  {errors.km.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='tireStatus'
                className='text-sm text-LIGHT_500'
              >
                Estado dos Pneus
              </label>
              <select
                id='tireStatus'
                {...register('tireStatus')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione</option>
                {tireStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
              {errors.tireStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.tireStatus.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='mirrorStatus'
                className='text-sm text-LIGHT_500'
              >
                Espelhos
              </label>
              <select
                id='mirrorStatus'
                {...register('mirrorStatus')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione</option>
                {mirrorStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
              {errors.mirrorStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.mirrorStatus.message}
                </span>
              )}
            </div>

            <div className='flex flex-col gap-2'>
              <label
                htmlFor='paintingStatus'
                className='text-sm text-LIGHT_500'
              >
                Pintura
              </label>
              <select
                id='paintingStatus'
                {...register('paintingStatus')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione</option>
                {paintingStatuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
              {errors.paintingStatus && (
                <span className='text-red-500 text-xs'>
                  {errors.paintingStatus.message}
                </span>
              )}
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
              <label
                htmlFor='complaints'
                className='text-sm text-LIGHT_500'
              >
                Reclamações
              </label>
              <textarea
                id='complaints'
                {...register('complaints')}
                placeholder='Descreva as reclamações do cliente...'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none min-h-[100px]'
              />
              {errors.complaints && (
                <span className='text-red-500 text-xs'>
                  {errors.complaints.message}
                </span>
              )}
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
              <label
                htmlFor='notes'
                className='text-sm text-LIGHT_500'
              >
                Observações (opcional)
              </label>
              <textarea
                id='notes'
                {...register('notes')}
                placeholder='Informações adicionais...'
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm text-LIGHT_100 outline-none min-h-[80px]'
              />
            </div>

            <div className='md:col-span-2 flex flex-col gap-2'>
              <label
                htmlFor='status'
                className='text-sm text-LIGHT_500'
              >
                Status da Ordem
              </label>
              <select
                id='status'
                {...register('status')}
                className='bg-DARK_800 border border-DARK_900 rounded-md px-4 py-2 text-sm font-semibold text-LIGHT_100 outline-none'
              >
                <option value=''>Selecione</option>
                {statusOptions.map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <span className='text-red-500 text-xs'>
                  {errors.status.message}
                </span>
              )}
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
