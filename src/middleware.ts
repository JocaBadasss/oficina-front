// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  // 1) Se for raiz (/), redireciona pra login ou dashboard
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = token ? '/painel' : '/login';
    return NextResponse.redirect(url);
  }

  // 2) Protege rotas “privadas”
  //    Liste aqui todos os prefixes que você quer bloquear (ex: /dashboard, /clients, /orders etc.)
  // middleware.ts
  const protectedRoutes = [
    '/painel',
    '/clientes',
    '/ordens',
    'veiculos',
    '/agendamentos',
    '/novo-atendimento',
  ];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 3) Deixa passar pros demais casos (API, _next, public, etc)
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // intercepta TUDO
};
