import { createFileRoute } from "@tanstack/react-router";

import { MeteorStreaks } from "@/components/MeteorStreaks";
import { Reveal, RevealLines } from "@/components/Reveal";
import { ServiceConstellation } from "@/components/ServiceConstellation";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { site } from "@/config/site";
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
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/servicos" },
    ],
    links: [{ rel: "canonical", href: "/servicos" }],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[68vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={222} intensity={0.92} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/68" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-16 lg:px-8">
          <p className="eyebrow">Serviços</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.1rem)] leading-[0.96] text-foreground">
            <RevealLines lines={["Não escolha numa lista.", "Explore o espaço."]} />
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            Arraste a galáxia, veja os cards em profundidades diferentes e abra a área que corresponde ao seu caso. Atendimento em {site.location.city} ({site.location.state}), {site.location.alsoServes} e remotamente quando aplicável.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-black">
        <Reveal y={18}>
          <ServiceConstellation />
        </Reveal>
      </section>
    </>
  );
}
