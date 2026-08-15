import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Laptop, MapPin, Monitor, Wrench } from "lucide-react";

import { MeteorStreaks } from "@/components/MeteorStreaks";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ServiceConstellation } from "@/components/ServiceConstellation";
import { WhatsappCta } from "@/components/WhatsappCta";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { displayName, genericWhatsappMessage, site } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TI, manutenção, finanças e contabilidade em Conceição do Araguaia (PA) | WVS Informática" },
      {
        name: "description",
        content:
          "WVS Informática: TI e suporte técnico em Conceição do Araguaia (PA), atendendo também Couto Magalhães (TO) e remotamente. Manutenção tecnológica, finanças e contabilidade.",
      },
      { property: "og:title", content: "WVS Informática — TI, manutenção, finanças e contabilidade" },
      {
        property: "og:description",
        content:
          "Suporte técnico presencial e remoto, manutenção de equipamentos, organização financeira e orientação fiscal. Contato direto pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: site.url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: site.url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: displayName,
          url: site.url,
          image: site.media.portrait,
          telephone: site.phoneDisplay,
          description: "Serviços de TI e suporte técnico, manutenção tecnológica, finanças e contabilidade.",
          areaServed: [
            { "@type": "City", name: "Conceição do Araguaia" },
            { "@type": "City", name: "Couto Magalhães" },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Conceição do Araguaia",
            addressRegion: "PA",
            addressCountry: "BR",
          },
        }),
      },
    ],
  }),
  component: Home,
});

const PILLARS = [
  {
    icon: Monitor,
    title: "Presencial onde você está",
    body: `Atendimento em ${site.location.city} (${site.location.state}) e ${site.location.alsoServes}, no local ou em bancada.`,
    colors: ["#69cfff", "#67e0b5"] as [string, string],
  },
  {
    icon: Laptop,
    title: "Remoto quando dá para resolver assim",
    body: "Acesso remoto por AnyDesk ou ferramenta equivalente, com você acompanhando a tela.",
    colors: ["#66d7d1", "#8ba8ff"] as [string, string],
  },
  {
    icon: Wrench,
    title: "Técnico e administrativo no mesmo contato",
    body: "Tecnologia, finanças e obrigações fiscais tratadas por uma pessoa só, sem ficar repetindo o contexto.",
    colors: ["#f0c778", "#bd8cff"] as [string, string],
  },
];

function Home() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={214} intensity={1} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/80 via-background/25 to-background" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-28 pb-20 lg:px-8">
          <Reveal y={12}>
            <p className="eyebrow flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-tech" aria-hidden />
              Tecnologia, finanças e clareza para quem precisa resolver
            </p>
          </Reveal>

          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.95] text-foreground">
            <RevealLines lines={["Problemas complexos.", "Atendimento direto."]} />
          </h1>

          <Reveal delay={0.35} className="mt-7 max-w-xl">
            <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
              Atendimento profissional em TI, suporte técnico, manutenção de equipamentos,
              finanças, contabilidade e impostos. Presencial em {site.location.city} ({site.location.state}) e {site.location.alsoServes}, com suporte remoto quando o serviço permite.
            </p>
          </Reveal>

          <Reveal delay={0.5} className="mt-9">
            <div className="flex flex-wrap items-center gap-3">
              <WhatsappCta message={genericWhatsappMessage} serviceKey="geral" ctaLocation="hero_home">
                Solicitar atendimento
              </WhatsappCta>
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground transition-colors hover:border-tech hover:text-foreground"
              >
                Conhecer serviços <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.7} className="mt-16">
            <div className="grid gap-4 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <BorderBeamPanel
                  key={p.title}
                  beams={2}
                  seed={11 + i}
                  radius={14}
                  glow
                  thickness={1.4}
                  colors={p.colors}
                  innerClassName="group rounded-[13px] bg-background/70 p-6 backdrop-blur transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <p.icon className="h-4 w-4 text-tech transition-transform duration-300 group-hover:scale-110" aria-hidden />
                  <h2 className="mt-4 text-sm font-medium text-foreground">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </BorderBeamPanel>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-black">
        <div className="mx-auto max-w-7xl px-5 pt-16 lg:px-8">
          <Reveal>
            <p className="eyebrow">Áreas de atuação</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight text-foreground lg:text-4xl">
              Entre no espaço e escolha a área que você precisa.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Os cards estão em planos diferentes. Arraste para olhar ao redor e toque diretamente no serviço.
            </p>
          </Reveal>
        </div>
        <div className="mt-5">
          <ServiceConstellation />
        </div>
      </section>

      <section className="relative border-t border-border py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(53,151,193,.12),transparent_44%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <Reveal>
            <p className="eyebrow">Quem atende</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Tem uma pessoa real do outro lado da tela.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground lg:text-base">
              O atendimento é direto, com atuação profissional em tecnologia e serviços administrativos. As imagens e o vídeo abaixo são do próprio profissional, sem banco de imagem genérico.
            </p>
            <Link to="/sobre" className="mt-7 inline-flex items-center gap-2 text-sm text-tech hover:underline">
              Conhecer o profissional <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-[1.25fr_.75fr]">
            <div className="professional-media-shell min-h-[430px]">
              <video
                src={site.media.workingVideo}
                poster={site.media.workingVideoPoster}
                autoPlay={!reduced}
                muted
                loop
                playsInline
                preload="auto"
              />
              <span className="professional-media-kicker">rotina profissional · conceição do araguaia</span>
            </div>
            <div className="professional-media-shell min-h-[430px]">
              <img src={site.media.portrait} alt={`Retrato de ${displayName}`} loading="eager" decoding="async" />
              <span className="professional-media-kicker">atendimento direto</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface/30 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <p className="eyebrow">Como eu trabalho</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Sem enrolação, sem serviço empurrado.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground lg:text-base">
              <p>
                Trabalho registrado na área de tecnologia e também atendo de forma independente.
                Isso significa rotina técnica todos os dias e atendimento direto com quem me procura.
              </p>
              <p>
                Antes de qualquer serviço eu explico o que identifiquei, o que precisa ser feito e como fica o valor.
              </p>
              <p>
                O contato é pelo WhatsApp e a conversa é em português comum. Você não precisa saber o nome técnico do problema para pedir ajuda.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={196} intensity={0.65} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div className="pointer-events-none absolute inset-0 bg-background/65" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">
          <Reveal>
            <h2 className="font-display text-4xl leading-tight text-foreground lg:text-6xl">
              Me conte o que está acontecendo.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground lg:text-base">
              Você descreve a situação, eu avalio e digo se resolvo remotamente ou se vale um atendimento presencial.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsappCta message={genericWhatsappMessage} serviceKey="geral" ctaLocation="cta_final_home" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
