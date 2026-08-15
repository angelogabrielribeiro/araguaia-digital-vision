import { createFileRoute } from "@tanstack/react-router";

import { MeteorStreaks } from "@/components/MeteorStreaks";
import { RevealLines } from "@/components/Reveal";
import { ServiceScrollAtlas } from "@/components/ServiceScrollAtlas";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { site } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços: TI, manutenção, finanças e contabilidade | WVS Informática" },
      {
        name: "description",
        content:
          "Todos os serviços da WVS Informática: suporte de TI, software e sistemas, manutenção tecnológica, finanças e contabilidade. Presencial e remoto.",
      },
      { property: "og:title", content: "Serviços WVS Informática — tecnologia, finanças e contabilidade" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/servicos` },
    ],
    links: [{ rel: "canonical", href: `${site.url}/servicos` }],
  }),
  component: ServicosPage,
});

function ServicosPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={222} intensity={0.96} reduced={reduced} />
        </Stage>
        <MeteorStreaks />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/64" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-16 lg:px-8 lg:pb-20">
          <p className="eyebrow">Serviços</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.1rem)] leading-[0.96] text-foreground">
            <RevealLines lines={["Role pela operação.", "Cada área entra em cena."]} />
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground lg:text-base">
            Aqui a navegação muda: em vez de repetir a galáxia da Home, o scroll conduz cada frente de atendimento por um atlas orbital. Atendimento em {site.location.city} ({site.location.state}), {site.location.alsoServes} e remotamente quando aplicável.
          </p>
        </div>
      </section>

      <ServiceScrollAtlas />
    </>
  );
}
