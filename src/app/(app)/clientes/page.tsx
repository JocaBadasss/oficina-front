'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
// import { api } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Aside } from '@/components/ui/Aside';
import { Users } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockClients: Client[] = [
      { id: '1', name: 'João da Silva', phone: '(61) 99999-9999' },
      { id: '2', name: 'Maria Oliveira', phone: '(61) 98888-8888' },
      { id: '3', name: 'Carlos Souza', phone: '(61) 97777-7777' },
    ];
    setClients(mockClients);
    setLoading(false);

    /* async function fetchClients() {
      try {
        const res = await api.get<Client[]>('/clients');
        setClients(res.data);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchClients(); */
  }, []);

  return (
    <div className='flex min-h-screen bg-DARK_400 text-LIGHT_100 font-poppins'>
      <Aside />

      <main className='flex-1 p-6 space-y-6'>
        <header className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold font-roboto'>Clientes</h1>
            <p className='text-LIGHT_500 mt-1'>
              Gerencie todos os seus clientes.
            </p>
          </div>
          <a
            href='/clientes/novo'
            className='bg-TINTS_CARROT_100 text-LIGHT_200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-TINTS_CARROT_100/90 transition self-start md:self-auto'
          >
            <Plus size={16} /> Adicionar Cliente
          </a>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='bg-DARK_700 rounded-lg p-6 col-span-1 flex items-center gap-4'>
            <div className='bg-TINTS_CARROT_100 text-DARK_100 p-4 rounded-full'>
              <Users size={32} />
            </div>
            <div>
              <h2 className='text-lg text-LIGHT_500'>Total de Clientes</h2>
              {loading ? (
                <Skeleton className='h-6 w-16 mt-1' />
              ) : (
                <p className='text-3xl font-bold text-LIGHT_100 text-center'>
                  {clients.length}
                </p>
              )}
            </div>
          </div>

          <div className='bg-DARK_700 rounded-lg p-6 col-span-2'>
            <h2 className='text-xl font-semibold mb-4'>Lista de Clientes</h2>
            {loading ? (
              <div className='space-y-2'>
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-6 w-full' />
              </div>
            ) : clients.length === 0 ? (
              <p className='text-LIGHT_500'>Nenhum cliente encontrado.</p>
            ) : (
              <ul className='divide-y divide-LIGHT_700'>
                {clients.map((client) => (
                  <li
                    key={client.id}
                    className='py-3 flex justify-between items-center hover:bg-DARK_800 px-2 rounded transition'
                  >
                    <div>
                      <p className='font-medium text-LIGHT_100'>
                        {client.name}
                      </p>
                      <p className='text-sm text-LIGHT_500'>{client.phone}</p>
                    </div>
                    <a
                      href={`/clientes/${client.id}`}
                      className='text-sm text-TINTS_CARROT_100 hover:underline'
                    >
                      Ver detalhes
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
