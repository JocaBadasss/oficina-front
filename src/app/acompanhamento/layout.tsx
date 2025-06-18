// app/acompanhamento/layout.tsx
export default function AcompanhamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='min-h-screen bg-background text-foreground'>
      {children}
    </main>
  );
}
