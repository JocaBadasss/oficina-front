'use client';

import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  isDetails?: boolean;
  backHref?: string;
  editHref?: string;
  showEdit?: boolean;
  rightSlot?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  isDetails = false,
  backHref,
  editHref,
  showEdit = false,
  rightSlot,
  
}: PageHeaderProps) {
  return (
    <header className='w-full px-4  md:px-6  pb-6 border-b border-border bg-app-background flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold font-roboto'>{title}</h1>
        {subtitle && (
          <p className='text-subtle-foreground mt-1 text-sm sm:text-base'>
            {subtitle}
          </p>
        )}
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
        {!isDetails && rightSlot}

        {isDetails && showEdit && editHref && (
          <Link
            href={editHref}
            className='bg-tertiary text-muted-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[hsl(var(--button-hover))] transition flex items-center justify-center gap-2'
          >
            <Pencil size={16} /> Editar
          </Link>
        )}

        {backHref && (
          <Link
            href={backHref}
            className='bg-transparent border border-tertiary text-tertiary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-tertiary/10 transition flex items-center justify-center gap-2'
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        )}
      </div>
    </header>
  );
}
