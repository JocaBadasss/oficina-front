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
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { api } from '@/services/api';
import { handleAxiosError } from '@/utils/Axios/handleAxiosErrors';

export function FinalizarAtendimentoModal({
  orderId,
  onSuccess,
}: {
  orderId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const form = new FormData();
      form.append('description', description);
      files.forEach((f) => form.append('files', f));

      await api.post(`/service-reports/${orderId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setOpen(false);
      onSuccess();
    } catch (err) {
      handleAxiosError(err, 'Erro ao finalizar atendimento');
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
        <button className='bg-TINTS_CARROT_100 hover:bg-TINTS_CARROT_100/90 text-LIGHT_200 font-semibold px-6 py-2 rounded-lg transition'>
          Finalizar Atendimento
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[48rem] max-h-[80vh] border-none bg-DARK_600'>
        <DialogHeader>
          <DialogTitle>Finalizar Atendimento</DialogTitle>
          <DialogDescription>
            Escreva aqui o relatório de conclusão e, se quiser, anexe fotos.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <Textarea
            rows={4}
            placeholder='Digite o relatório de serviço...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-DARK_900 bg-DARK_800'
          />
          <Input
            type='file'
            multiple
            onChange={(e) =>
              setFiles(e.target.files ? Array.from(e.target.files) : [])
            }
            className='border-DARK_900 bg-DARK_800 hover:cursor-pointer'
          />
        </div>
        <DialogFooter className='space-x-2'>
          <Button
            variant='secondary'
            onClick={() => setOpen(false)}
            disabled={loading}
            className=' px-6 py-2 bg-TINTS_TOMATO_100  text-LIGHT_200 font-semibold rounded-lg transition'
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className='bg-TINTS_CARROT_100 hover:bg-TINTS_CARROT_100/90 text-LIGHT_200 font-semibold px-6 py-2 rounded-lg transition'
          >
            {loading ? 'Enviando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
