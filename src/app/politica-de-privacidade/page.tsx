// /app/politica-de-privacidade/page.tsx
import Image from 'next/image';

export default function PoliticaDePrivacidadePage() {
  return (
    <div className='min-h-screen flex flex-col bg-app-background text-foreground'>
      {/* Header */}
      <header className='w-full py-6 px-4 bg-gradient-to-b from-background/70 to-transparent border-b border-border flex justify-center'>
        <Image
          src='/logo.svg'
          alt='Logo RECH'
          width={180}
          height={50}
          priority
        />
      </header>

      {/* Conteúdo */}
      <main className='flex-1 w-full px-4 py-12 flex justify-center'>
        <article className='w-full max-w-3xl bg-background/60 backdrop-blur-sm rounded-xl border border-border p-8 shadow-sm text-sm leading-relaxed text-justify'>
          <h1 className='text-3xl font-bold mb-4 border-b border-border pb-2'>
            Política de Privacidade
          </h1>

          <p className='mb-4'>
            Esta Política de Privacidade descreve como a RECH MECÂNICA DIESEL
            LTDA coleta, usa e protege as informações pessoais dos usuários do
            sistema. O uso deste sistema implica a aceitação desta política.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            1. Coleta de Informações
          </h2>
          <p>
            Coletamos apenas as informações necessárias para a operação do
            sistema de mensagens e atendimento, como nome, telefone e histórico
            de mensagens trocadas via WhatsApp.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            2. Uso das Informações
          </h2>
          <p>
            As informações são utilizadas exclusivamente para comunicação entre
            a oficina e seus clientes, com o objetivo de informar sobre
            serviços, ordens e agendamentos.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            3. Compartilhamento de Dados
          </h2>
          <p>
            Não compartilhamos dados com terceiros, exceto quando exigido por
            lei ou por ordem judicial.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>4. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger os dados
            dos usuários contra acesso não autorizado.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>5. Contato</h2>
          <p>
            Em caso de dúvidas sobre esta política, entre em contato pelo
            e-mail:
            <br />
            <a
              href='mailto:ativos.assessoria@outlook.com'
              className='text-brand underline hover:text-brand/80 transition-colors'
            >
              ativos.assessoria@outlook.com
            </a>
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            6. Base Legal e Consentimento
          </h2>
          <p>
            Tratamos os dados pessoais de acordo com a Lei Geral de Proteção de
            Dados (Lei nº 13.709/2018 - LGPD), com base no consentimento do
            usuário, no cumprimento de obrigações legais e na execução de
            contrato quando aplicável.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            7. Direitos do Titular dos Dados
          </h2>
          <p>
            O titular dos dados tem o direito de solicitar a qualquer momento:
            acesso às informações, correção de dados, anonimização,
            portabilidade ou exclusão de seus dados pessoais, conforme previsto
            na LGPD. Para exercer seus direitos, entre em contato pelo e-mail
            informado nesta política.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            8. Retenção das Informações
          </h2>
          <p>
            As informações pessoais são armazenadas apenas pelo tempo necessário
            para cumprir as finalidades descritas nesta política, ou conforme
            exigido por obrigações legais e regulatórias.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>9. Uso de Cookies</h2>
          <p>
            Este sistema pode utilizar cookies para melhorar a experiência do
            usuário, lembrar preferências e fornecer funcionalidades adicionais.
            O usuário pode desativar os cookies nas configurações do navegador,
            se preferir.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            10. Alterações nesta Política
          </h2>
          <p>
            Esta política pode ser atualizada periodicamente. Recomendamos a
            revisão frequente para estar ciente de qualquer mudança. Mudanças
            significativas serão comunicadas diretamente, quando necessário.
          </p>

          <h2 className='text-lg font-semibold mt-6 mb-2'>
            11. Encarregado de Proteção de Dados
          </h2>
          <p>
            O encarregado (DPO) pelo tratamento de dados nesta empresa é Raidan Rech, que pode ser contatado pelo e-mail:
            <br />
            <a
              href='mailto:ativos.assessoria@outlook.com'
              className='text-brand underline hover:text-brand/80 transition-colors'
            >
              ativos.assessoria@outlook.com
            </a>
          </p>

          <p className='mt-6 text-muted-foreground text-xs'>
            Última atualização: julho de 2025
          </p>
        </article>
      </main>

      {/* Footer */}
      <footer className='w-full text-center text-xs py-6 px-4 text-muted-foreground'>
        <hr className='mb-4 border-border' />© {new Date().getFullYear()} RECH
        MECÂNICA DIESEL LTDA. Todos os direitos reservados.
      </footer>
    </div>
  );
}
