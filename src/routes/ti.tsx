import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/ServicePage";
import { serviceByKey } from "@/config/site";

const service = serviceByKey.ti;
const software = serviceByKey.software;

export const Route = createFileRoute("/ti")({
  head: () => ({
    meta: [
      { title: "TI e suporte técnico em Conceição do Araguaia (PA) | Suporte remoto" },
      {
        name: "description",
        content:
          "Suporte técnico, configuração de computadores, redes e sistemas em Conceição do Araguaia (PA) e Couto Magalhães (TO). Atendimento remoto via AnyDesk.",
      },
      { property: "og:title", content: "TI e suporte técnico — presencial e remoto" },
      {
        property: "og:description",
        content:
          "Diagnóstico, configuração e solução de problemas em computadores, redes e sistemas. Suporte remoto quando o caso permite.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/ti" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ti" }],
  }),
  component: TiPage,
});

function TiPage() {
  return (
    <ServicePage
      service={service}
      mode="nodes"
      narrativeLabel="Infraestrutura"
      steps={[
        {
          title: "Primeiro, entender o que realmente está falhando",
          body: "Lentidão, travamento e erro repetido quase nunca têm uma causa só. Antes de mexer, eu observo o comportamento do equipamento, checo o que mudou recentemente e separo sintoma de causa. Isso evita retrabalho e conserto às cegas.",
        },
        {
          title: "Depois, colocar cada peça no lugar certo",
          body: "Sistema, programas, rede, impressoras, usuários e permissões passam a conversar entre si de forma organizada. A configuração é feita pensando em como você usa o computador todo dia, não em um padrão genérico.",
        },
        {
          title: "E manter funcionando, com suporte remoto quando dá",
          body: "Boa parte dos chamados se resolve por acesso remoto com AnyDesk ou ferramenta equivalente: você libera o acesso, eu resolvo e explico o que foi feito. Quando exige presença física, faço o atendimento no local.",
        },
      ]}
      process={[
        {
          title: "Você descreve o problema",
          body: "Pelo WhatsApp, com suas palavras mesmo. Se puder, mande foto da tela ou da mensagem de erro.",
        },
        {
          title: "Avaliação e combinação",
          body: "Digo se dá para resolver remotamente, o que precisa ser feito e como fica o valor antes de iniciar.",
        },
        {
          title: "Execução e explicação",
          body: "Resolvo, testo junto com você e explico o que foi feito, sem jargão desnecessário.",
        },
      ]}
      faq={[
        {
          q: "Como funciona o suporte remoto?",
          a: "Combinamos um horário, você instala e abre uma ferramenta de acesso remoto como o AnyDesk e me passa o código de acesso. Eu opero a máquina enquanto você acompanha a tela, e o acesso termina quando o atendimento termina.",
        },
        {
          q: "Atende fora de Conceição do Araguaia?",
          a: "Sim. Atendo presencialmente em Conceição do Araguaia (PA) e Couto Magalhães (TO), e remotamente para outras cidades quando o serviço permite.",
        },
        {
          q: "Atende empresa e pessoa física?",
          a: "Ambos. Para empresas também é possível combinar atendimento recorrente, com prioridade nos chamados.",
        },
      ]}
    >
      <section
        id="software"
        className="scroll-mt-24 border-t border-border bg-surface/30 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">Também dentro de TI</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-foreground lg:text-5xl">
            {software.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            {software.summary}
          </p>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {software.items.map((item) => (
              <li key={item} className="panel p-5 text-sm text-foreground/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ServicePage>
  );
}
