import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { type CSSProperties } from "react";

import { MeteorStreaks } from "@/components/MeteorStreaks";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ScrollNarrative, type NarrativeStep } from "@/components/ScrollNarrative";
import { WhatsappCta } from "@/components/WhatsappCta";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { site, type ServiceDef } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";
import type { NarrativeMode } from "@/components/three/NarrativeScene";

type Props = {
  service: ServiceDef;
  mode: NarrativeMode;
  narrativeLabel: string;
  steps: NarrativeStep[];
  process: { title: string; body: string }[];
  faq?: { q: string; a: string }[];
  children?: React.ReactNode;
};

export function ServicePage({ service, mode, narrativeLabel, steps, process, faq, children }: Props) {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={service.hue} intensity={0.98} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div
          className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full blur-3xl"
          style={{ background: `color-mix(in srgb, ${service.accent} 14%, transparent)` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/34 to-background/64" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-16 lg:px-8 lg:pb-24">
          <p className="eyebrow">
            {site.location.city} ({site.location.state}) · {site.location.alsoServes} · Remoto
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.96] text-foreground">
            <RevealLines lines={[service.title]} />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{service.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            {service.summary}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsappCta message={service.whatsappMessage} serviceKey={service.key} ctaLocation="hero_servico">
              Falar sobre {service.label.toLowerCase()}
            </WhatsappCta>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-tech hover:text-foreground"
            >
              Ver todos os serviços <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ScrollNarrative mode={mode} hue={service.hue} steps={steps} label={narrativeLabel} />

      <section className="relative overflow-hidden border-t border-border bg-surface/30 py-20 lg:py-28">
        <div
          className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full blur-3xl"
          style={{ background: `color-mix(in srgb, ${service.accent} 9%, transparent)` }}
        />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="eyebrow">O que entra nesse atendimento</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Escopo claro, combinado antes de começar.
            </h2>
          </Reveal>

          <ul
            className="mt-12 grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))" }}
          >
            {service.items.map((item, i) => (
              <li key={item} className="min-w-0">
                <Reveal delay={i * 0.05} className="h-full">
                  <BorderBeamPanel
                    beams={2}
                    seed={i + 21}
                    radius={16}
                    thickness={1.25}
                    glow={i % 2 === 0}
                    colors={[service.accent, i % 2 === 0 ? "#ffffff" : "#8aa4ad"]}
                    innerClassName="group h-full min-h-[150px] rounded-[15px] bg-background/90 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-surface/90"
                  >
                    <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">0{i + 1}</span>
                    <Check className="mt-5 h-4 w-4 transition-transform duration-300 group-hover:scale-125" style={{ color: service.accent }} aria-hidden />
                    <p className="mt-4 text-sm leading-relaxed text-foreground/90">{item}</p>
                  </BorderBeamPanel>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="eyebrow">Como funciona</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Do primeiro contato até o problema resolvido.
            </h2>
          </Reveal>
          <ol
            className="service-process-rail mt-12 grid gap-6 md:grid-cols-3"
            style={{ "--process-accent": service.accent } as CSSProperties}
          >
            {process.map((p, i) => (
              <li key={p.title} className="service-process-node">
                <Reveal delay={i * 0.08} className="h-full">
                  <BorderBeamPanel
                    beams={1}
                    seed={40 + i}
                    radius={16}
                    thickness={1.2}
                    glow={false}
                    colors={[service.accent]}
                    innerClassName="group h-full min-h-[190px] rounded-[15px] bg-background/92 p-6 backdrop-blur transition-transform duration-300 hover:-translate-y-2"
                  >
                    <span className="font-mono text-xs" style={{ color: service.accent }}>0{i + 1}</span>
                    <div
                      className="mt-5 h-px w-10 origin-left transition-transform duration-500 group-hover:scale-x-150"
                      style={{ background: service.accent }}
                    />
                    <h3 className="mt-5 text-lg text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </BorderBeamPanel>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {children}

      {faq && faq.length > 0 && (
        <section className="border-t border-border py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <Reveal><p className="eyebrow">Perguntas frequentes</p></Reveal>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                  <details className="group py-5">
                    <summary className="cursor-pointer list-none text-base text-foreground marker:hidden">
                      <span className="flex items-start justify-between gap-4">
                        {f.q}
                        <span className="mt-1 font-mono text-xs text-tech transition-transform group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-t border-border">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={service.hue} intensity={0.76} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div className="pointer-events-none absolute inset-0 bg-background/60" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Precisa de {service.label.toLowerCase()}?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground lg:text-base">
              Me explique a situação pelo WhatsApp. Se der para resolver remotamente, resolvo remotamente; se precisar de atendimento presencial, combinamos data e local.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsappCta message={service.whatsappMessage} serviceKey={service.key} ctaLocation="cta_final_servico" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
