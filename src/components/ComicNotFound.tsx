"use client";

import * as React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/data";
import { ArvostraMark, Icon, ICONS } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

const COMIC_PUNCHLINES = [
  {
    bot: "Checked AWS, checked the edge CDN, even checked the cloud shipping box — this route isn't in there.",
    founder: "Relax. If it doesn't exist yet, we can probably build it.",
  },
  {
    bot: "Good news: zero bugs found on this page. Bad news: zero page found either.",
    founder: "Technically that's 100% reliability on nothing.",
  },
  {
    bot: "I asked the AI where this URL went. It wrote a very confident essay about a page that doesn't exist.",
    founder: "This is why we validate outputs, buddy.",
  },
  {
    bot: "DNS resolved. SSL is green. The page just wandered off before deployment.",
    founder: "Send them over to the live demos while we look.",
  },
  {
    bot: "Wait — could this missing URL actually be their next custom build?",
    founder: "Only one way to find out.",
  },
];

function getBasePath(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
  return raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";
}

export function ComicNotFound() {
  const [stripIdx, setStripIdx] = React.useState(0);
  const [missingPath, setMissingPath] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setMissingPath(window.location.pathname || "/404");
    }
  }, []);

  const line = COMIC_PUNCHLINES[stripIdx];
  const imgSrc = `${getBasePath()}/comic-404.jpg`;

  return (
    <div className="arv-root arv-404-page">
      <span className="arv-hero-grid" aria-hidden="true" />

      <header className="arv-404-nav">
        <div className="arv-wrap arv-404-nav-in">
          <Link href="/" className="arv-brand" aria-label="Arvostra Home">
            <ArvostraMark size={24} />
            <span>{BRAND.name}</span>
          </Link>
          <div className="arv-row" style={{ gap: 14 }}>
            <span className="arv-404-issue">ISSUE #404 · ROUTE NOT FOUND</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="arv-wrap arv-404-main">
        <div className="arv-404-head">
          <div className="arv-hero-eyebrow">HTTP 404 • MISSING BLUEPRINT</div>
          <h1 className="arv-h2 arv-404-title">
            Looks like we haven&apos;t <span className="arv-gold">built</span>{" "}
            this page yet.
          </h1>
          <p className="arv-404-sub">
            Our studio assistant checked the cloud box twice. The link may have
            moved, or you&apos;ve discovered a route waiting for a V1 build.
          </p>
        </div>

        <figure className="arv-comic-frame">
          <div className="arv-comic-topbar">
            <span className="arv-comic-narration">
              MEANWHILE, INSIDE THE ARVOSTRA STUDIO…
            </span>
            <code className="arv-comic-path" title={missingPath || "/404"}>
              GET {missingPath || "/404"} → 404
            </code>
          </div>

          <div className="arv-comic-art-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt="Editorial comic illustration showing a calm Arvostra developer with coffee watching a small puzzled geometric robot inspect an open cloud shipping box with a magnifying glass beside a 404 blueprint easel."
              className="arv-comic-img"
              width={1408}
              height={768}
              loading="eager"
            />
          </div>

          <figcaption className="arv-comic-caption" aria-live="polite">
            <div className="arv-comic-dialogue">
              <p>
                <span className="arv-comic-speaker">AI Assistant:</span>{" "}
                &ldquo;{line.bot}&rdquo;
              </p>
              <p>
                <span className="arv-comic-speaker arv-comic-speaker-gold">
                  Founder:
                </span>{" "}
                &ldquo;{line.founder}&rdquo;
              </p>
            </div>
            <button
              type="button"
              className="arv-btn arv-btn-ghost arv-btn-sm arv-comic-reroll"
              onClick={() =>
                setStripIdx((i) => (i + 1) % COMIC_PUNCHLINES.length)
              }
            >
              Next caption ({stripIdx + 1}/{COMIC_PUNCHLINES.length})
            </button>
          </figcaption>
        </figure>

        <div className="arv-404-actions">
          <Link href="/" className="arv-btn arv-btn-dark">
            Back to Arvostra
          </Link>
          <Link href="/#demos" className="arv-btn arv-btn-lilac">
            Explore Live Demos
          </Link>
          <Link href="/#inquiry" className="arv-btn arv-btn-ghost">
            Want us to build this page?
            <Icon d={ICONS.arrow} size={15} />
          </Link>
        </div>

        <p className="arv-fine" style={{ marginTop: 18 }}>
          Think this link shouldn&apos;t be broken?{" "}
          <Link
            href={`/feedback/?feedback=404&from=${encodeURIComponent(
              missingPath || "/404"
            )}`}
            className="arv-link"
          >
            Report this broken link →
          </Link>
        </p>
      </main>
    </div>
  );
}
