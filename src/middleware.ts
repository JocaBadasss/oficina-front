// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');

  const isPublicPath = ['/login', '/acompanhamento', '/politica-de-privacidade'].some((path) =>
    pathname.startsWith(path)
  );

  // ✅ Permite rotas públicas entrarem sem token
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 🚪 Se estiver na raiz '/', decide pra onde ir
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = accessToken ? '/painel' : '/login';
    return NextResponse.redirect(url);
  }

  // 🔐 Para rotas protegidas: exige token
  const isProtectedPath = [
    '/painel',
    '/clientes',
    '/ordens',
    '/veiculos',
    '/agendamentos',
    '/novo-atendimento',
  ].some((path) => pathname.startsWith(path));

  if (isProtectedPath && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ✅ Caso contrário, segue o fluxo normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/acompanhamento',
    '/painel',
    '/clientes/:path*',
    '/ordens/:path*',
    '/veiculos/:path*',
    '/agendamentos/:path*',
    '/novo-atendimento',
  ],
};
