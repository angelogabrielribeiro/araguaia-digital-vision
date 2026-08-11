import { createFileRoute } from "@tanstack/react-router";

import { ServicePage } from "@/components/ServicePage";
import { serviceByKey } from "@/config/site";

const service = serviceByKey.manutencao;

export const Route = createFileRoute("/manutencao")({
  head: () => ({
    meta: [
      { title: "Manutenção de equipamentos de tecnologia para empresas | Conceição do Araguaia" },
      {
        name: "description",
        content:
          "Manutenção preventiva e corretiva de equipamentos de tecnologia para empresas em Conceição do Araguaia (PA) e Couto Magalhães (TO).",
      },
      { property: "og:title", content: "Manutenção tecnológica para empresas" },
      {
        property: "og:description",
        content:
          "Inspeção, limpeza técnica, troca de componentes e testes: equipamentos devolvidos em condição confiável de operação.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/manutencao" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/manutencao" }],
  }),
  component: ManutencaoPage,
});

function ManutencaoPage() {
  return (
    <ServicePage
      service={service}
      mode="exploded"
      narrativeLabel="Bancada"
      steps={[
        {
          title: "O equipamento é aberto e inspecionado por camadas",
          body: "Cada parte é avaliada separadamente: alimentação, armazenamento, memória, refrigeração, conectores e estrutura física. Isso mostra o que está no fim da vida útil antes de virar parada de trabalho.",
        },
        {
          title: "Manutenção é serviço técnico, não só limpeza",
          body: "Limpeza técnica faz parte, mas o trabalho inclui substituição de componentes, correção de falhas físicas, reaperto e reorganização interna, refrigeração e verificação de tudo o que interfere na estabilidade.",
        },
        {
          title: "Volta testado, montado e com relato do que foi feito",
          body: "Depois da montagem, o equipamento passa por testes de funcionamento e estabilidade. Você recebe o relato do que foi encontrado, do que foi trocado e do que merece atenção no próximo ciclo.",
        },
      ]}
      process={[
        {
          title: "Levantamento",
          body: "Quantos equipamentos, que tipo e qual o histórico de problemas. Para empresas, dá para mapear o parque inteiro.",
        },
        {
          title: "Plano de manutenção",
          body: "Definimos se é corretiva pontual ou preventiva programada, e a ordem de prioridade para não parar a operação.",
        },
        {
          title: "Execução e registro",
          body: "Serviço feito com registro do que foi verificado e substituído, para você acompanhar a vida útil dos equipamentos.",
        },
      ]}
      faq={[
        {
          q: "Faz manutenção só de computador?",
          a: "Não. Atendo equipamentos e produtos de tecnologia usados na operação da empresa — computadores, periféricos, impressoras, dispositivos de rede e equipamentos correlatos. Se houver dúvida sobre um item específico, é só perguntar antes.",
        },
        {
          q: "Vale a pena manutenção preventiva?",
          a: "Na maioria dos casos, sim: sai mais barato manter do que parar. A preventiva é programada em uma frequência combinada com você, considerando o uso real dos equipamentos.",
        },
        {
          q: "Como fica quando não vale mais consertar?",
          a: "Eu digo com clareza. Se o custo do reparo não se justifica, explico as opções e o que considerar em uma substituição, sem empurrar serviço desnecessário.",
        },
      ]}
    />
  );
}
