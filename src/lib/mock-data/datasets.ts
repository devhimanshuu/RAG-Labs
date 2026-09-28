import type { Dataset, DatasetDocument, IndexStatus } from "@/types";

import { ago } from "./clock";

function doc(
  id: string,
  name: string,
  pages: number,
  sizeBytes: number,
  chunks: number,
  status: DatasetDocument["status"] = "indexed",
): DatasetDocument {
  return { id, name, pages, sizeBytes, chunks, status };
}

export const mockDatasets: Dataset[] = [
  {
    id: "ds_finance_reports",
    name: "Finance Reports",
    description:
      "Annual reports, 10-K filings and quarterly earnings decks used for financial QA.",
    documentCount: 24,
    chunkCount: 4284,
    tokenCount: 1_240_000,
    embeddingModel: "text-embedding-3-large",
    embeddingDimensions: 3072,
    indexStatus: "ready",
    updatedAt: ago({ hours: 2 }),
    createdAt: ago({ days: 96 }),
    tags: ["finance", "qa", "production"],
    documents: [
      doc("doc_fr_01", "annual-report-2025.pdf", 184, 8_420_000, 612),
      doc("doc_fr_02", "annual-report-2024.pdf", 176, 8_010_000, 588),
      doc("doc_fr_03", "q3-earnings-deck.pdf", 42, 2_180_000, 168),
      doc("doc_fr_04", "q2-earnings-deck.pdf", 38, 1_970_000, 151),
      doc("doc_fr_05", "10-k-filing-2025.pdf", 226, 11_300_000, 748),
      doc("doc_fr_06", "investor-day-transcript.txt", 64, 410_000, 212),
    ],
  },
  {
    id: "ds_engineering_docs",
    name: "Engineering Docs",
    description:
      "Architecture decision records, service runbooks and internal RFCs across the platform.",
    documentCount: 156,
    chunkCount: 12_940,
    tokenCount: 6_810_000,
    embeddingModel: "text-embedding-3-large",
    embeddingDimensions: 3072,
    indexStatus: "indexing",
    updatedAt: ago({ minutes: 38 }),
    createdAt: ago({ days: 210 }),
    tags: ["internal", "engineering"],
    documents: [
      doc("doc_eng_01", "adr-014-vector-store-choice.md", 6, 42_000, 18),
      doc("doc_eng_02", "runbook-ingestion-pipeline.md", 22, 128_000, 64),
      doc("doc_eng_03", "rfc-multi-tenant-isolation.md", 48, 302_000, 142),
      doc("doc_eng_04", "scaling-postgres-pgvector.md", 17, 96_000, 51),
      doc("doc_eng_05", "oncall-escalation-matrix.md", 9, 38_000, 27),
      doc("doc_eng_06", "embedding-refresh-job.md", 31, 184_000, 88, "processing"),
    ],
  },
  {
    id: "ds_support_tickets",
    name: "Support Tickets",
    description:
      "Resolved support conversations with the resolution notes that closed them.",
    documentCount: 8412,
    chunkCount: 18_220,
    tokenCount: 3_420_000,
    embeddingModel: "text-embedding-3-small",
    embeddingDimensions: 1536,
    indexStatus: "ready",
    updatedAt: ago({ hours: 11 }),
    createdAt: ago({ days: 58 }),
    tags: ["customer", "support", "qa"],
    documents: [
      doc("doc_sup_01", "ticket-batch-2026-08.jsonl", 1, 24_800_000, 4210),
      doc("doc_sup_02", "ticket-batch-2026-07.jsonl", 1, 22_100_000, 3884),
      doc("doc_sup_03", "escalation-playbook.md", 14, 71_000, 39),
      doc("doc_sup_04", "billing-faq.md", 8, 33_000, 22),
      doc("doc_sup_05", "api-troubleshooting.md", 26, 118_000, 74),
    ],
  },
  {
    id: "ds_research_papers",
    name: "Research Papers",
    description:
      "Retrieval and evaluation literature used as ground truth for methodology questions.",
    documentCount: 42,
    chunkCount: 9_180,
    tokenCount: 8_140_000,
    embeddingModel: "text-embedding-3-large",
    embeddingDimensions: 3072,
    indexStatus: "stale",
    updatedAt: ago({ days: 6, hours: 4 }),
    createdAt: ago({ days: 142 }),
    tags: ["research", "papers"],
    documents: [
      doc("doc_rs_01", "ragas-faithfulness-metrics.pdf", 34, 2_140_000, 168),
      doc("doc_rs_02", "corrective-rag-crag.pdf", 21, 1_320_000, 104),
      doc("doc_rs_03", "hyde-hypothetical-documents.pdf", 12, 780_000, 58),
      doc("doc_rs_04", "reciprocal-rank-fusion.pdf", 9, 540_000, 41),
      doc("doc_rs_05", "dense-passage-retrieval.pdf", 16, 910_000, 76),
    ],
  },
  {
    id: "ds_product_manuals",
    name: "Product Manuals",
    description:
      "Customer-facing installation, configuration and troubleshooting documentation.",
    documentCount: 68,
    chunkCount: 2640,
    tokenCount: 890_000,
    embeddingModel: "text-embedding-3-small",
    embeddingDimensions: 1536,
    indexStatus: "ready",
    updatedAt: ago({ days: 1, hours: 3 }),
    createdAt: ago({ days: 74 }),
    tags: ["customer", "docs"],
    documents: [
      doc("doc_pm_01", "install-guide-v4.pdf", 32, 1_240_000, 118),
      doc("doc_pm_02", "config-reference-v4.pdf", 58, 2_010_000, 204),
      doc("doc_pm_03", "troubleshooting-v4.pdf", 44, 1_680_000, 156),
      doc("doc_pm_04", "release-notes-4.2.md", 11, 44_000, 32),
    ],
  },
  {
    id: "ds_legal_contracts",
    name: "Legal Contracts",
    description: "Master service agreements and DPAs with clause-level retrieval enabled.",
    documentCount: 31,
    chunkCount: 5120,
    tokenCount: 4_180_000,
    embeddingModel: "text-embedding-3-large",
    embeddingDimensions: 3072,
    indexStatus: "failed",
    updatedAt: ago({ days: 3, hours: 8 }),
    createdAt: ago({ days: 188 }),
    tags: ["legal", "restricted"],
    documents: [
      doc("doc_lg_01", "msa-acme-corp-2026.pdf", 24, 1_480_000, 132),
      doc("doc_lg_02", "dpa-standard-template.pdf", 18, 1_040_000, 96),
      doc("doc_lg_03", "vendor-terms-v3.pdf", 41, 2_260_000, 208, "failed"),
      doc("doc_lg_04", "sla-enterprise.pdf", 12, 620_000, 58),
    ],
  },
];

export function getDatasetById(id: string): Dataset | undefined {
  return mockDatasets.find((dataset) => dataset.id === id);
}

export const DATASET_INDEX_STATUS_LABELS: Record<IndexStatus, string> = {
  ready: "Ready",
  indexing: "Indexing",
  stale: "Stale",
  failed: "Failed",
};
