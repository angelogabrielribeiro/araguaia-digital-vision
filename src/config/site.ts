/**
 * ============================================================
 * ARQUIVO CENTRAL DE CONFIGURAÇÃO
 * Edite APENAS este arquivo para trocar nome, WhatsApp, IDs de
 * analytics, localização, fotos e vídeos.
 *
 * Campos vazios ("") NÃO aparecem no site: os componentes escondem
 * automaticamente o que ainda não foi preenchido. Nenhum texto
 * técnico ou marcador é exibido para o visitante.
 * ============================================================
 */

export const site = {
  /** Nome real do profissional. Vazio => usa `brandName` neutro. */
  professionalName: "",
  /** Título curto abaixo do nome (cargo / atuação) */
  professionalRole: "Tecnologia da Informação • Suporte • Finanças e Contabilidade",
  /** Nome curto usado no logotipo/navegação. Vazio => `brandName`. */
  shortName: "",
  /** E-mail de contato. Vazio => bloco de e-mail não é renderizado. */
  email: "",

  /**
   * WhatsApp em formato internacional, apenas dígitos.
   * Ex.: 5594999999999 (55 = Brasil, 94 = DDD)
   */
  whatsappNumber: "5594000000000",
  /** Telefone formatado. Vazio => bloco de telefone não é renderizado. */
  phoneDisplay: "",

  location: {
    city: "Conceição do Araguaia",
    state: "PA",
    alsoServes: "Couto Magalhães (TO)",
    remote: "Atendimento remoto para todo o Brasil",
    /** Horário de atendimento. Vazio => não é renderizado. */
    hours: "",
  },

  /** IDs de mensuração. Deixe vazio até ter o ID real — nada é carregado sem ele. */
  analytics: {
    ga4MeasurementId: "",
    metaPixelId: "",
    googleSearchConsoleVerification: "",
  },

  /** Mídias reais do profissional. Preencha quando os arquivos existirem. */
  media: {
    portrait: "",
    workingVideo: "",
    workingVideoPoster: "",
    gallery: [] as { src: string; alt: string }[],
  },

  social: {
    instagram: "",
    linkedin: "",
  },
} as const;

/** Assinatura neutra usada enquanto o nome real não estiver configurado. */
export const brandName = "Atendimento Profissional";
export const brandTagline = "TI • Finanças • Tributos";

/** Nome exibido em UI e structured data (nunca vazio). */
export const displayName = site.professionalName || brandName;
export const displayShortName = site.shortName || site.professionalName || brandName;


export type ServiceKey = "ti" | "manutencao" | "software" | "financas" | "contabilidade";

export type ServiceDef = {
  key: ServiceKey;
  /** Rota do site. `software` vive dentro de /ti. */
  path: "/ti" | "/manutencao" | "/financas" | "/contabilidade";
  /** Âncora opcional dentro da rota */
  hash?: string;
  label: string;
  title: string;
  tagline: string;
  summary: string;
  /** Tom visual: usado pelos shaders e pelo 3D */
  hue: number;
  accent: string;
  items: string[];
  /** Mensagem pré-preenchida do WhatsApp específica deste serviço */
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
    accent: "var(--tech)",
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
    hue: 190,
    accent: "var(--tech)",
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
    hue: 168,
    accent: "var(--signal)",
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
    hue: 145,
    accent: "var(--signal)",
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
    hue: 42,
    accent: "var(--clarity)",
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

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const genericWhatsappMessage =
  "Olá! Vim pelo site e gostaria de falar sobre um atendimento.";
