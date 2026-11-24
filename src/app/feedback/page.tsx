import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/data";
import { ArvostraMark, Icon, ICONS } from "@/components/Icons";
import { FeedbackSection } from "@/components/FeedbackSection";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Report a Bug or Suggestion",
  description:
    "Report a bug, broken link, or suggest a new demo or feature for Arvostra. Anonymous-friendly, privacy-conscious, and reviewed directly by Rahul Adepu.",
  alternates: {
    canonical: "/feedback/",
  },
};

export default function FeedbackPage() {
  return (
    <div className="arv-root arv-subpage">
      <header className="arv-404-nav">
        <div className="arv-wrap arv-404-nav-in">
          <Link href="/" className="arv-brand" aria-label="Arvostra Home">
            <ArvostraMark size={24} />
            <span>{BRAND.name}</span>
          </Link>
          <div className="arv-row">
            <ThemeToggle />
            <Link href="/" className="arv-btn arv-btn-ghost arv-btn-sm">
              ← Back to Arvostra
            </Link>
          </div>
        </div>
      </header>

      <main className="arv-subpage-main">
        <FeedbackSection standalone />
      </main>

      <footer className="arv-subpage-foot">
        <div className="arv-wrap arv-subpage-foot-in">
          <span>
            © {new Date().getFullYear()} {BRAND.name} · Founded by{" "}
            {BRAND.founder}
          </span>
          <div className="arv-row" style={{ gap: 16 }}>
            <Link href="/#demos" className="arv-link">
              Live Demos
            </Link>
            <Link href="/#inquiry" className="arv-link">
              Start a Project
            </Link>
            <a href={`mailto:${BRAND.contactEmail}`} className="arv-link">
              {BRAND.contactEmail}
              <Icon
                d={ICONS.arrowUpRight}
                size={12}
                className="arv-inline-ic"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
