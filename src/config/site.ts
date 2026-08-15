/**
 * ============================================================
 * ARQUIVO CENTRAL DE CONFIGURAÇÃO
 * Edite APENAS este arquivo para trocar nome, WhatsApp, IDs de
 * analytics, localização, fotos e vídeos.
 * ============================================================
 */

export const site = {
  url: "https://wvsinformaticacda.com.br",
  professionalName: "Wangelo Silva dos Santos",
  professionalRole: "Tecnologia da Informação • Suporte • Finanças e Contabilidade",
  shortName: "WVS Informática",
  email: "",
  whatsappNumber: "559491049244",
  phoneDisplay: "+55 94 91049244",
  location: {
    city: "Conceição do Araguaia",
    state: "PA",
    alsoServes: "Couto Magalhães (TO)",
    remote: "Atendimento remoto para todo o Brasil",
    hours: "",
  },
  analytics: {
    ga4MeasurementId: "G-7K8QX22N5T",
    metaPixelId: "",
    googleSearchConsoleVerification: "8m1d3cQ3PyS0caJYNQJEFXMecOewgUOhHEGsgphokNo",
  },
  media: {
    logo: "https://d2ol7oe51mr4n9.cloudfront.net/user_3HsNrvtADgTST69NIzAyibRE4Ek/c60daf31-6091-4a04-ac53-767925f84eec.png",
    portrait: "https://d2ol7oe51mr4n9.cloudfront.net/user_3HsNrvtADgTST69NIzAyibRE4Ek/3ae4c872-26a9-490b-a498-43ed03d3e710.png",
    workingVideo: "https://d2ol7oe51mr4n9.cloudfront.net/user_3HsNrvtADgTST69NIzAyibRE4Ek/829c7c81-7e79-4269-b840-ae2b9baece58.mp4",
    workingVideoPoster: "https://d2ol7oe51mr4n9.cloudfront.net/user_3HsNrvtADgTST69NIzAyibRE4Ek/d1c06792-d991-41c0-9377-9c94f372cc32.png",
    gallery: [
      { src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3HsNrvtADgTST69NIzAyibRE4Ek/d1c06792-d991-41c0-9377-9c94f372cc32.png", alt: "Profissional em atendimento no escritório" },
      { src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3HsNrvtADgTST69NIzAyibRE4Ek/3ae4c872-26a9-490b-a498-43ed03d3e710.png", alt: "Retrato profissional" },
    ] as { src: string; alt: string }[],
  },
  social: {
    instagram: "",
    linkedin: "",
  },
} as const;

export const brandName = "WVS Informática";
export const brandTagline = "TI • Suporte • Finanças • Contabilidade";
export const displayName = site.shortName || brandName;
export const displayShortName = site.shortName || brandName;

export type ServiceKey = "ti" | "manutencao" | "software" | "financas" | "contabilidade";

export type ServiceDef = {
  key: ServiceKey;
  path: "/ti" | "/manutencao" | "/financas" | "/contabilidade";
  hash?: string;
  label: string;
  title: string;
  tagline: string;
  summary: string;
  hue: number;
  accent: string;
  items: string[];
  whatsappMessage: string;
};

export const services: ServiceDef[] = [
  {
    key: "ti",
    path: "/ti",
    label: "TI e Suporte",
    title: "TI e suporte técnico",
    tagline: "Diagnóstico, configuração e solução — presencial ou remoto.",
    summary:
      "Atendimento a computadores, redes e ambientes de trabalho: identificar o que está causando o problema, corrigir e deixar o equipamento configurado do jeito que a rotina exige. Quando o caso permite, resolvo remotamente via AnyDesk ou ferramenta equivalente, sem deslocamento.",
    hue: 208,
    accent: "#63b7ff",
    items: [
      "Diagnóstico de lentidão, travamentos e falhas recorrentes",
      "Configuração de computadores, periféricos, impressoras e rede",
      "Instalação e organização de sistema operacional e programas de trabalho",
      "Suporte remoto por AnyDesk e ferramentas similares",
      "Backup, organização de arquivos e recuperação de acesso",
      "Acompanhamento contínuo para empresas e escritórios",
    ],
    whatsappMessage:
      "Olá! Vim pelo site, na página de TI e suporte técnico. Preciso de ajuda com um problema no computador/rede. Pode me atender?",
  },
  {
    key: "software",
    path: "/ti",
    hash: "software",
    label: "Software e Sistemas",
    title: "Software e sistemas",
    tagline: "Sistemas que funcionam e pessoas que sabem usá-los.",
    summary:
      "Suporte a softwares e sistemas usados no dia a dia da empresa: instalação, configuração, correção de erros e orientação de uso para a equipe. O objetivo não é só fazer o programa abrir — é fazer o processo rodar sem depender de improviso.",
    hue: 188,
    accent: "#63d8d0",
    items: [
      "Instalação e configuração de sistemas de gestão e programas de trabalho",
      "Correção de erros, travamentos e falhas de integração",
      "Orientação de uso para equipes, no ritmo de quem vai usar",
      "Ajustes de permissões, usuários e acessos",
      "Suporte empresarial recorrente",
    ],
    whatsappMessage:
      "Olá! Vim pelo site, na parte de software e sistemas. Estou com um problema/dúvida em um sistema da empresa e gostaria de suporte.",
  },
  {
    key: "manutencao",
    path: "/manutencao",
    label: "Manutenção",
    title: "Manutenção tecnológica",
    tagline: "Equipamentos de tecnologia mantidos em condição de trabalho.",
    summary:
      "Manutenção preventiva e corretiva de equipamentos e produtos de tecnologia usados por empresas. É trabalho de bancada e de campo: inspeção, limpeza técnica, substituição de componentes, testes e devolução do equipamento em condição confiável de operação.",
    hue: 142,
    accent: "#65d49f",
    items: [
      "Manutenção preventiva programada para reduzir parada inesperada",
      "Manutenção corretiva com diagnóstico de componente a componente",
      "Limpeza técnica, troca de peças e reparo de falhas físicas",
      "Avaliação de equipamentos antes de compra, troca ou descarte",
      "Testes de estabilidade e relatório do que foi feito",
      "Atendimento a parques de equipamentos de empresas e escritórios",
    ],
    whatsappMessage:
      "Olá! Vim pelo site, na página de manutenção tecnológica. Preciso de manutenção em equipamentos. Podemos conversar?",
  },
  {
    key: "financas",
    path: "/financas",
    label: "Finanças",
    title: "Finanças",
    tagline: "Números organizados, decisões mais tranquilas.",
    summary:
      "Serviços na área financeira para quem precisa enxergar o próprio negócio com clareza: organização de lançamentos, controle de entradas e saídas, conciliação e apoio na rotina financeira. Trabalho com o que existe hoje na empresa e deixo a informação em um formato utilizável.",
    hue: 42,
    accent: "#f0c778",
    items: [
      "Organização de lançamentos e controle de entradas e saídas",
      "Conciliação e conferência de movimentações",
      "Estruturação de planilhas e controles financeiros do dia a dia",
      "Apoio na rotina de contas a pagar e a receber",
      "Relatórios simples para acompanhar o resultado do período",
    ],
    whatsappMessage:
      "Olá! Vim pelo site, na página de finanças. Preciso de apoio para organizar a parte financeira. Pode me explicar como funciona?",
  },
  {
    key: "contabilidade",
    path: "/contabilidade",
    label: "Contabilidade",
    title: "Contabilidade e impostos",
    tagline: "Obrigação em dia, sem sustos e sem linguagem enrolada.",
    summary:
      "Apoio contábil, tributário e administrativo: entender a situação atual, organizar documentos, acompanhar obrigações e orientar sobre impostos de forma direta. A ideia é que você saiba o que precisa ser feito, quando e por quê.",
    hue: 285,
    accent: "#bd8cff",
    items: [
      "Orientação fiscal e tributária em linguagem clara",
      "Organização de documentos e rotinas contábeis",
      "Acompanhamento de obrigações e prazos",
      "Apoio em necessidades administrativas relacionadas",
      "Atendimento a pessoa física e empresa",
    ],
    whatsappMessage:
      "Olá! Vim pelo site, na página de contabilidade e impostos. Tenho uma dúvida/necessidade fiscal e gostaria de orientação.",
  },
];

export const serviceByKey = Object.fromEntries(services.map((s) => [s.key, s])) as Record<
  ServiceKey,
  ServiceDef
>;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const genericWhatsappMessage =
  "Olá! Vim pelo site e gostaria de falar sobre um atendimento.";
