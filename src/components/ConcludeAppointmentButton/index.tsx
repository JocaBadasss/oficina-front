'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { api } from '@/services/api';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';

type Props = {
  appointmentId: string;
  disabled?: boolean;
  onSuccess?: () => void;
};

export function ConcludeAppointmentButton({
  appointmentId,
  disabled,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConclude = async () => {
    setLoading(true);
    try {
      await api.patch(`/appointments/${appointmentId}`, {
        status: 'CONCLUIDO',
      });

      toast({
        description: 'Agendamento concluído com sucesso!',
      });

      // 🔥 Chama o callback
      onSuccess?.();
    } catch (err) {
      handleAxiosError(err, 'Erro ao concluir agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className='bg-tertiary hover:bg-hover text-muted-foreground font-semibold px-6 py-2 rounded-lg transition'
          disabled={disabled || loading}
        >
          Concluir agendamento
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Concluir este agendamento?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação irá marcar o agendamento como <strong>concluído</strong>.
            Deseja continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className='bg-destructive hover:bg-destructive/70 text-destructive-foreground'
            disabled={loading}
          >
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={handleConclude}
            disabled={loading}
            className='bg-tertiary hover:bg-tertiary/70 text-muted-foreground font-semibold px-6 py-2 rounded-lg transition'
          >
            {loading ? 'Enviando...' : 'Confirmar'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
