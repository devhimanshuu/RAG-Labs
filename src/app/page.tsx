import type { Metadata } from "next";

import { DeveloperSection } from "@/components/landing/developer-section";
import { EvaluationShowcase } from "@/components/landing/evaluation-showcase";
import { ExperimentShowcase } from "@/components/landing/experiment-showcase";
import { FeatureSection } from "@/components/landing/feature-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { PipelineShowcase } from "@/components/landing/pipeline-showcase";
import { RAGConcept } from "@/components/landing/rag-concept";
import { RAGArena } from "@/components/landing/rag-arena";
import { RetrievalInspector } from "@/components/landing/retrieval-inspector";
import { TechniqueExplorer } from "@/components/landing/technique-explorer";
import { APP_NAME } from "@/lib/constants/app";
import { repoUrl } from "@/lib/mock-data/landing";

/** Canonical origin, overridable per deployment. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raglab.dev";

const TITLE = `${APP_NAME} — The Laboratory for RAG Engineering`;
const DESCRIPTION =
  "Experiment, inspect, compare and benchmark modern Retrieval-Augmented Generation systems. Swap retrievers, rerankers and reasoning strategies, then measure quality, latency and cost on the same dataset.";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's `%s · RAGLabs` template: the landing
  // page is the brand surface, not a sub-page.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  applicationName: APP_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  keywords: [
    "RAG",
    "retrieval-augmented generation",
    "RAG evaluation",
    "hybrid retrieval",
    "reranking",
    "HyDE",
    "CRAG",
    "agentic RAG",
    "LLM observability",
    "RAG benchmark",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: APP_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

/** Rich result describing the product itself. */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: APP_NAME,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  url: SITE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  sameAs: [repoUrl],
};

export default function LandingPage() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:border focus:border-accent-line focus:bg-surface-elevated focus:px-3 focus:py-2 focus:text-xs focus:text-fg focus:ring-0"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="content">
        <Hero />
        <RAGConcept />
        <TechniqueExplorer />
        <RetrievalInspector />
        <RAGArena />
        <ExperimentShowcase />
        <PipelineShowcase />
        <EvaluationShowcase />
        <FeatureSection />
        <DeveloperSection />
        <FinalCTA />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        // Static, self-authored payload — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
