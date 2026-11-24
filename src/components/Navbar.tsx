"use client";

import * as React from "react";
import { BRAND, DemoCategory, NAV_DEMOS } from "@/lib/data";
import { ArvostraMark, Icon, ICONS } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  scrolled: boolean;
  onNavigate: (href: string) => (e: React.MouseEvent) => void;
  onSelectDemoCategory: (category: DemoCategory) => void;
}

export function Navbar({
  scrolled,
  onNavigate,
  onSelectDemoCategory,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!dropdownOpen && !mobileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropdownOpen, mobileOpen]);

  const handleLink = (href: string) => (e: React.MouseEvent) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    onNavigate(href)(e);
  };

  const handleDemoCategory = (cat: DemoCategory) => (e: React.MouseEvent) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    onSelectDemoCategory(cat);
    onNavigate("#demos")(e);
  };

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="arv-nav" data-scrolled={scrolled || undefined}>
      <div className="arv-nav-in" ref={boxRef}>
        <a
          href="#top"
          className="arv-brand"
          onClick={handleLink("#top")}
          aria-label="Arvostra Home"
        >
          <ArvostraMark size={24} />
          <span>{BRAND.name}</span>
        </a>

        <nav className="arv-nav-links" aria-label="Primary">
          <div
            className="arv-prod"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              className="arv-nav-link"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen((o) => !o)}
            >
              Demos
              <Icon d={ICONS.down} size={13} className="arv-caret" />
            </button>
            <div
              className="arv-prod-panel"
              data-open={dropdownOpen || undefined}
            >
              {NAV_DEMOS.map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="arv-prod-item"
                  onClick={handleDemoCategory(item.category)}
                  tabIndex={dropdownOpen ? 0 : -1}
                >
                  <span className="arv-prod-ic">
                    <Icon
                      d={[ICONS.layers, ICONS.spark, ICONS.grid][idx % 3]}
                      size={17}
                    />
                  </span>
                  <span>
                    <b>{item.label}</b>
                    <small>{item.text}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="arv-nav-link"
              onClick={handleLink(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="arv-nav-end">
          <ThemeToggle />
          <a
            href="#inquiry"
            className="arv-btn arv-btn-dark arv-btn-sm"
            onClick={handleLink("#inquiry")}
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
            href="#demos"
            onClick={handleLink("#demos")}
            tabIndex={mobileOpen ? 0 : -1}
          >
            Live Demos & Marketplace
            <Icon d={ICONS.arrow} size={15} />
          </a>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleLink(link.href)}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {link.label}
              <Icon d={ICONS.arrow} size={15} />
            </a>
          ))}
          <a
            href="#inquiry"
            onClick={handleLink("#inquiry")}
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
