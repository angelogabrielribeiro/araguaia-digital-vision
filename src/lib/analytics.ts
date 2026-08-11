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
  if (ga4) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4, { send_page_view: true });
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
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq!("init", pixel);
    window.fbq!("track", "PageView");
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

/** Pageview em navegação SPA (client-side routing). */
export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "page_view", { page_path: path, page_location: window.location.href });
  window.fbq?.("track", "PageView");
}

/** Preserva UTMs da primeira visita para atribuição de anúncios. */
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function captureUtms() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) found[k] = v;
  }
  if (Object.keys(found).length) {
    try {
      sessionStorage.setItem("utm_params", JSON.stringify(found));
    } catch {
      /* storage indisponível */
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

/** Evento de clique no WhatsApp, segmentado por serviço e por local do botão. */
export function trackWhatsappClick(serviceKey: string, location: string) {
  if (typeof window === "undefined") return;
  const payload = { service: serviceKey, cta_location: location, ...getUtms() };
  window.gtag?.("event", "whatsapp_click", payload);
  window.fbq?.("trackCustom", "WhatsAppClick", payload);
  window.dataLayer?.push({ event: "whatsapp_click", ...payload });
}
