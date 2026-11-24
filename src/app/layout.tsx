import type { Metadata, Viewport } from "next";
import { BRAND } from "@/lib/data";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || BRAND.url;

export const viewport: Viewport = {
  themeColor: "#f5f4ee",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arvostra — Practical Software, AI & Cloud Systems",
    template: "%s | Arvostra",
  },
  description:
    "Arvostra is a minimalist digital studio & technology solutions marketplace founded by Rahul Adepu. Fast websites, AI workflow automation, cloud infrastructure, and ready-to-deploy demos.",
  keywords: [
    "Arvostra",
    "Rahul Adepu",
    "Digital Studio",
    "Web Development",
    "AI Workflow Automation",
    "Cloud Infrastructure",
    "DevOps Consulting",
    "Website Templates",
    "Toronto Software Studio",
  ],
  authors: [{ name: BRAND.founder, url: BRAND.url }],
  creator: BRAND.founder,
  publisher: BRAND.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: BRAND.name,
    title: "Arvostra — Practical Software, AI & Cloud Systems",
    description:
      "Minimalist digital studio & technology solutions marketplace. Explore live demos, customizable templates, AI integrations, and reliable cloud engineering.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arvostra — Practical Software, AI & Cloud Systems",
    description:
      "Fast websites, intelligent workflows, ready-to-deploy demos, and reliable cloud infrastructure.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: BRAND.name,
      url: siteUrl,
      description: BRAND.tagline,
      founder: {
        "@type": "Person",
        name: BRAND.founder,
        email: `mailto:${BRAND.contactEmail}`,
        sameAs: [BRAND.linkedIn, BRAND.github],
      },
      email: `mailto:${BRAND.contactEmail}`,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND.name,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("arvostra_theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"#0a1b1e":"#f5f4ee");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
