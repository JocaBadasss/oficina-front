import type { Metadata } from 'next';
import { Roboto, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SocketBadgeProvider } from '@/contexts/SocketBadgeContext';
import { SocketListener } from '@/components/SocketListener';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Rech Caminhões',
  description: 'Sistema de gestão para oficinas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='pt-br'
      suppressHydrationWarning
    >
      <body className={`${poppins.variable} ${roboto.variable}`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
        >
          <AuthProvider>
            <SocketBadgeProvider>
              <SocketListener />
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </SocketBadgeProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
