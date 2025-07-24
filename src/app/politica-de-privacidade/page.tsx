// /app/politica-de-privacidade/page.tsx
export default function PoliticaDePrivacidadePage() {
  return (
    <main className='max-w-3xl mx-auto px-4 py-10 text-sm leading-relaxed text-foreground bg-app-background'>
      <h1 className='text-2xl font-bold mb-4'>Política de Privacidade</h1>

      <p>
        Esta Política de Privacidade descreve como a RECH MECÂNICA DIESEL LTDA
        coleta, usa e protege as informações pessoais dos usuários do sistema. O
        uso deste sistema implica a aceitação desta política.
      </p>

      <h2 className='text-lg font-semibold mt-6 mb-2'>
        1. Coleta de Informações
      </h2>
      <p>
        Coletamos apenas as informações necessárias para a operação do sistema
        de mensagens e atendimento, como nome, telefone e histórico de mensagens
        trocadas via WhatsApp.
      </p>

      <h2 className='text-lg font-semibold mt-6 mb-2'>
        2. Uso das Informações
      </h2>
      <p>
        As informações são utilizadas exclusivamente para comunicação entre a
        oficina e seus clientes, com o objetivo de informar sobre serviços,
        ordens e agendamentos.
      </p>

      <h2 className='text-lg font-semibold mt-6 mb-2'>
        3. Compartilhamento de Dados
      </h2>
      <p>
        Não compartilhamos dados com terceiros, exceto quando exigido por lei ou
        por ordem judicial.
      </p>

      <h2 className='text-lg font-semibold mt-6 mb-2'>4. Segurança</h2>
      <p>
        Adotamos medidas técnicas e organizacionais para proteger os dados dos
        usuários contra acesso não autorizado.
      </p>

      <h2 className='text-lg font-semibold mt-6 mb-2'>5. Contato</h2>
      <p>
        Em caso de dúvidas sobre esta política, entre em contato pelo e-mail:
        <br />
        <a
          href='mailto:ativos.assessoria@outlook.com'
          className='text-blue-500 underline'
        >
          ativos.assessoria@outlook.com
        </a>
      </p>

      <p className='mt-6 text-muted-foreground'>
        Última atualização: julho de 2025
      </p>
    </main>
  );
}
