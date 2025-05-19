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
  userName?: string;
  onLogout?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  isDetails = false,
  backHref,
  editHref,
  showEdit = false,
  rightSlot,
  userName,
  onLogout,
}: PageHeaderProps) {
  return (
    <header
      className={`w-full px-4 py-4 md:px-6 md:py-6 border-b border-DARK_600 bg-DARK_400 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap`}
    >
      {/* Título e subtítulo */}
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold font-roboto'>{title}</h1>
        {subtitle && (
          <p className='text-LIGHT_500 mt-1 text-sm sm:text-base'>{subtitle}</p>
        )}
      </div>

      {/* Painel do usuário */}
      {userName && onLogout ? (
        <div className='flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-end'>
          <span className='text-sm truncate max-w-[160px] md:max-w-none'>
            Olá, {userName}
          </span>
          <button
            onClick={onLogout}
            className='bg-TINTS_CARROT_100 hover:bg-TINTS_CARROT_100/90 text-DARK_100 font-semibold px-4 py-2 rounded transition text-sm md:text-base'
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
          {!isDetails && rightSlot}
          {isDetails && showEdit && editHref && (
            <Link
              href={editHref}
              className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/90 transition flex items-center justify-center gap-2'
            >
              <Pencil size={16} /> Editar
            </Link>
          )}
          {backHref && (
            <Link
              href={backHref}
              className='bg-transparent border border-TINTS_CARROT_100 text-TINTS_CARROT_100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-TINTS_CARROT_100/10 transition flex items-center justify-center gap-2'
            >
              <ArrowLeft size={16} /> Voltar
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
