import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/ServicePage";
import { serviceByKey, site } from "@/config/site";

const service = serviceByKey.contabilidade;

export const Route = createFileRoute("/contabilidade")({
  head: () => ({
    meta: [
      { title: "Contabilidade, impostos e orientação fiscal | WVS Informática" },
      {
        name: "description",
        content:
          "Apoio contábil e tributário: organização de documentos, acompanhamento de obrigações e orientação sobre impostos em linguagem clara.",
      },
      { property: "og:title", content: "Contabilidade e impostos — WVS Informática" },
      {
        property: "og:description",
        content:
          "Documentos organizados, prazos acompanhados e orientação fiscal direta para pessoa física e empresa.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${site.url}/contabilidade` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${site.url}/contabilidade` }],
  }),
  component: ContabilidadePage,
});

function ContabilidadePage() {
  return (
    <ServicePage
      service={service}
      mode="ledger"
      narrativeLabel="Ordem"
      steps={[
        {
          title: "A papelada raramente chega organizada",
          body: "Documento em pasta física, arquivo no celular, guia esquecida, dúvida sobre o que já foi entregue. O ponto de partida é levantar a situação real, sem julgamento e sem discurso pronto.",
        },
        {
          title: "Cada obrigação ganha nome, prazo e responsável",
          body: "Organizo os documentos e mapeio o que precisa ser entregue, quando e por quem. Ter isso escrito em um lugar só já resolve boa parte do risco de perder prazo.",
        },
        {
          title: "Você entende o imposto que está pagando",
          body: "Explico o que incide sobre a sua atividade em português comum, o que é obrigação e o que é escolha. Orientação honesta: quando algo foge da minha atuação, eu digo e indico o caminho correto.",
        },
      ]}
      process={[
        {
          title: "Conversa inicial",
          body: "Entendo a sua situação: pessoa física ou empresa, atividade, regime e o que está pendente.",
        },
        {
          title: "Organização e plano",
          body: "Documentos organizados, obrigações mapeadas e um calendário do que vem pela frente.",
        },
        {
          title: "Acompanhamento",
          body: "Rotina acompanhada para não deixar prazo passar, com orientação sempre que surgir dúvida.",
        },
      ]}
      faq={[
        {
          q: "Atende pessoa física?",
          a: "Sim, além de empresas. Muitas dúvidas de pessoa física envolvem imposto de renda, documentos e regularização, e é possível orientar sobre esses pontos.",
        },
        {
          q: "Você entrega as obrigações no meu lugar?",
          a: "O escopo é combinado caso a caso. Em alguns casos faço a organização e a orientação; em outros, acompanho a entrega. Isso fica claro antes de começar.",
        },
        {
          q: "Precisa ser presencial?",
          a: "Não. A maior parte funciona remotamente, com envio digital de documentos. Presencial em Conceição do Araguaia (PA) e Couto Magalhães (TO) quando for melhor para você.",
        },
      ]}
    />
  );
}
