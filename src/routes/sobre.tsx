import { createFileRoute } from "@tanstack/react-router";

import { MeteorStreaks } from "@/components/MeteorStreaks";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ScrollExpandMedia } from "@/components/ScrollExpandMedia";
import { WhatsappCta } from "@/components/WhatsappCta";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { displayName, genericWhatsappMessage, site } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o profissional | TI, finanças e contabilidade em Conceição do Araguaia" },
      {
        name: "description",
        content:
          "Quem atende: profissional de tecnologia da informação em Conceição do Araguaia (PA), com atuação também em finanças, contabilidade e manutenção de equipamentos.",
      },
      { property: "og:title", content: "Sobre o profissional" },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

function AboutCopy() {
  return (
    <div className="mx-auto max-w-4xl text-sm leading-relaxed text-muted-foreground lg:text-base">
      <p>
        Atuo na área de tecnologia da informação com vínculo registrado e, além disso, presto serviços de forma independente para pessoas e empresas da região. A rotina técnica diária é o que sustenta o atendimento: problema real, prazo real, equipamento em produção.
      </p>
      <p className="mt-5">
        Com o tempo, o trabalho se estendeu para além do computador. Muita coisa que trava um negócio não é falha de máquina: é controle financeiro desatualizado, documento perdido ou obrigação fiscal em aberto. O método continua o mesmo: entender a situação, organizar e explicar.
      </p>
      <p className="mt-5">
        Atendo presencialmente em {site.location.city} ({site.location.state}) e {site.location.alsoServes}, e remotamente quando o serviço permite.
      </p>
    </div>
  );
}

function RealMediaGallery() {
  const professionalName = site.professionalName || displayName;

  return (
    <div className="mx-auto mt-14 max-w-5xl">
      <div className="mb-7">
        <p className="eyebrow">Presença real</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-foreground lg:text-4xl">
          {professionalName}, por trás do atendimento.
        </h2>
      </div>
      <div className="professional-photo-grid">
        <div className="professional-media-shell">
          <img src={site.media.workingVideoPoster} alt={`${professionalName} em atendimento no escritório`} loading="eager" decoding="async" />
          <span className="professional-media-kicker">ambiente de trabalho</span>
        </div>
        <div className="professional-media-shell">
          <img src={site.media.portrait} alt={`Retrato de ${professionalName}`} loading="eager" decoding="async" />
          <span className="professional-media-kicker">retrato profissional</span>
        </div>
      </div>
      <div className="mt-14 text-center">
        <h2 className="font-display text-3xl leading-tight text-foreground lg:text-5xl">
          Vamos conversar sobre o que você precisa?
        </h2>
        <div className="mt-7 flex justify-center">
          <WhatsappCta message={genericWhatsappMessage} serviceKey="geral" ctaLocation="cta_final_sobre" />
        </div>
      </div>
    </div>
  );
}

function SobrePage() {
  const reduced = useReducedMotion();
  const canExpandVideo = Boolean(site.media.workingVideo && (site.media.workingVideoPoster || site.media.portrait));

  if (canExpandVideo) {
    return (
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc={site.media.workingVideo}
        posterSrc={site.media.workingVideoPoster || site.media.portrait}
        bgImageSrc={site.media.workingVideoPoster || site.media.portrait}
        title={site.professionalName || displayName}
        date={`${site.location.city} · ${site.location.state}`}
        scrollToExpand="Role para expandir"
        textBlend
      >
        <AboutCopy />
        <RealMediaGallery />
      </ScrollExpandMedia>
    );
  }

  return (
    <>
      <section className="relative flex min-h-[64vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={232} intensity={0.88} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/65" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-14 lg:px-8">
          <p className="eyebrow">Sobre</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.96] text-foreground">
            <RevealLines lines={["Quem vai te atender."]} />
          </h1>
        </div>
      </section>

      <section className="border-t border-border py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal><AboutCopy /></Reveal>
          <RealMediaGallery />
        </div>
      </section>
    </>
  );
}
