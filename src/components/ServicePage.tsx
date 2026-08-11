import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Reveal, RevealLines } from "@/components/Reveal";
import { ScrollNarrative, type NarrativeStep } from "@/components/ScrollNarrative";
import { WhatsappCta } from "@/components/WhatsappCta";
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
  /** Como o atendimento acontece, do primeiro contato à entrega */
  process: { title: string; body: string }[];
  /** Perguntas frequentes específicas do serviço */
  faq?: { q: string; a: string }[];
  children?: React.ReactNode;
};

export function ServicePage({
  service,
  mode,
  narrativeLabel,
  steps,
  process,
  faq,
  children,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <>
      {/* Hero do serviço */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={service.hue} intensity={0.9} reduced={reduced} />
        </Stage>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-16 lg:px-8 lg:pb-24">
          <p className="eyebrow">
            {site.location.city} ({site.location.state}) · {site.location.alsoServes} · Remoto
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.98] text-foreground">
            <RevealLines lines={[service.title]} />
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{service.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            {service.summary}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <WhatsappCta
              message={service.whatsappMessage}
              serviceKey={service.key}
              ctaLocation="hero_servico"
            >
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

      {/* Narrativa 3D dirigida pelo scroll */}
      <ScrollNarrative mode={mode} hue={service.hue} steps={steps} label={narrativeLabel} />

      {/* O que está incluso */}
      <section className="relative border-t border-border bg-surface/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="eyebrow">O que entra nesse atendimento</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Escopo claro, combinado antes de começar.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {service.items.map((item, i) => (
              <li key={item} className="bg-background">
                <Reveal delay={i * 0.05} className="h-full">
                  <div className="group h-full p-6 transition-colors hover:bg-surface">
                    <Check className="h-4 w-4 text-signal" aria-hidden />
                    <p className="mt-4 text-sm leading-relaxed text-foreground/90">{item}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="eyebrow">Como funciona</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Do primeiro contato até o problema resolvido.
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {process.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="panel h-full p-6">
                    <span className="font-mono text-xs text-tech">0{i + 1}</span>
                    <h3 className="mt-3 text-lg text-foreground">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
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
            <Reveal>
              <p className="eyebrow">Perguntas frequentes</p>
            </Reveal>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faq.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                  <details className="group py-5">
                    <summary className="cursor-pointer list-none text-base text-foreground marker:hidden">
                      <span className="flex items-start justify-between gap-4">
                        {f.q}
                        <span className="mt-1 font-mono text-xs text-tech transition-transform group-open:rotate-45">
                          +
                        </span>
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

      {/* CTA final contextual */}
      <section className="relative overflow-hidden border-t border-border">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={service.hue} intensity={0.7} reduced={reduced} />
        </Stage>
        <div className="pointer-events-none absolute inset-0 bg-background/60" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="font-display text-4xl leading-tight text-foreground lg:text-5xl">
              Precisa de {service.label.toLowerCase()}?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground lg:text-base">
              Me explique a situação pelo WhatsApp. Se der para resolver remotamente, resolvo
              remotamente; se precisar de atendimento presencial, combinamos data e local.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsappCta
                message={service.whatsappMessage}
                serviceKey={service.key}
                ctaLocation="cta_final_servico"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
