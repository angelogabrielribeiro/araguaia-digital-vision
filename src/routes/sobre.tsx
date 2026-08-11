import { createFileRoute } from "@tanstack/react-router";

import { Reveal, RevealLines } from "@/components/Reveal";
import { WhatsappCta } from "@/components/WhatsappCta";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { displayName, genericWhatsappMessage, site } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

const hasMedia = Boolean(site.media.workingVideo) || site.media.gallery.length > 0;


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
      {
        property: "og:description",
        content:
          "Rotina técnica em TI, atendimento independente e trabalho direto com quem precisa de solução.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/sobre" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});

/** Foto real do profissional — quando não houver, nada é exibido. */
function PortraitSlot() {
  if (!site.media.portrait) return null;
  return (
    <img
      src={site.media.portrait}
      alt={`Foto de ${displayName}`}
      loading="lazy"
      className="h-full w-full rounded-xl object-cover"
    />
  );
}

/** Vídeo real do profissional — quando não houver, nada é exibido. */
function VideoSlot() {
  if (!site.media.workingVideo) return null;
  return (
    <video
      src={site.media.workingVideo}
      poster={site.media.workingVideoPoster || undefined}
      controls
      playsInline
      preload="none"
      className="aspect-video w-full rounded-xl object-cover"
    />
  );
}


function SobrePage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={228} intensity={0.8} reduced={reduced} />
        </Stage>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-14 lg:px-8">
          <p className="eyebrow">Sobre</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.98] text-foreground">
            <RevealLines lines={["Quem vai te atender."]} />
          </h1>
        </div>
      </section>

      <section className="border-t border-border py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-5">
            <PortraitSlot />
            <div className="panel mt-4 p-5">
              <p className="text-sm font-medium text-foreground">{site.professionalName}</p>
              <p className="mt-1 text-xs text-muted-foreground">{site.professionalRole}</p>
              <p className="mt-3 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                {site.location.city} — {site.location.state}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="space-y-5 text-sm leading-relaxed text-muted-foreground lg:text-base">
              <p>
                Atuo na área de tecnologia da informação com vínculo registrado e, além disso,
                presto serviços de forma independente para pessoas e empresas da região. A rotina
                técnica diária é o que sustenta o atendimento: problema real, prazo real,
                equipamento em produção.
              </p>
              <p>
                Com o tempo, o trabalho se estendeu para além do computador. Muita coisa que trava
                um negócio não é falha de máquina — é controle financeiro desatualizado, documento
                perdido, obrigação fiscal em aberto. Passei a atender também essa parte, com o
                mesmo método: entender a situação, organizar e explicar.
              </p>
              <p>
                Atendo presencialmente em {site.location.city} ({site.location.state}) e{" "}
                {site.location.alsoServes}, e remotamente quando o serviço permite. Não trabalho
                com promessa exagerada nem com pressa que atropela o diagnóstico.
              </p>
              <p className="text-foreground/90">
                Se você chegou até aqui procurando alguém que responda, explique e resolva, é
                exatamente isso que ofereço.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { k: "Atendimento", v: "Presencial e remoto" },
                { k: "Contato", v: "WhatsApp direto" },
                { k: "Áreas", v: "TI, manutenção, finanças e contabilidade" },
              ].map((x) => (
                <div key={x.k} className="panel p-4">
                  <p className="eyebrow">{x.k}</p>
                  <p className="mt-2 text-sm text-foreground">{x.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {hasMedia && (
        <section className="border-t border-border bg-surface/30 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <Reveal>
              <p className="eyebrow">Bastidor do trabalho</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-foreground lg:text-4xl">
                Um pouco de como o atendimento acontece.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <VideoSlot />
            </Reveal>

            {site.media.gallery.length > 0 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {site.media.gallery.map((item) => (
                  <img
                    key={item.src}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="aspect-4/3 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
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
              <WhatsappCta
                message={genericWhatsappMessage}
                serviceKey="geral"
                ctaLocation="cta_final_sobre"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
