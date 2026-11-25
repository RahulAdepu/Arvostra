import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActivePage, Navbar } from "./Navbar";
import { InteractiveDotGrid } from "./InteractiveDotGrid";
import { Footer } from "./Footer";
import { MobileQrModal } from "./MobileQr";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface SubpageShellProps {
  activePage: ActivePage;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}

export function SubpageShell({
  activePage,
  eyebrow,
  title,
  subtitle,
  children,
}: SubpageShellProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLSpanElement | null>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const q = gsap.utils.selector(root);
    const one = (sel: string) => q(sel)[0] as Element | undefined;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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

      const statRules = q(".arv-stat-rule");
      if (statRules.length) {
        gsap.fromTo(
          statRules,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.05,
            ease: "power3.inOut",
            stagger: 0.12,
            scrollTrigger: {
              trigger: one(".arv-stats"),
              start: "top 86%",
              once: true,
            },
          }
        );
      }

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

      const riseEls = q("[data-arv-rise]");
      if (riseEls.length) {
        gsap.set(riseEls, { y: 26, autoAlpha: 0 });
        ScrollTrigger.batch(riseEls, {
          start: "top 92%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }),
        });
      }

      const checks = q(".arv-price-check path");
      if (checks.length) {
        gsap.fromTo(
          checks,
          { strokeDashoffset: 26 },
          {
            strokeDashoffset: 0,
            duration: 0.65,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: one(".arv-price-list"),
              start: "top 84%",
              once: true,
            },
          }
        );
      }

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
    });

    let timer = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
          })
        : null;
    ro?.observe(root);

    return () => {
      ro?.disconnect();
      window.clearTimeout(timer);
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="arv-root" id="top" data-sec="top">
      <InteractiveDotGrid />
      <a href="#main-content" className="arv-skip-link">
        Skip to content
      </a>
      <span ref={sentinelRef} className="arv-sentinel" aria-hidden="true" />

      <Navbar
        activePage={activePage}
        scrolled={scrolled}
        onOpenQr={() => setQrOpen(true)}
      />

      <main id="main-content" className="arv-page-layer">
        <section className="arv-page-banner">
          <div className="arv-wrap">
            <div className="arv-hero-eyebrow">{eyebrow}</div>
            <h1 className="arv-h2 arv-page-banner-title">{title}</h1>
            <p className="arv-sec-sub" style={{ marginTop: 14 }}>
              {subtitle}
            </p>
          </div>
        </section>

        {children}
      </main>

      <Footer onOpenQr={() => setQrOpen(true)} />
      <MobileQrModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}
