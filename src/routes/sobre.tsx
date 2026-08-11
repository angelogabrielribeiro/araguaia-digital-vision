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
        title="Atendimento Profissional"
        date={`${site.location.city} · ${site.location.state}`}
        scrollToExpand="Role para expandir"
        textBlend
      >
        <AboutCopy />
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
        <div className={`mx-auto grid max-w-7xl gap-12 px-5 lg:px-8 ${site.media.portrait ? "lg:grid-cols-12" : ""}`}>
          {site.media.portrait && (
            <Reveal className="lg:col-span-5">
              <img
                src={site.media.portrait}
                alt={`Foto de ${displayName}`}
                loading="lazy"
                className="h-full max-h-[680px] w-full rounded-xl object-cover"
              />
            </Reveal>
          )}

          <Reveal delay={0.1} className={site.media.portrait ? "lg:col-span-7" : "mx-auto max-w-4xl"}>
            <div className="panel mb-6 p-5">
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{site.professionalRole}</p>
              <p className="mt-3 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                {site.location.city} — {site.location.state}
              </p>
            </div>
            <AboutCopy />
          </Reveal>
        </div>
      </section>

      {site.media.gallery.length > 0 && (
        <section className="border-t border-border bg-surface/30 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {site.media.gallery.map((item) => (
                <img key={item.src} src={item.src} alt={item.alt} loading="lazy" className="aspect-4/3 w-full rounded-lg object-cover" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 text-center lg:py-28">
        <div className="mx-auto max-w-2xl px-5">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight text-foreground lg:text-5xl">
              Vamos conversar sobre o que você precisa?
            </h2>
            <div className="mt-8 flex justify-center">
              <WhatsappCta message={genericWhatsappMessage} serviceKey="geral" ctaLocation="cta_final_sobre" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
