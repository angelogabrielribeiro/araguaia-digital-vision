import { MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

import { whatsappLink } from "@/config/site";
import { trackWhatsappClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Props = {
  message: string;
  /** chave do serviço para segmentar o evento */
  serviceKey: string;
  /** onde o botão está (hero, meio da página, rodapé…) */
  ctaLocation: string;
  children?: ReactNode;
  variant?: "solid" | "ghost" | "block";
  className?: string;
};

/** Botão de WhatsApp com mensagem pré-preenchida e evento de clique. */
export function WhatsappCta({
  message,
  serviceKey,
  ctaLocation,
  children = "Falar no WhatsApp",
  variant = "solid",
  className,
}: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsappClick(serviceKey, ctaLocation)}
      data-service={serviceKey}
      data-cta={ctaLocation}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300",
        variant === "solid" &&
          "bg-whatsapp px-6 py-3 text-background shadow-[0_10px_40px_-12px_var(--whatsapp)] hover:-translate-y-0.5 hover:brightness-110",
        variant === "ghost" &&
          "border border-border px-5 py-2.5 text-foreground hover:border-whatsapp hover:text-whatsapp",
        variant === "block" &&
          "w-full bg-whatsapp px-6 py-4 text-base text-background hover:brightness-110",
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {children}
      {variant === "solid" && (
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-whatsapp/50 motion-safe:animate-pulse-ring" />
      )}
    </a>
  );
}
