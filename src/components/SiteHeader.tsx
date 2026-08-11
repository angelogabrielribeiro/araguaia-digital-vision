import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { WhatsappCta } from "@/components/WhatsappCta";
import { genericWhatsappMessage, site } from "@/config/site";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/ti", label: "TI" },
  { to: "/manutencao", label: "Manutenção" },
  { to: "/financas", label: "Finanças" },
  { to: "/contabilidade", label: "Contabilidade" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-tech-deep to-tech">
            <span className="font-mono text-xs font-bold text-background">CA</span>
          </span>
          <span className="leading-none">
            <span className="block text-sm font-medium text-foreground">{site.shortName}</span>
            <span className="block font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {site.location.city} — {site.location.state}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.slice(1, 7).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="relative rounded-full px-3 py-2 text-sm transition-colors hover:text-foreground"
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-tech"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <WhatsappCta
            message={genericWhatsappMessage}
            serviceKey="geral"
            ctaLocation="header"
            variant="ghost"
          >
            WhatsApp
          </WhatsappCta>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-background/97 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col px-5 py-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "text-tech" }}
                    className="flex items-baseline justify-between border-b border-border py-4 font-display text-2xl text-foreground"
                  >
                    {item.label}
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8">
                <WhatsappCta
                  message={genericWhatsappMessage}
                  serviceKey="geral"
                  ctaLocation="menu_mobile"
                  variant="block"
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
