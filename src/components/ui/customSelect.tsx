'use client';

import { ChevronsDown } from 'lucide-react';
import { ComponentProps, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CustomSelectProps extends ComponentProps<'select'> {
  className?: string;
}

export const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className='relative w-full'>
        <select
          ref={ref}
          {...props}
          className={cn(
            'bg-background border border-border rounded-md px-4 py-2 pr-10 text-sm text-foreground appearance-none w-full',
            className
          )}
        >
          {children}  
        </select>

        <ChevronsDown className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-placeholder' />
      </div>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';
