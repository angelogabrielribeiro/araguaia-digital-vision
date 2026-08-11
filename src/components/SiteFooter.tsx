import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { displayName, services, site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <p className="eyebrow">Atendimento</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Tecnologia, manutenção, finanças e contabilidade em {site.location.city} (
            {site.location.state}), {site.location.alsoServes} e remotamente.
          </p>
          <Link
            to="/contato"
            className="mt-4 inline-flex text-sm text-tech transition-colors hover:underline"
          >
            Ver formas de contato
          </Link>
        </div>

        <div>
          <p className="eyebrow">Serviços</p>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.key}>
                <Link
                  to={s.path}
                  {...(s.hash ? { hash: s.hash } : {})}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
              <span>
                {site.location.city} — {site.location.state}
                <br />
                Também atende {site.location.alsoServes}
                <br />
                {site.location.remote}
              </span>
            </li>
            {site.phoneDisplay && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                <span>{site.phoneDisplay}</span>
              </li>
            )}
            {site.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-tech" aria-hidden />
                <span className="break-all">{site.email}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-mono text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>
            © {new Date().getFullYear()} {displayName}
          </span>
          <span>Profissional autônomo — atendimento presencial e remoto</span>
        </div>
      </div>
    </footer>
  );
}

