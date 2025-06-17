import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-LIGHT_100 hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-accent hover:bg-accent/10 hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',

        // ✅ CUSTOM VARIANTS DO SISTEMA

        action:
          'bg-TINTS_CARROT_100 text-LIGHT_200 font-semibold hover:bg-TINTS_CARROT_100/90 px-6 py-2 rounded-lg', // Finalizar Atendimento

        confirm:
          'bg-TINTS_CARROT_100 text-LIGHT_200 font-semibold hover:bg-TINTS_CARROT_100/90 px-6 py-2 rounded-lg', // Confirmar

        cancel:
          'bg-TINTS_TOMATO_100 text-LIGHT_200 font-semibold px-6 py-2 rounded-lg', // Cancelar modal

        logout:
          'bg-TINTS_CARROT_100 text-DARK_100 font-semibold px-4 py-2 rounded', // Botão de logout

        loading:
          'bg-TINTS_CARROT_100 text-LIGHT_100 font-bold py-3 px-6 rounded-md hover:bg-[#d98b3e]', // LoadingButton

        linkPrimary:
          'bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-TINTS_CARROT_100/90', // Nova Ordem

        linkEdit:
          'bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/90', // Editar

        linkBack:
          'bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10', // Voltar
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
