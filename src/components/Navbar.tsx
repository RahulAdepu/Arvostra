import * as React from "react";
import { BRAND } from "@/lib/data";
import { ArvostraMark, Icon, ICONS } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";
import { QrNavButton } from "./MobileQr";

export type ActivePage = "home" | "demos" | "services" | "about" | "feedback";

interface NavbarProps {
  activePage?: ActivePage;
  scrolled: boolean;
  onNavigate?: (href: string) => (e: React.MouseEvent) => void;
  onOpenQr: () => void;
}

const NAV_ITEMS: { id: ActivePage; label: string; href: string }[] = [
  { id: "demos", label: "Demos", href: "./demos.html" },
  { id: "services", label: "Services", href: "./services.html" },
  { id: "about", label: "About", href: "./about.html" },
];

export function Navbar({
  activePage = "home",
  scrolled,
  onNavigate,
  onOpenQr,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const inquiryHref = activePage === "home" ? "#inquiry" : "./index.html#inquiry";
  const homeHref = activePage === "home" ? "#top" : "./index.html";

  const handleLink = (href: string) => (e: React.MouseEvent) => {
    setMobileOpen(false);
    if (href.startsWith("#") && onNavigate) {
      onNavigate(href)(e);
    }
  };

  return (
    <header className="arv-nav" data-scrolled={scrolled || undefined}>
      <div className="arv-nav-in" ref={boxRef}>
        <a
          href={homeHref}
          className="arv-brand"
          onClick={handleLink(homeHref)}
          aria-label="Arvostra Home"
        >
          <ArvostraMark size={24} />
          <span>{BRAND.name}</span>
        </a>

        <nav className="arv-nav-links" aria-label="Primary">
          {NAV_ITEMS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="arv-nav-link"
              data-active={activePage === link.id || undefined}
              aria-current={activePage === link.id ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="arv-nav-end">
          <QrNavButton onClick={onOpenQr} />
          <ThemeToggle />
          <a
            href={inquiryHref}
            className="arv-btn arv-btn-dark arv-btn-sm"
            onClick={handleLink(inquiryHref)}
          >
            Start a Project
          </a>
          <button
            type="button"
            className="arv-burger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            <Icon d={mobileOpen ? ICONS.close : ICONS.menu} size={18} />
          </button>
        </div>

        <div
          className="arv-sheet"
          data-open={mobileOpen || undefined}
          aria-hidden={!mobileOpen}
        >
          <a
            href="./index.html"
            onClick={() => setMobileOpen(false)}
            tabIndex={mobileOpen ? 0 : -1}
          >
            Home
            <Icon d={ICONS.arrow} size={15} />
          </a>
          {NAV_ITEMS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {link.label}
              <Icon d={ICONS.arrow} size={15} />
            </a>
          ))}
          <a
            href="./feedback.html"
            onClick={() => setMobileOpen(false)}
            tabIndex={mobileOpen ? 0 : -1}
          >
            Bugs &amp; Suggestions
            <Icon d={ICONS.arrow} size={15} />
          </a>
          <a
            href={inquiryHref}
            onClick={handleLink(inquiryHref)}
            tabIndex={mobileOpen ? 0 : -1}
            className="arv-sheet-cta"
          >
            Start a Project
            <Icon d={ICONS.arrow} size={15} />
          </a>
        </div>
      </div>
      <span className="arv-progress" aria-hidden="true" />
    </header>
  );
}
