'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/toaster';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function UiTokensPage() {
  return (
    <AppLayout>
      <main className='flex flex-col gap-8 p-6 bg-app-background text-foreground'>
        <h1 className='text-3xl font-bold'>Teste de Variáveis e Componentes</h1>

        <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Input padrão */}
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              placeholder='seuemail@exemplo.com'
            />
          </div>

          {/* Textarea */}
          <div>
            <Label htmlFor='mensagem'>Mensagem</Label>
            <Textarea
              id='mensagem'
              placeholder='Digite algo...'
            />
          </div>

          {/* Botões */}
          <div className='flex flex-wrap gap-2'>
            {/* Variants padrões */}
            <Button variant='default'>Padrão</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='destructive'>Destrutivo</Button>
            <Button variant='secondary'>Secundário</Button>

            {/* Variants reais do sistema (ainda sem estilo definido) */}
            <Button variant='action'>Finalizar Atendimento</Button>
            <Button variant='confirm'>Confirmar</Button>
            <Button variant='cancel'>Cancelar</Button>
            <Button variant='logout'>Logout</Button>
            <Button variant='loading'>Enviando...</Button>

            <Button
              variant='linkPrimary'
              asChild
            >
              <Link href='#'>Nova Ordem</Link>
            </Button>

            <Button
              variant='linkEdit'
              asChild
            >
              <Link href='#'>Editar</Link>
            </Button>

            <Button
              variant='linkBack'
              asChild
            >
              <Link href='#'>Voltar</Link>
            </Button>
          </div>

          {/* Calendar */}
          <div>
            <Label>Calendário</Label>
            <Calendar
              mode='single'
              selected={new Date()}
              onSelect={() => {}}
              className='border border-border rounded-md'
            />
          </div>

          {/* Popover com Command */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>Abrir Popover</Button>
              </PopoverTrigger>
              <PopoverContent className='w-80'>
                <Command>
                  <CommandInput placeholder='Buscar item...' />
                  <CommandList>
                    <CommandEmpty>Nenhum resultado.</CommandEmpty>
                    <CommandItem>Item 1</CommandItem>
                    <CommandItem>Item 2</CommandItem>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Dialog */}
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>Abrir Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Título do Dialog</DialogTitle>
                  <DialogDescription>
                    Descrição do conteúdo do dialog.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sheet */}
          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline'>Abrir Sheet</Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <div className='p-4'>Conteúdo lateral do sheet</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* ScrollArea + Skeleton */}
          <div>
            <ScrollArea className='h-32 w-full rounded-md border border-border p-4'>
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className='mb-2'
                >
                  <Skeleton className='h-4 w-full' />
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Badge */}
          <div className='flex gap-2'>
            <Badge>Badge padrão</Badge>
            <Badge variant='secondary'>Badge secundária</Badge>
          </div>

          {/* Card */}
          <div>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle className='text-xl'>Componente Card</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground'>
                  Este é um exemplo de card estilizado com as variáveis padrão.
                </p>
                <Button variant='default'>Ação Primária</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Toast */}
        <Toaster />
      </main>
    </AppLayout>
  );
}
