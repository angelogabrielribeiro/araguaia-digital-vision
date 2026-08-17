import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import stellarCss from "../stellar.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ExperienceOverlay } from "@/components/ExperienceOverlay";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { displayName, site } from "@/config/site";
import { captureUtms, initAnalytics, trackPageView } from "@/lib/analytics";


const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://d2ol7oe51mr4n9.cloudfront.net https://*.google-analytics.com https://www.google.com",
  "media-src 'self' blob: https://d2ol7oe51mr4n9.cloudfront.net",
  "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">Essa página não existe ou foi movida.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">A página não carregou</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente atualizar ou voltar ao início.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Tentar novamente
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Voltar ao início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${displayName} — TI, manutenção, finanças e contabilidade` },
      { name: "description", content: "Serviços de TI, suporte técnico, manutenção tecnológica, finanças e contabilidade em Conceição do Araguaia (PA)." },
      { name: "author", content: site.professionalName || displayName },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#0b1420" },
      { property: "og:site_name", content: displayName },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: site.url },
      { property: "og:title", content: `${displayName} — TI, manutenção, finanças e contabilidade` },
      { property: "og:description", content: "Atendimento em TI, manutenção tecnológica, finanças e contabilidade em Conceição do Araguaia (PA), com suporte remoto quando aplicável." },
      { property: "og:image", content: site.media.workingVideoPoster },
      { property: "og:image:alt", content: `${site.professionalName || displayName} em atendimento profissional` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${displayName} — atendimento profissional` },
      { name: "twitter:description", content: "TI, suporte, manutenção, finanças e contabilidade em Conceição do Araguaia (PA)." },
      { name: "twitter:image", content: site.media.workingVideoPoster },
      ...(site.analytics.googleSearchConsoleVerification ? [{ name: "google-site-verification", content: site.analytics.googleSearchConsoleVerification }] : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: stellarCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://d2ol7oe51mr4n9.cloudfront.net" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" },
      { rel: "icon", href: site.media.logo, type: "image/png" },
      { rel: "shortcut icon", href: site.media.logo, type: "image/png" },
      { rel: "apple-touch-icon", href: site.media.logo },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const ga4 = site.analytics.ga4MeasurementId;
  const ga4Snippet = ga4
    ? `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", ${JSON.stringify(ga4)}, { send_page_view: false });`
    : "";

  return (
    <html lang="pt-BR">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CONTENT_SECURITY_POLICY} />
        <HeadContent />
        {ga4 ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} />
            <script dangerouslySetInnerHTML={{ __html: ga4Snippet }} />
          </>
        ) : null}
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { captureUtms(); initAnalytics(); }, []);
  useEffect(() => { trackPageView(pathname); }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <ExperienceOverlay />
      <SiteHeader />
      <main id="conteudo"><Outlet /></main>
      <SiteFooter />
    </QueryClientProvider>
  );
}
