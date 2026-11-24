export type DemoCategory =
  | "Website Templates"
  | "AI & Automation"
  | "Business Tools";

export type DemoSandboxId =
  | "salon-template"
  | "shift-calculator"
  | "ai-lead-triage"
  | "ops-dashboard"
  | "saas-launch"
  | "support-workflow";

export interface DemoItem {
  id: string;
  sandboxId: DemoSandboxId;
  name: string;
  category: DemoCategory;
  shortDescription: string;
  features: string[];
  pricing: string;
  badge?: string;
  externalUrl?: string;
  externalLabel?: string;
  art: "salon" | "calculator" | "ai-triage" | "dashboard" | "launch" | "workflow";
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  ctaLabel: string;
  inquiryCategory: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
  icon: "discover" | "plan" | "build" | "launch";
}

export interface FaqItem {
  q: string;
  a: string;
}

export const BRAND = {
  name: "Arvostra",
  domain: "arvostra.com",
  url: "https://arvostra.com",
  demosUrl: "https://demos.arvostra.com",
  founder: "Rahul Adepu",
  location: "Toronto, Canada",
  tagline: "Minimalist Digital Studio & Technology Solutions Marketplace",
  linkedIn: "https://www.linkedin.com/in/Rahul-Adepu-614603151",
  github: "https://github.com/RahulAdepu",
  contactEmail: "rahuladepu99@gmail.com",
};

export const NAV_DEMOS = [
  {
    label: "Website Templates",
    text: "Fast business sites, landing pages, and clean e-commerce foundations.",
    href: "#demos",
    category: "Website Templates" as DemoCategory,
  },
  {
    label: "AI & Automation",
    text: "Working AI assistants, document processing, and support workflows.",
    href: "#demos",
    category: "AI & Automation" as DemoCategory,
  },
  {
    label: "Business Tools",
    text: "Operational calculators, dashboards, and inventory utilities.",
    href: "#demos",
    category: "Business Tools" as DemoCategory,
  },
];

export const STUDIO_PILLARS = [
  {
    value: 4,
    suffix: "",
    label: "Core disciplines: Web, AI, Cloud & Audits",
  },
  {
    value: 100,
    suffix: "%",
    label: "Direct code ownership & clean handover",
  },
  {
    value: 24,
    prefix: "<",
    suffix: "h",
    label: "Direct response from the founder",
  },
];

export const STICKY_SCENES = [
  {
    title: "Production-ready launch foundations",
    text: "Every website and web app ships with semantic HTML, fast page loads, responsive layouts, SEO metadata, analytics readiness, and automated deployment pipelines from day one.",
  },
  {
    title: "Practical AI & workflow automation",
    text: "Connect forms, inboxes, documents, and internal tools to reliable AI workflows. Triage customer inquiries, extract structured data, and cut repetitive manual steps without fragile hacks.",
  },
  {
    title: "Cloud reliability & observability",
    text: "Built by a cloud and DevOps engineer. Clean DNS and domain architecture, containerized or serverless deployments, health visibility, and security hygiene that scales quietly.",
  },
];

