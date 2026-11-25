import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CORE_SERVICES,
  DemoItem,
  DEMOS,
  DemoSandboxId,
} from "@/lib/data";
import { markedWords, useReducedMotion } from "@/lib/hooks";
import { Navbar } from "./Navbar";
import { InteractiveDotGrid } from "./InteractiveDotGrid";
import { HeroWorkspace } from "./HeroWorkspace";
import { DemoSandboxModal } from "./DemoSandboxModal";
import { InquiryPrefill, InquirySection } from "./InquirySection";
import { Footer } from "./Footer";
import { MobileQrModal } from "./MobileQr";
import { Icon, ICONS, MarkedText } from "./Icons";
import { DemoThumbnail } from "./DemosMarketplace";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const HERO_TITLE = "Practical *software* and *AI*\nsystems built for modern businesses.";

// Top 3 flagship demos (1 Website Template, 1 Business Tool, 1 AI Workflow)
const FEATURED_DEMOS = DEMOS.slice(0, 3);

export function ArvostraLanding() {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const sentinelRef = React.useRef<HTMLSpanElement | null>(null);

  const [scrolled, setScrolled] = React.useState(false);
  const [openDemo, setOpenDemo] = React.useState<DemoItem | null>(null);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [prefill, setPrefill] = React.useState<InquiryPrefill>({ signal: 0 });

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

  // Support cross-page prefill from ./demos.html or ./services.html (?service=...&demo=...&note=...)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");
    const demo = params.get("demo");
    const note = params.get("note");
    if (service || demo || note) {
      setPrefill((prev) => ({
        serviceCategory: service || (demo ? "Customize a Demo" : undefined),
        selectedDemo: demo || undefined,
        description:
          note ||
          (demo
            ? `I'd like to customize the "${demo}" solution for my business.`
            : undefined),
        signal: prev.signal + 1,
      }));
      setTimeout(() => scrollToSection("inquiry"), 120);
    }
  }, [scrollToSection]);

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

  // GSAP ScrollTrigger choreography for the lean homepage
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
            { y: 100, autoAlpha: 0, duration: 1.1 },
            "-=0.7"
          )
          .from(
            q(".arv-float"),
            { x: 52, autoAlpha: 0, duration: 0.95, stagger: 0.14 },
            "-=0.82"
          );

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

        if (wide) {
          q(".arv-float-in").forEach((el, i) =>
            gsap.to(el, {
              y: -58 - i * 48,
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

        const ctaCard = one(".arv-cta");
        if (ctaCard) {
          gsap.fromTo(
            ctaCard,
            { scale: 0.95, borderRadius: 30 },
            {
              scale: 1,
              borderRadius: 14,
              ease: "none",
              scrollTrigger: {
                trigger: ctaCard,
                start: "top 98%",
                end: "top 58%",
                scrub: 0.6,
              },
            }
          );
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
      <InteractiveDotGrid />
      <a href="#main-content" className="arv-skip-link">
        Skip to content
      </a>
      <span ref={sentinelRef} className="arv-sentinel" aria-hidden="true" />

      <Navbar
        activePage="home"
        scrolled={scrolled}
        onNavigate={onNavigate}
        onOpenQr={() => setQrOpen(true)}
      />

      <main id="main-content" className="arv-page-layer">
        {/* 1. Hero + Interactive Studio Console */}
        <section className="arv-hero" data-sec="hero">
          <span className="arv-hero-glow" aria-hidden="true" />

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
              <a className="arv-btn arv-btn-lilac" href="./demos.html">
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

        {/* 2. Featured Live Demos Snapshot (Top 3 + Link to Full Demos Page) */}
        <section className="arv-sec arv-home-demos" id="demos" data-sec="demos">
          <div className="arv-wrap">
            <div className="arv-demos-head">
              <div>
                <div className="arv-label" style={{ marginBottom: 14 }}>
                  Featured Solutions
                </div>
                <h2 className="arv-h2" data-arv-rise="">
                  <MarkedText text="Built &amp; *Ready to Deploy*." />
                </h2>
                <p className="arv-sec-sub" data-arv-rise="" style={{ marginTop: 12 }}>
                  Test working prototypes directly in your browser or request a tailored version for your business.
                </p>
              </div>
              <a
                href="./demos.html"
                className="arv-btn arv-btn-ghost arv-btn-sm"
                data-arv-rise=""
              >
                Explore all {DEMOS.length} demos
                <Icon d={ICONS.arrow} size={14} />
              </a>
            </div>

            <div className="arv-demo-grid">
              {FEATURED_DEMOS.map((demo) => (
                <article
                  key={demo.id}
                  className="arv-demo-card"
                  data-arv-rise=""
                >
                  <div className="arv-demo-thumb">
                    <DemoThumbnail art={demo.art} />
                    <span className="arv-demo-cat">{demo.category}</span>
                    {demo.badge ? (
                      <span className="arv-demo-badge">{demo.badge}</span>
                    ) : null}
                  </div>
                  <div className="arv-demo-body">
                    <h3 className="arv-h3">{demo.name}</h3>
                    <p className="arv-demo-desc">{demo.shortDescription}</p>
                    <div className="arv-demo-meta">
                      <span className="arv-demo-price">{demo.pricing}</span>
                    </div>
                    <div className="arv-demo-actions">
                      <button
                        type="button"
                        className="arv-btn arv-btn-dark arv-btn-sm"
                        onClick={() => setOpenDemo(demo)}
                      >
                        <Icon d={ICONS.play} size={12} />
                        Live Demo
                      </button>
                      <button
                        type="button"
                        className="arv-btn arv-btn-ghost arv-btn-sm"
                        onClick={() => handleCustomizeDemo(demo)}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Concise Core Services Snapshot (Links to Full Services & Process Page) */}
        <section className="arv-sec arv-price arv-home-services" id="services" data-sec="services">
          <span className="arv-price-glow" aria-hidden="true" />
          <div className="arv-wrap">
            <div className="arv-demos-head" style={{ marginBottom: 36 }}>
              <div>
                <div className="arv-label" style={{ marginBottom: 14 }}>
                  Core Services
                </div>
                <h2 className="arv-h2 arv-deep-title" data-arv-rise="">
                  <MarkedText text="Four focused disciplines, *built end-to-end*" />
                </h2>
              </div>
              <a
                href="./services.html"
                className="arv-link-arrow"
                data-arv-rise=""
              >
                Process, deliverables &amp; timelines
                <Icon d={ICONS.arrow} size={15} />
              </a>
            </div>

            <div className="arv-services-grid arv-services-compact">
              {CORE_SERVICES.map((svc) => (
                <article
                  key={svc.number}
                  className="arv-service-card arv-service-card-compact"
                  data-arv-rise=""
                >
                  <div className="arv-service-num">{svc.number}</div>
                  <h3 className="arv-service-title">{svc.title}</h3>
                  <p className="arv-service-desc">{svc.description}</p>
                  <button
                    type="button"
                    className="arv-service-cta"
                    onClick={() =>
                      handlePrefillInquiry({
                        serviceCategory: svc.inquiryCategory,
                        description: `Interested in ${svc.title}. Here is what I am building: `,
                      })
                    }
                  >
                    {svc.ctaLabel}
                    <Icon d={ICONS.arrow} size={14} />
                  </button>
                </article>
              ))}
            </div>

            <div className="arv-home-about-strip" data-arv-rise="">
              <span>
                Founded &amp; engineered directly by <b>Rahul Adepu</b> in Toronto — zero agency handoffs, 100% code ownership.
              </span>
              <a href="./about.html" className="arv-link-arrow">
                Meet the founder &amp; FAQ
                <Icon d={ICONS.arrow} size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* 4. Project Inquiry */}
        <InquirySection prefill={prefill} reduced={reduced} />
      </main>

      <Footer onNavigate={onNavigate} onOpenQr={() => setQrOpen(true)} />

      {/* Interactive Demo Sandbox Modal */}
      <DemoSandboxModal
        demo={openDemo}
        onClose={() => setOpenDemo(null)}
        onCustomize={handleCustomizeDemo}
      />

      {/* Mobile QR Code Modal */}
      <MobileQrModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}
