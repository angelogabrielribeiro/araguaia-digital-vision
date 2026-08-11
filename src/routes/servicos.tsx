import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal, RevealLines } from "@/components/Reveal";
import { WhatsappCta } from "@/components/WhatsappCta";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { genericWhatsappMessage, services, site } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços: TI, manutenção, finanças e contabilidade | Conceição do Araguaia" },
      {
        name: "description",
        content:
          "Todos os serviços em um lugar: suporte de TI, software e sistemas, manutenção tecnológica, finanças e contabilidade. Presencial e remoto.",
      },
      { property: "og:title", content: "Serviços — tecnologia, finanças e contabilidade" },
      {
        property: "og:description",
        content:
          "Suporte técnico, sistemas, manutenção de equipamentos, organização financeira e orientação fiscal.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/servicos" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/servicos" }],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[62vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={200} intensity={0.85} reduced={reduced} />
        </Stage>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-14 lg:px-8">
          <p className="eyebrow">Serviços</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.98] text-foreground">
            <RevealLines lines={["Tudo o que eu atendo,", "explicado sem rodeio."]} />
          </h1>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground lg:text-base">
            Atendimento em {site.location.city} ({site.location.state}),{" "}
            {site.location.alsoServes} e remotamente quando o serviço permite.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        {services.map((s, i) => (
          <Reveal key={s.key}>
            <article className="group border-b border-border">
              <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-12 lg:px-8 lg:py-20">
                <div className="lg:col-span-4">
                  <span className="font-mono text-xs text-tech">0{i + 1}</span>
                  <h2 className="mt-3 font-display text-3xl leading-tight text-foreground lg:text-4xl">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">{s.tagline}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={s.path}
                      {...(s.hash ? { hash: s.hash } : {})}
                      className="inline-flex items-center gap-2 text-sm text-tech hover:underline"
                    >
                      Ver página <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                    {s.summary}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {s.items.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm text-foreground/85 before:mt-2 before:h-px before:w-4 before:shrink-0 before:bg-tech"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-3 lg:flex lg:items-start lg:justify-end">
                  <WhatsappCta
                    message={s.whatsappMessage}
                    serviceKey={s.key}
                    ctaLocation="lista_servicos"
                    variant="ghost"
                  >
                    Falar sobre isso
                  </WhatsappCta>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="py-20 text-center lg:py-28">
        <div className="mx-auto max-w-2xl px-5">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight text-foreground lg:text-5xl">
              Não sabe em qual serviço a sua situação se encaixa?
            </h2>
            <p className="mt-4 text-sm text-muted-foreground lg:text-base">
              Descreve do seu jeito no WhatsApp que eu te digo o que dá para fazer.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsappCta
                message={genericWhatsappMessage}
                serviceKey="geral"
                ctaLocation="cta_final_servicos"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