export const DEMOS: DemoItem[] = [
  {
    id: "neighborhood-salon-site",
    sandboxId: "salon-template",
    name: "Local Service & Salon Studio",
    category: "Website Templates",
    shortDescription:
      "Warm, conversion-focused local business website modeled on a real Toronto salon build, featuring transparent filterable pricing, live open/closed status, and mobile tap-to-call.",
    features: [
      "Filterable service menu & transparent pricing",
      "Real-time business hours open/closed indicator",
      "Mobile-first sticky booking & call bar",
    ],
    pricing: "Request a Quote",
    badge: "Working Build",
    art: "salon",
  },
  {
    id: "retail-shift-calculator",
    sandboxId: "shift-calculator",
    name: "Retail Inventory & Shift Calculator",
    category: "Business Tools",
    shortDescription:
      "Offline-first operational calculator built for retail shifts, float sheets, and daily sales tracking with instant closing math, error checks, and CSV export.",
    features: [
      "Real-time closing inventory & value calculations",
      "Offline localStorage persistence — zero backend cost",
      "Instant CSV export and printable shift summary",
    ],
    pricing: "Request a Quote",
    badge: "Live External + Sandbox",
    externalUrl: "https://lotto.rahuladepu.info",
    externalLabel: "Open Live App",
    art: "calculator",
  },
  {
    id: "ai-document-lead-triage",
    sandboxId: "ai-lead-triage",
    name: "AI Lead & Document Triage Assistant",
    category: "AI & Automation",
    shortDescription:
      "Interactive intake assistant that parses unstructured client messages, invoices, or requests into clean JSON fields, priority tags, and a draft reply.",
    features: [
      "Structured field extraction from plain text",
      "Urgency classification & routing tags",
      "Ready-to-send response drafting",
    ],
    pricing: "Request a Quote",
    badge: "Interactive Sandbox",
    art: "ai-triage",
  },
  {
    id: "executive-ops-dashboard",
    sandboxId: "ops-dashboard",
    name: "Operations & KPI Control Panel",
    category: "Business Tools",
    shortDescription:
      "Minimalist internal dashboard for tracking revenue run-rate, operational queues, and cost distribution across teams with timeframe filtering.",
    features: [
      "Interactive timeframe & department filtering",
      "Animated SVG trendlines & allocation bars",
      "Clean API-ready component architecture",
    ],
    pricing: "Request a Quote",
    art: "dashboard",
  },
  {
    id: "saas-launch-system",
    sandboxId: "saas-launch",
    name: "Product Launch & Waitlist System",
    category: "Website Templates",
    shortDescription:
      "High-converting SaaS or digital product landing foundation with interactive plan toggle, feature walkthrough, and validated lead capture.",
    features: [
      "Conversion-focused editorial hierarchy",
      "Interactive pricing & billing toggle",
      "SEO metadata, OpenGraph & sitemap ready",
    ],
    pricing: "Request a Quote",
    art: "launch",
  },
  {
    id: "support-automation-flow",
    sandboxId: "support-workflow",
    name: "Customer Support Automation Pipeline",
    category: "AI & Automation",
    shortDescription:
      "Automated ticket classification and routing workflow that detects intent, checks SLA priority, and prepares contextual replies before human handoff.",
    features: [
      "Multi-step trigger-to-response orchestration",
      "Human-in-the-loop escalation rules",
      "Webhook & CRM integration ready",
    ],
    pricing: "Request a Quote",
    art: "workflow",
  },
];

export const CORE_SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Web & Product Engineering",
    description:
      "Custom websites, conversion-focused landing pages, full-stack web applications, and rapid product prototypes engineered for speed and clarity.",
    deliverables: [
      "Responsive Next.js & TypeScript frontends",
      "Full-stack APIs & interactive dashboards",
      "Template customization & rapid launches",
    ],
    ctaLabel: "Discuss a Web Build",
    inquiryCategory: "Website / Landing Page",
  },
  {
    number: "02",
    title: "AI & Workflow Automation",
    description:
      "Practical AI integrations, intelligent assistants, document processing pipelines, and API automations that remove manual bottlenecks.",
    deliverables: [
      "LLM assistants & knowledge retrieval",
      "Document parsing & lead triage pipelines",
      "Webhook, email & internal tool automations",
    ],
    ctaLabel: "Automate a Workflow",
    inquiryCategory: "AI Integration",
  },
  {
    number: "03",
    title: "Cloud & DevOps Infrastructure",
    description:
      "Reliable cloud deployment, DNS and domain configuration, container orchestration, observability, and automated CI/CD pipelines.",
    deliverables: [
      "AWS, Vercel & container deployments",
      "DNS, SSL, subdomains & security hardening",
      "CI/CD pipelines, logging & monitoring",
    ],
    ctaLabel: "Plan Infrastructure",
    inquiryCategory: "Cloud / DevOps",
  },
  {
    number: "04",
    title: "Technical Consulting & Audits",
    description:
      "Actionable performance optimization, codebase and architecture audits, cloud cost reviews, and pragmatic technical planning.",
    deliverables: [
      "Core Web Vitals & speed optimization",
      "Architecture, security & reliability audits",
      "Build-vs-buy & V1 scoping guidance",
    ],
    ctaLabel: "Request an Audit",
    inquiryCategory: "Other",
  },
];

