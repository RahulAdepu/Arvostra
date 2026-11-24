"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DemoCategory,
  DemoItem,
  DEMOS,
  DemoSandboxId,
} from "@/lib/data";
import { markedWords, useReducedMotion } from "@/lib/hooks";
import { Navbar } from "./Navbar";
import { HeroWorkspace } from "./HeroWorkspace";
import { EditorialStatement } from "./EditorialStatement";
import { DemosMarketplace } from "./DemosMarketplace";
import { DemoSandboxModal } from "./DemoSandboxModal";
import { ServicesSection } from "./ServicesSection";
import { ProcessSection } from "./ProcessSection";
import { FounderSection } from "./FounderSection";
import { FaqSection } from "./FaqSection";
import { InquiryPrefill, InquirySection } from "./InquirySection";
import { Footer } from "./Footer";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const HERO_TITLE = "Practical *software* and *AI*\nsystems built for modern businesses.";

export function ArvostraLanding() {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLSpanElement | null>(null);

  const [scrolled, setScrolled] = React.useState(false);
  const [activeScene, setActiveScene] = React.useState(0);
  const [demoCategory, setDemoCategory] = React.useState<"All" | DemoCategory>("All");
  const [openDemo, setOpenDemo] = React.useState<DemoItem | null>(null);
  const [prefill, setPrefill] = React.useState<InquiryPrefill>({ signal: 0 });

  // Smooth anchor scrolling scoped within the page
  const scrollToSection = React.useCallback(
    (id: string) => {
      const root = rootRef.current;
      if (!root) return;
      const target =
        id === "top" || id === ""
          ? root
          : (root.querySelector(`[data-sec="${id}"]`) as HTMLElement | null) ||
            document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduced]
  );

  const onNavigate = React.useCallback(
    (href: string) => (e: React.MouseEvent) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      scrollToSection(href.slice(1));
    },
    [scrollToSection]
  );

  const handleOpenSandboxById = React.useCallback((sandboxId: DemoSandboxId) => {
    const found = DEMOS.find((d) => d.sandboxId === sandboxId) ?? DEMOS[0];
    setOpenDemo(found);
  }, []);

  const handlePrefillInquiry = React.useCallback(
    (opts: {
      serviceCategory: string;
      description?: string;
      selectedDemo?: string;
    }) => {
      setPrefill((prev) => ({
        ...opts,
        signal: prev.signal + 1,
      }));
      scrollToSection("inquiry");
    },
    [scrollToSection]
  );

  const handleCustomizeDemo = React.useCallback(
    (demo: DemoItem) => {
      handlePrefillInquiry({
        serviceCategory: "Customize a Demo",
        selectedDemo: demo.name,
        description: `I'd like to customize the "${demo.name}" (${demo.category}) solution for my business.`,
      });
    },
    [handlePrefillInquiry]
  );

  const handleSelectService = React.useCallback(
    (category: string, serviceTitle: string) => {
      handlePrefillInquiry({
        serviceCategory: category,
        description: `Interested in ${serviceTitle}. Here's what I'm looking to build: `,
      });
    },
    [handlePrefillInquiry]
  );

  // Sticky nav frosted backdrop observer
  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sticky feature stage active scene observer
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const blocks = Array.from(
      root.querySelectorAll("[data-feat]")
    ) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.feat ?? 0);
            setActiveScene(idx);
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, []);

  // GSAP ScrollTrigger choreography (matching Teal Treasury Landing motion design)
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = gsap.utils.selector(root);
    const one = (sel: string) => q(sel)[0] as Element | undefined;

    const mm = gsap.matchMedia();
    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        wide: "(min-width: 900px)",
      },
      (ctx) => {
        const { motion, wide } = ctx.conditions as {
          motion: boolean;
          wide: boolean;
        };
        if (!motion) return;

        // Top scroll progress hairline
        gsap.fromTo(
          q(".arv-progress"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          }
        );

        // Hero entrance
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .from(q(".arv-hero-eyebrow"), { y: 12, autoAlpha: 0, duration: 0.7 })
          .from(
            q(".arv-hero-word"),
            { yPercent: 118, rotate: 2.5, duration: 1.05, stagger: 0.045 },
            "-=0.45"
          )
          .from(
            q(".arv-hero-fade"),
            { y: 18, autoAlpha: 0, duration: 0.85, stagger: 0.08 },
            "-=0.72"
          )
          .from(
            q(".arv-device-wrap"),
            { y: 110, autoAlpha: 0, duration: 1.15 },
            "-=0.7"
          )
          .from(
            q(".arv-float"),
            { x: 56, autoAlpha: 0, duration: 1, stagger: 0.14 },
            "-=0.85"
          );

        // 3D device tilt stands upright as you scroll
        const device = one(".arv-device");
        if (device) {
          gsap.fromTo(
            device,
            { rotateX: wide ? 20 : 10, scale: wide ? 0.92 : 0.96, y: wide ? -8 : 0 },
            {
              rotateX: 0,
              scale: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: one(".arv-device-wrap"),
                start: "top 96%",
                end: wide ? "top 20%" : "top 40%",
                scrub: 0.7,
              },
            }
          );
        }

        // Parallax drift on floating hero telemetry cards
        if (wide) {
          q(".arv-float-in").forEach((el, i) =>
            gsap.to(el, {
              y: -60 - i * 50,
              rotate: i ? 1.8 : -1.8,
              ease: "none",
              scrollTrigger: {
                trigger: one(".arv-hero"),
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            })
          );
        }

        // Subtle ambient glow parallax
        gsap.to(q(".arv-hero-glow"), {
          yPercent: 28,
          scale: 1.2,
          ease: "none",
          scrollTrigger: {
            trigger: one(".arv-hero"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Word-by-word scroll inking on Studio Philosophy statement
        const bwords = q(".arv-bword");
        if (bwords.length) {
          gsap.fromTo(
            bwords,
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.05,
              ease: "none",
              scrollTrigger: {
                trigger: one(".arv-benefits-text"),
                start: "top 82%",
                end: "bottom 48%",
                scrub: true,
              },
            }
          );
        }

        // Pillar hairline rules draw in
        gsap.fromTo(
          q(".arv-stat-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            stagger: 0.12,
            scrollTrigger: {
              trigger: one(".arv-stats"),
              start: "top 86%",
              once: true,
            },
          }
        );

        // Sticky capabilities stage unfolds from rounded inset
        q(".arv-stage, .arv-feat-inline").forEach((el) =>
          gsap.fromTo(
            el,
            { clipPath: "inset(10% 7% 10% 7% round 32px)", scale: 0.96 },
            {
              clipPath: "inset(0% 0% 0% 0% round 14px)",
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 40%",
                scrub: 0.6,
              },
            }
          )
        );

        // Staggered batch rise reveals
        const riseEls = q("[data-arv-rise]");
        gsap.set(riseEls, { y: 30, autoAlpha: 0 });
        ScrollTrigger.batch(riseEls, {
          start: "top 90%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              y: 0,
              autoAlpha: 1,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.07,
              overwrite: true,
            }),
        });

        // Checkmark stroke draw-in inside Services section
        gsap.fromTo(
          q(".arv-price-check path"),
          { strokeDashoffset: 26 },
          {
            strokeDashoffset: 0,
            duration: 0.65,
            ease: "power2.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: one(".arv-price-list"),
              start: "top 82%",
              once: true,
            },
          }
        );

        // Founder precision dial rotates with page scroll
        const opCard = one(".arv-op");
        if (opCard) {
          gsap.to(q(".arv-dial-ticks"), {
            rotation: 140,
            svgOrigin: "160 160",
            ease: "none",
            scrollTrigger: {
              trigger: opCard,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          });
          gsap.to(q(".arv-dial-ring"), {
            rotation: -220,
            svgOrigin: "160 160",
            ease: "none",
            scrollTrigger: {
              trigger: opCard,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }

        // Inquiry ambient card expands smoothly into frame
        const ctaCard = one(".arv-cta");
        if (ctaCard) {
          gsap.fromTo(
            ctaCard,
            { scale: 0.94, borderRadius: 34 },
            {
              scale: 1,
              borderRadius: 14,
              ease: "none",
              scrollTrigger: {
                trigger: ctaCard,
                start: "top 98%",
                end: "top 55%",
                scrub: 0.6,
              },
            }
          );
        }

        // Giant footer wordmark rises letter-by-letter
        const bigMark = one(".arv-bigmark");
        if (bigMark) {
          gsap.from(q(".arv-bigmark span"), {
            yPercent: 105,
            ease: "none",
            stagger: 0.04,
            scrollTrigger: {
              trigger: bigMark,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });
        }
      }
    );

    let resizeTimer = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
          })
        : null;
    ro?.observe(root);

    return () => {
      ro?.disconnect();
      window.clearTimeout(resizeTimer);
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="arv-root" id="top" data-sec="top">
      <a href="#main-content" className="arv-skip-link">
        Skip to content
      </a>
      <span ref={sentinelRef} className="arv-sentinel" aria-hidden="true" />

      <Navbar
        scrolled={scrolled}
        onNavigate={onNavigate}
        onSelectDemoCategory={(cat) => setDemoCategory(cat)}
      />

      <main id="main-content">
        {/* Hero */}
        <section className="arv-hero" data-sec="hero">
          <span className="arv-hero-glow" aria-hidden="true" />
          <span className="arv-hero-grid" aria-hidden="true" />

          <div className="arv-wrap arv-hero-head">
            <div className="arv-hero-eyebrow">WEB • AI • CLOUD SYSTEMS</div>
            <h1 className="arv-h1">
              {markedWords(HERO_TITLE).map((w, i, all) => (
                <React.Fragment key={i}>
                  <span className="arv-mask">
                    <span className="arv-hero-word">
                      <span className={w.mark ? "arv-gold" : undefined}>
                        {w.word}
                      </span>
                      {w.tail}
                    </span>
                  </span>
                  {w.br ? <br /> : w.glue || i === all.length - 1 ? null : " "}
                </React.Fragment>
              ))}
            </h1>
            <p className="arv-hero-text arv-hero-fade">
              Arvostra designs, automates, and deploys fast websites, intelligent workflows, and reliable cloud infrastructure.
            </p>
            <div className="arv-hero-ctas arv-hero-fade">
              <a
                className="arv-btn arv-btn-lilac"
                href="#demos"
                onClick={onNavigate("#demos")}
              >
                Explore Live Demos
              </a>
              <a
                className="arv-btn arv-btn-dark"
                href="#inquiry"
                onClick={onNavigate("#inquiry")}
              >
                Request a Build
              </a>
            </div>
          </div>

          <HeroWorkspace
            reduced={reduced}
            onOpenSandbox={handleOpenSandboxById}
            onPrefillInquiry={handlePrefillInquiry}
          />
        </section>

        {/* Studio Philosophy */}
        <EditorialStatement reduced={reduced} />

        {/* Live Demos & Marketplace + Sticky Capabilities Stage */}
        <DemosMarketplace
          activeCategory={demoCategory}
          onCategoryChange={setDemoCategory}
          activeScene={activeScene}
          reduced={reduced}
          onOpenDemo={(demo) => setOpenDemo(demo)}
          onCustomizeDemo={handleCustomizeDemo}
        />

        {/* Core Services */}
        <ServicesSection
          reduced={reduced}
          onSelectService={handleSelectService}
        />

        {/* How It Works */}
        <ProcessSection />

        {/* Founder / About */}
        <FounderSection onNavigate={onNavigate} />

        {/* FAQ */}
        <FaqSection onNavigate={onNavigate} />

        {/* Project Inquiry */}
        <InquirySection prefill={prefill} reduced={reduced} />
      </main>

      <Footer onNavigate={onNavigate} />

      {/* Interactive Demo Sandbox Modal */}
      <DemoSandboxModal
        demo={openDemo}
        onClose={() => setOpenDemo(null)}
        onCustomize={handleCustomizeDemo}
      />
    </div>
  );
}
