import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { Reveal, RevealLines } from "@/components/Reveal";
import { WhatsappCta } from "@/components/WhatsappCta";
import { AtmospherePlane } from "@/components/three/AtmospherePlane";
import { Stage } from "@/components/three/Stage";
import { genericWhatsappMessage, services, site } from "@/config/site";
import { useReducedMotion } from "@/lib/motion";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e orçamento pelo WhatsApp | WVS Informática" },
      {
        name: "description",
        content:
          "Fale direto pelo WhatsApp com a WVS Informática. Atendimento em Conceição do Araguaia (PA), Couto Magalhães (TO) e remotamente quando o serviço permite.",
      },
      { property: "og:title", content: "Contato WVS Informática — WhatsApp direto" },
      {
        property: "og:description",
        content: "Descreva a sua situação e receba uma avaliação direta do que pode ser feito.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${site.url}/contato` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${site.url}/contato` }],
  }),
  component: ContatoPage,
});

function ContatoPage() {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative flex min-h-[56vh] items-end overflow-hidden">
        <Stage className="absolute inset-0" cameraPosition={[0, 0, 6]}>
          <AtmospherePlane hue={158} intensity={0.8} reduced={reduced} />
        </Stage>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-14 lg:px-8">
          <p className="eyebrow">Contato</p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.98] text-foreground">
            <RevealLines lines={["Fale comigo direto."]} />
          </h1>
          <p className="mt-5 max-w-xl text-sm text-muted-foreground lg:text-base">
            O canal principal é o WhatsApp. Você descreve o que está acontecendo e eu respondo com
            uma avaliação do que dá para fazer.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-5">
            <div className="panel p-7">
              <h2 className="font-display text-2xl text-foreground">Atendimento</h2>
              <ul className="mt-6 space-y-5 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                  <span>
                    <span className="block text-foreground">Presencial</span>
                    {site.location.city} — {site.location.state} e {site.location.alsoServes}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                  <span>
                    <span className="block text-foreground">WhatsApp</span>
                    {site.phoneDisplay || "Conversa direta pelo botão abaixo"}
                  </span>
                </li>
                {site.email && (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                    <span className="break-all">
                      <span className="block text-foreground">E-mail</span>
                      {site.email}
                    </span>
                  </li>
                )}
                {site.location.hours && (
                  <li className="flex gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                    <span>
                      <span className="block text-foreground">Horário</span>
                      {site.location.hours}
                    </span>
                  </li>
                )}

              </ul>
              <div className="mt-8">
                <WhatsappCta
                  message={genericWhatsappMessage}
                  serviceKey="geral"
                  ctaLocation="contato_principal"
                  variant="block"
                >
                  Abrir conversa no WhatsApp
                </WhatsappCta>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {site.location.remote} — para serviços que podem ser feitos à distância.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="eyebrow">Atalhos por assunto</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-foreground lg:text-4xl">
              Já sabe o que precisa? Comece pela conversa certa.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Cada botão abre o WhatsApp com uma mensagem pronta sobre aquele assunto — é só
              enviar.
            </p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {services.map((s) => (
                <div key={s.key} className="flex flex-col justify-between gap-4 bg-background p-5">
                  <div>
                    <h3 className="text-base text-foreground">{s.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {s.tagline}
                    </p>
                  </div>
                  <WhatsappCta
                    message={s.whatsappMessage}
                    serviceKey={s.key}
                    ctaLocation="contato_atalho"
                    variant="ghost"
                    className="self-start"
                  >
                    Falar sobre {s.label.toLowerCase()}
                  </WhatsappCta>
                </div>
              ))}
            </div>

            <div className="panel mt-8 p-6">
              <h3 className="text-base text-foreground">O que ajuda na primeira mensagem</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>— O que está acontecendo, com suas palavras.</li>
                <li>— Se é para pessoa física ou empresa.</li>
                <li>— Foto da tela, do erro ou do equipamento, se tiver.</li>
                <li>— Se prefere atendimento presencial ou remoto.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
