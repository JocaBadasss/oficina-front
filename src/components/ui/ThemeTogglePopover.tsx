'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface Props {
  showPopover: boolean;
  dismissPopover: () => void;
  isMobile: boolean;
}

export function ThemeTogglePopover({
  showPopover,
  dismissPopover,
  isMobile,
}: Props) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    dismissPopover();
  };

  return (
    <Popover
      open={showPopover}
      onOpenChange={dismissPopover}
    >
      <PopoverTrigger asChild>
        <button
          onClick={toggleTheme}
          className='flex gap-2 items-center cursor-pointer hover:text-tertiary transition'
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={isMobile ? 'end' : 'start'}
        side={isMobile ? 'top' : 'right'}
        className='bg-muted border border-border text-foreground rounded-lg text-sm shadow-md p-4'
      >
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, -5, 5, -5, 5, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
        >
          {isMobile ? (
            <span>
              Troque o tema clicando em <strong>&#34;Mais&#34;</strong> e depois
              selecione o modo.
            </span>
          ) : (
            <span>Experimente alternar as cores da aplicação! <br /> <br />Clicando no modo a esquerda.</span>
          )}
        </motion.div>

        <button
          className='mt-2 text-xs underline hover:text-tertiary transition'
          onClick={dismissPopover}
        >
          Entendi
        </button>
      </PopoverContent>
    </Popover>
  );
}
