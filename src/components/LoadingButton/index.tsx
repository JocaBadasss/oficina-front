'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface LoadingButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function LoadingButton({
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      type='submit'
      disabled={isLoading || disabled}
      className={cn(
        'w-full bg-TINTS_CARROT_100 text-LIGHT_100 font-bold py-3 px-6 rounded-md hover:bg-[#d98b3e] transition-colors flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className='w-4 h-4 animate-spin' />}
      {children}
    </Button>
  );
}
