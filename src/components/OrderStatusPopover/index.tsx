'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { ChevronsDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const statusOptions = [
  {
    value: 'AGUARDANDO',
    label: 'Aguardando',
    badgeClass: 'bg-border text-foreground',
  },
  {
    value: 'EM_ANDAMENTO',
    label: 'Em andamento',
    badgeClass: 'bg-tertiary text-tertiary-foreground',
  },
  {
    value: 'FINALIZADO',
    label: 'Finalizado',
    badgeClass: 'bg-success text-success-foreground',
  },
];

interface Props {
  status: 'AGUARDANDO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  onChange: (newStatus: 'EM_ANDAMENTO') => Promise<void>;
}

export function OrderStatusPopover({ status, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const current = statusOptions.find((s) => s.value === status);

  const handleClick = async (value: 'EM_ANDAMENTO') => {
    if (status !== 'AGUARDANDO') return;
    setLoading(true);
    await onChange(value);
    setLoading(false);
    setOpen(false);
  };

  // FINALIZADO → só badge visual (sem popover)
  if (status === 'FINALIZADO') {
    return (
      <span
        className={cn(
          'rounded px-2 py-1 text-xs font-medium min-w-24 text-center inline-block',
          current?.badgeClass
        )}
      >
        {current?.label}
      </span>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center justify-between gap-2 border border-border rounded-md pl-3 pr-2 py-1.5 text-xs bg-background text-foreground hover:bg-hover transition w-[160px] h-8',
            current?.badgeClass
          )}
        >
          <span className='truncate'>{current?.label}</span>
          <ChevronsDown className='w-4 h-4 text-muted-foreground' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='p-0 mt-2 w-[12.5rem]'>
        <Command>
          <CommandGroup>
            <CommandItem
              key='EM_ANDAMENTO'
              value='EM_ANDAMENTO'
              className='cursor-pointer py-2 flex items-center justify-between text-sm'
              onSelect={() => handleClick('EM_ANDAMENTO')}
            >
              <span
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium min-w-24 text-center w-[90%] relative',
                  statusOptions[1].badgeClass
                )}
              >
                Em andamento
              </span>
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin absolute right-1' />
              ) : (
                <Check className='w-4 h-4 text-muted-foreground absolute right-1' />
              )}
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
