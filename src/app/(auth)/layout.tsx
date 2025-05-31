// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='flex flex-col min-h-screen bg-background text-foreground overflow-hidden'>
      {children}
    </main>
  );
}
