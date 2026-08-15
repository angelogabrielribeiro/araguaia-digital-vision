/**
 * Estrutura de mensuração: GA4 + Meta Pixel + eventos de clique no WhatsApp.
 * Nada é carregado enquanto os IDs em src/config/site.ts estiverem vazios.
 */
import { site } from "@/config/site";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

let initialized = false;

export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  const ga4 = site.analytics.ga4MeasurementId;
  // O snippet SSR no <head> é o caminho principal. Este bloco fica como fallback
  // para previews ou integrações que removam os scripts do HTML.
  if (ga4 && !window.gtag) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    // O roteador envia todos os pageviews, inclusive o primeiro. Desligar o envio
    // automático aqui evita contabilizar a primeira visita duas vezes.
    window.gtag("config", ga4, { send_page_view: false });
  }

  const pixel = site.analytics.metaPixelId;
  if (pixel) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const n: any = (window.fbq = function (...args: unknown[]) {
      (n as any).callMethod ? (n as any).callMethod(...args) : n.queue!.push(args);
    } as any);
    n.queue = [];
    n.loaded = true;
    n.version = "2.0";
    window._fbq = n;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    window.fbq!("init", pixel);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

/** Pageview em navegação SPA (client-side routing). */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  const payload = {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  };
  window.gtag?.("event", "page_view", payload);
  window.fbq?.("track", "PageView");
}

/** Preserva UTMs da primeira visita para atribuição de anúncios. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function captureUtms() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) found[key] = value;
  }
  if (Object.keys(found).length) {
    try {
      sessionStorage.setItem("utm_params", JSON.stringify(found));
    } catch {
      // storage indisponível
    }
  }
}

export function getUtms(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem("utm_params") || "{}");
  } catch {
    return {};
  }
}

/**
 * Conversão principal do site: clique para iniciar atendimento no WhatsApp.
 * Mantém o evento detalhado e envia também eventos padrão de lead para GA4/Meta,
 * facilitando relatórios e futura otimização de campanhas.
 */
export function trackWhatsappClick(serviceKey: string, location: string) {
  if (typeof window === "undefined") return;

  const payload = {
    method: "whatsapp",
    service: serviceKey,
    cta_location: location,
    ...getUtms(),
  };

  // Evento detalhado para análise de qual serviço/CTA gerou a conversa.
  window.gtag?.("event", "whatsapp_click", payload);
  window.fbq?.("trackCustom", "WhatsAppClick", payload);
  window.dataLayer?.push({ event: "whatsapp_click", ...payload });

  // Conversão padrão usada para relatórios e otimização de aquisição.
  window.gtag?.("event", "generate_lead", payload);
  window.fbq?.("track", "Lead", payload);
  window.dataLayer?.push({ event: "generate_lead", ...payload });
}
