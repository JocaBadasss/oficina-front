import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redireciona a raiz para painel ou login, sem depender de cookie
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/painel',
    '/clientes',
    '/ordens',
    '/veiculos',
    '/agendamentos',
    '/novo-atendimento',
  ],
};