export const INCLUDED_STANDARDS = [
  "Clean, maintainable TypeScript & React source code you fully own",
  "Mobile-first responsive layouts verified across phone, tablet, and desktop",
  "SEO foundations: semantic HTML, metadata, sitemap, robots.txt & fast loading",
  "Deployment setup, environment documentation, and direct founder handover",
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "Understand the business, users, goals, and technical constraints before writing a line of code.",
    deliverable: "Goals & requirements brief",
    icon: "discover",
  },
  {
    step: "02",
    title: "Plan",
    description:
      "Define V1 scope, architecture, milestones, and transparent fixed or milestone pricing.",
    deliverable: "Scope, stack & timeline",
    icon: "plan",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Design, develop, and test the interface, interactions, integrations, and edge cases iteratively.",
    deliverable: "Working staging preview",
    icon: "build",
  },
  {
    step: "04",
    title: "Launch",
    description:
      "Deploy to production, configure domains and SSL, document the system, and hand over cleanly.",
    deliverable: "Live site & handover docs",
    icon: "launch",
  },
];

export const FOUNDER_SKILLS = [
  "Next.js & TypeScript",
  "AI & Workflow Automation",
  "AWS & Cloud Architecture",
  "Docker & Kubernetes",
  "CI/CD & Terraform",
  "Observability & Reliability",
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Should I customize an existing Arvostra demo or request a custom build?",
    a: "If one of our working templates or business tools already matches 70–80% of what you need, customizing it is the fastest and most cost-effective route. For bespoke workflows, custom software, or unique brand experiences, we scope a clean V1 build from scratch.",
  },
  {
    q: "How fast can a V1 website or tool go live?",
    a: "Template customizations and focused landing pages typically ship in 1–2 weeks. Custom web applications, AI workflows, and cloud infrastructure setups typically take 2–6 weeks depending on integrations and scope.",
  },
  {
    q: "Do I own the code, domain, and cloud accounts?",
    a: "Yes — 100%. Everything is deployed to accounts you control with clean Git repositories, documented environment variables, and zero vendor lock-in.",
  },
  {
    q: "How do you keep hosting and recurring costs low?",
    a: "We intentionally avoid overengineering V1. Most marketing sites and lightweight tools run cleanly on Vercel or static edge hosting with minimal serverless functions, keeping monthly infrastructure bills near zero until real traffic demands scaling.",
  },
  {
    q: "Can you integrate AI into our existing website or operations?",
    a: "Yes. We build practical AI integrations — such as lead triage, document extraction, internal knowledge assistants, and automated support routing — connected safely via APIs with clear guardrails and human handoff.",
  },
  {
    q: "What happens after I submit the project inquiry form?",
    a: "Rahul personally reviews your brief and responds directly with clarifying questions (if needed) plus a concise recommendation covering technical approach, timeline, and estimated pricing.",
  },
];

export const SERVICE_OPTIONS = [
  "Website / Landing Page",
  "Custom Web Application",
  "AI Integration",
  "Cloud / DevOps",
  "Automation",
  "Customize a Demo",
  "Other",
] as const;

export const BUDGET_OPTIONS = [
  "Under $500",
  "$500–$2,000",
  "$2,000–$5,000",
  "$5,000+",
  "Not sure yet",
] as const;

export const TIMELINE_OPTIONS = [
  "ASAP",
  "Within 2–4 weeks",
  "Within 1–2 months",
  "Flexible / Exploring",
] as const;
