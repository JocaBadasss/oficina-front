import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { ChevronsDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions = [
  { value: '', label: 'Todos os status', badgeClass: '' },
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

export function StatusFilterComponent({
  statusFilter,
  setStatusFilter,
}: {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}) {
  const current = statusOptions.find((s) => s.value === statusFilter);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='flex items-center justify-between gap-2 border border-border rounded-md pl-4 pr-2 py-2 text-sm bg-background text-foreground hover:bg-hover transition w-full sm:w-auto min-w-[10rem] text-center'>
          <span>{current?.label || 'Todos os status'}</span>
          <ChevronsDown className='w-4 h-4 text-muted-foreground' />
        </button>
      </PopoverTrigger>
      <PopoverContent className='p-0 mt-2 w-[12.5rem]'>
        <Command>
          <CommandGroup>
            {statusOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                className='cursor-pointer py-2 flex items-center justify-between text-sm'
                onSelect={() => setStatusFilter(option.value)}
              >
                <span
                  className={cn(
                    'rounded px-2 py-1 text-xs font-medium min-w-24 text-center w-[90%] relative',
                    option.badgeClass
                  )}
                >
                  {option.label}
                </span>
                {statusFilter === option.value && (
                  <Check className='w-4 h-4 text-muted-foreground absolute right-1' />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
