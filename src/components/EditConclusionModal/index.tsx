// components/EditConclusaoModal.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/services/api';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';

interface EditConclusaoModalProps {
  orderId: string;
  initialDescription: string;
  onSuccess: (newDescription: string) => void;
}

export function EditConclusaoModal({
  orderId,
  initialDescription,
  onSuccess,
}: EditConclusaoModalProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  // Quando o modal abrir, reseta o texto
  useEffect(() => {
    if (open) {
      setDescription(initialDescription);
    }
  }, [open, initialDescription]);

  async function handleConfirm() {
    setLoading(true);
    try {
      await api.patch(`/service-reports/${orderId}`, { description });
      setOpen(false);
      onSuccess(description);
    } catch (err) {
      handleAxiosError(err, 'Erro ao atualizar conclusão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          type='button'
          className='ml-4 text-xs font-semibold text-TINTS_CARROT_100 hover:text-TINTS_CAKE_200'
        >
          Editar
        </button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[48rem] max-h-[80vh] border-none bg-DARK_600'>
        <DialogHeader>
          <DialogTitle>Editar Conclusão</DialogTitle>
          <DialogDescription>
            Atualize o relatório de conclusão abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Textarea
            rows={4}
            placeholder='Digite a conclusão...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-DARK_900 bg-DARK_800'
          />
        </div>

        <DialogFooter className='space-x-2'>
          <Button
            variant='secondary'
            onClick={() => setOpen(false)}
            disabled={loading}
            className='px-6 py-2 bg-TINTS_TOMATO_100 text-LIGHT_200 font-semibold rounded-lg transition'
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className='bg-TINTS_CARROT_100 hover:bg-TINTS_CARROT_100/90 text-LIGHT_200 font-semibold px-6 py-2 rounded-lg transition'
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
