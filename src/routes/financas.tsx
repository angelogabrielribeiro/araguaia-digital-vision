import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/ServicePage";
import { serviceByKey } from "@/config/site";

const service = serviceByKey.financas;

export const Route = createFileRoute("/financas")({
  head: () => ({
    meta: [
      { title: "Serviços financeiros e organização de finanças | Conceição do Araguaia (PA)" },
      {
        name: "description",
        content:
          "Organização de lançamentos, controle de entradas e saídas, conciliação e apoio na rotina financeira. Atendimento presencial e remoto.",
      },
      { property: "og:title", content: "Finanças organizadas, decisão mais tranquila" },
      {
        property: "og:description",
        content:
          "Apoio para colocar a rotina financeira em ordem: lançamentos, conciliação, controles e relatórios simples do período.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/financas" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/financas" }],
  }),
  component: FinancasPage,
});

function FinancasPage() {
  return (
    <ServicePage
      service={service}
      mode="flow"
      narrativeLabel="Fluxo"
      steps={[
        {
          title: "No começo, a informação está espalhada",
          body: "Comprovantes em lugares diferentes, planilha desatualizada, valores lançados de memória. Não é falta de capricho: é rotina apertada. O primeiro passo é reunir o que existe hoje, do jeito que está.",
        },
        {
          title: "Depois, cada movimento encontra seu lugar",
          body: "Entradas e saídas passam a ser classificadas de forma consistente, conferidas contra o que de fato aconteceu. É aqui que o número deixa de ser estimativa e passa a ser informação.",
        },
        {
          title: "No fim, dá para ler o resultado sem esforço",
          body: "Com os lançamentos organizados, o período fecha em um relatório simples: quanto entrou, quanto saiu, para onde foi e o que exige atenção. Sem promessa de fórmula mágica — só clareza para decidir.",
        },
      ]}
      process={[
        {
          title: "Diagnóstico da rotina",
          body: "Entendo como o dinheiro entra e sai hoje e quais controles já existem.",
        },
        {
          title: "Organização",
          body: "Estruturo os lançamentos e controles em um formato que você consiga manter no dia a dia.",
        },
        {
          title: "Acompanhamento",
          body: "Podemos combinar acompanhamento periódico para manter tudo conciliado e atualizado.",
        },
      ]}
      faq={[
        {
          q: "Serve para autônomo e pequena empresa?",
          a: "Sim. O trabalho é dimensionado ao tamanho da operação: pode ser uma organização inicial pontual ou um acompanhamento recorrente.",
        },
        {
          q: "Preciso usar algum sistema específico?",
          a: "Não necessariamente. Trabalho com o que você já usa quando faz sentido, e sugiro ajustes quando a ferramenta atual atrapalha mais do que ajuda.",
        },
        {
          q: "Dá para fazer remotamente?",
          a: "Grande parte sim, com envio de documentos e reuniões por chamada. Quando for melhor presencialmente, atendo em Conceição do Araguaia (PA) e Couto Magalhães (TO).",
        },
      ]}
    />
  );
}
