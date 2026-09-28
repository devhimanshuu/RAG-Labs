import type { RetrievalResult } from "@/types";

/**
 * Chunks returned for the demo queries. Scores are chosen so the reranked order
 * visibly differs from the raw dense order — that contrast is the whole point of
 * the retrieval inspector.
 */
export const mockRetrievalResults: RetrievalResult[] = [
  {
    id: "chunk_8fa21_01",
    rank: 1,
    score: 0.942,
    rerankScore: 0.942,
    denseScore: 0.891,
    sparseScore: 0.774,
    kept: true,
    tokens: 412,
    page: 47,
    documentName: "annual-report-2025.pdf",
    chunkId: "ch_7f3a91c4",
    content:
      "Revenue increased primarily due to the expansion of the enterprise segment, which grew 34% year over year to $412.6M. Growth was driven by a 22% increase in average contract value and the addition of 184 net-new enterprise customers. Management attributed the acceleration to the general availability of the platform's retrieval module in the second quarter, which shortened enterprise evaluation cycles from eleven weeks to just under four.",
  },
  {
    id: "chunk_8fa21_02",
    rank: 2,
    score: 0.908,
    rerankScore: 0.908,
    denseScore: 0.874,
    sparseScore: 0.712,
    kept: true,
    tokens: 358,
    page: 49,
    documentName: "annual-report-2025.pdf",
    chunkId: "ch_2b81de07",
    content:
      "Subscription revenue of $356.2M accounted for 86% of total revenue, up from 79% in the prior year. The shift reflects both new enterprise bookings and the migration of existing usage-based customers onto committed annual contracts. Professional services revenue declined 6% as implementation work was increasingly handled by partner integrators.",
  },
  {
    id: "chunk_8fa21_03",
    rank: 3,
    score: 0.871,
    rerankScore: 0.871,
    denseScore: 0.902,
    sparseScore: 0.634,
    kept: true,
    tokens: 296,
    page: 12,
    documentName: "annual-report-2025.pdf",
    chunkId: "ch_4c9a1b75",
    content:
      "North America contributed $238.4M of revenue (+28%), EMEA $104.9M (+31%) and APAC $69.3M (+47%). The APAC result includes a one-time $8.1M adjustment related to the early renewal of two sovereign cloud contracts, without which APAC growth was 32%.",
  },
  {
    id: "chunk_8fa21_04",
    rank: 4,
    score: 0.844,
    rerankScore: 0.844,
    denseScore: 0.918,
    sparseScore: 0.418,
    kept: true,
    tokens: 331,
    page: 4,
    documentName: "q3-earnings-deck.pdf",
    chunkId: "ch_9e02f6a3",
    content:
      "Q3 net revenue retention was 121%, marking the fifth consecutive quarter above 120%. Gross margin expanded 340 basis points to 78.2% as inference costs per active workload declined following the migration to a mixed-GPU serving fleet.",
  },
  {
    id: "chunk_8fa21_05",
    rank: 5,
    score: 0.612,
    rerankScore: 0.612,
    denseScore: 0.803,
    sparseScore: 0.529,
    kept: false,
    tokens: 274,
    page: 61,
    documentName: "annual-report-2025.pdf",
    chunkId: "ch_1d4c88ef",
    content:
      "Operating expenses totalled $344.1M, of which research and development represented $151.8M (+19%). The increase reflects headcount growth in the retrieval systems organisation and the capitalisation of $12.4M of internal-use software.",
  },
  {
    id: "chunk_8fa21_06",
    rank: 6,
    score: 0.548,
    rerankScore: 0.548,
    denseScore: 0.788,
    sparseScore: 0.884,
    kept: false,
    tokens: 402,
    page: 88,
    documentName: "10-k-filing-2025.pdf",
    chunkId: "ch_6a71b0d2",
    content:
      "Risk factors include concentration of revenue in the ten largest customers, which represented 18% of total revenue, and exposure to changes in foreign exchange rates. The company hedges a portion of forecast EMEA receipts but does not hedge APAC balances.",
  },
];

/** Engineering Docs corpus — used by traces and replayed pipeline runs. */
export const mockEngineeringRetrievalResults: RetrievalResult[] = [
  {
    id: "chunk_7d1e_01",
    rank: 1,
    score: 0.927,
    rerankScore: 0.927,
    denseScore: 0.862,
    sparseScore: 0.741,
    kept: true,
    tokens: 328,
    page: 17,
    documentName: "scaling-postgres-pgvector.md",
    chunkId: "ch_a8103f2e",
    content:
      "The migration replaced the single HNSW index with partitioned ivfflat indexes per embedding dimension. Queries above the 95th percentile latency dropped from 412ms to 118ms. The trade-off is recall: at lists=200 we measured recall@10 of 0.94 against the old 0.97, recovered by raising probes from 1 to 6 at query time.",
  },
  {
    id: "chunk_7d1e_02",
    rank: 2,
    score: 0.884,
    rerankScore: 0.884,
    denseScore: 0.829,
    sparseScore: 0.662,
    kept: true,
    tokens: 291,
    page: 6,
    documentName: "adr-014-vector-store-choice.md",
    chunkId: "ch_c40931ba",
    content:
      "We chose pgvector over a dedicated vector database so retrieval joins stay transactional with document metadata. The ADR records the accepted cost: index rebuilds are online but memory-resident, and we cap the hot partition at 20M vectors before scheduling a re-shard.",
  },
  {
    id: "chunk_7d1e_03",
    rank: 3,
    score: 0.801,
    rerankScore: 0.801,
    denseScore: 0.845,
    sparseScore: 0.512,
    kept: false,
    tokens: 244,
    page: 22,
    documentName: "runbook-ingestion-pipeline.md",
    chunkId: "ch_f52c7708",
    content:
      "Ingestion lag is measured as the delta between the newest object mtime in the landing bucket and the newest committed chunk. Alert at 15 minutes, page at 60 minutes. Most lag events trace back to a congested embedding worker pool rather than object-store throttling.",
  },
];

/** Support Tickets corpus. */
export const mockSupportRetrievalResults: RetrievalResult[] = [
  {
    id: "chunk_3c04_01",
    rank: 1,
    score: 0.918,
    rerankScore: 0.918,
    denseScore: 0.871,
    sparseScore: 0.694,
    kept: true,
    tokens: 236,
    page: 8,
    documentName: "api-troubleshooting.md",
    chunkId: "ch_1a55ce90",
    content:
      "To rotate an API key open Settings, Providers, then select the provider row and choose Rotate. The previous key continues to authenticate for a 24 hour grace period so deployments can roll without downtime. Keys are scoped per environment; a production key cannot be used against the sandbox host.",
  },
  {
    id: "chunk_3c04_02",
    rank: 2,
    score: 0.842,
    rerankScore: 0.842,
    denseScore: 0.788,
    sparseScore: 0.603,
    kept: true,
    tokens: 198,
    page: 3,
    documentName: "billing-faq.md",
    chunkId: "ch_7b0e2d41",
    content:
      "Annual plans can be refunded pro-rata within 30 days of renewal if usage for the period is below 10% of committed units. Requests outside this window are credited to the following term instead of refunded.",
  },
  {
    id: "chunk_3c04_03",
    rank: 3,
    score: 0.766,
    rerankScore: 0.766,
    denseScore: 0.812,
    sparseScore: 0.447,
    kept: false,
    tokens: 262,
    page: 11,
    documentName: "escalation-playbook.md",
    chunkId: "ch_9cd412f7",
    content:
      "Tier 2 escalations require a reproduction, the affected tenant id and the first occurrence timestamp. Escalate immediately when a customer reports data loss, cross-tenant visibility, or a sustained error rate above 5% for more than ten minutes.",
  },
];

/** Research Papers corpus. */
export const mockResearchRetrievalResults: RetrievalResult[] = [
  {
    id: "chunk_6b77_01",
    rank: 1,
    score: 0.935,
    rerankScore: 0.935,
    denseScore: 0.884,
    sparseScore: 0.719,
    kept: true,
    tokens: 311,
    page: 4,
    documentName: "reciprocal-rank-fusion.pdf",
    chunkId: "ch_2e8104dc",
    content:
      "Reciprocal rank fusion scores each document as the sum over retrievers of 1/(k + rank), with k conventionally set to 60. RRF requires no score normalisation, which is its principal advantage over weighted-sum fusion when combining dense cosine similarity with BM25.",
  },
  {
    id: "chunk_6b77_02",
    rank: 2,
    score: 0.879,
    rerankScore: 0.879,
    denseScore: 0.841,
    sparseScore: 0.638,
    kept: true,
    tokens: 268,
    page: 2,
    documentName: "hyde-hypothetical-documents.pdf",
    chunkId: "ch_5f60ba13",
    content:
      "HyDE prompts a model to generate a hypothetical document that would answer the query, then embeds that document instead of the query itself. Reported gains are largest for short, underspecified queries where the raw embedding carries little lexical signal.",
  },
  {
    id: "chunk_6b77_03",
    rank: 3,
    score: 0.802,
    rerankScore: 0.802,
    denseScore: 0.796,
    sparseScore: 0.521,
    kept: false,
    tokens: 289,
    page: 7,
    documentName: "corrective-rag-crag.pdf",
    chunkId: "ch_8a37f2e5",
    content:
      "CRAG introduces a lightweight retrieval evaluator that labels each retrieved passage as correct, ambiguous or incorrect, then triggers knowledge refinement or web search accordingly. The evaluator is trained on query-passage pairs rather than end-task labels.",
  },
];

/** Wider candidate pool, used by the trace inspector to show what was discarded. */
export const mockCandidateChunks: RetrievalResult[] = [
  ...mockRetrievalResults,
  {
    id: "chunk_cand_07",
    rank: 7,
    score: 0.512,
    denseScore: 0.742,
    sparseScore: 0.301,
    kept: false,
    tokens: 188,
    page: 33,
    documentName: "annual-report-2024.pdf",
    chunkId: "ch_0b12aa44",
    content:
      "In the prior fiscal year revenue grew 19% to $308.9M. Segment reporting was reorganised in the fourth quarter, so comparative figures are presented on a like-for-like basis.",
  },
  {
    id: "chunk_cand_08",
    rank: 8,
    score: 0.487,
    denseScore: 0.719,
    sparseScore: 0.264,
    kept: false,
    tokens: 219,
    page: 19,
    documentName: "q2-earnings-deck.pdf",
    chunkId: "ch_3f9db210",
    content:
      "Bookings grew 41% while remaining performance obligations reached $1.02B. The average sales cycle for enterprise deployments fell to 68 days from 81 days.",
  },
];

export const DEFAULT_PLAYGROUND_ANSWER = `Revenue for fiscal 2025 increased to $414.2M, up 34% year over year, driven primarily by enterprise segment expansion.

The three factors cited in the filings:

1. **Enterprise segment growth** — the enterprise segment grew 34% to $412.6M, supported by a 22% increase in average contract value and 184 net-new enterprise customers [annual-report-2025.pdf, p.47].
2. **Mix shift to subscriptions** — subscription revenue reached $356.2M (86% of total, up from 79%), reflecting migration of usage-based customers onto committed annual contracts [annual-report-2025.pdf, p.49].
3. **Geographic expansion** — APAC grew fastest at 47%, though $8.1M of that was a one-time early-renewal adjustment; on a like-for-like basis APAC grew 32% [annual-report-2025.pdf, p.12].

Net revenue retention of 121% and 340bp of gross-margin expansion indicate the growth was not purely acquisition-led.

Two caveats worth flagging: revenue concentration remains meaningful (the ten largest customers were 18% of total revenue), and the APAC adjustment means reported growth overstates underlying momentum by roughly 1.4 points.`;

export const DEMO_QUERY = "Why did revenue increase in 2025?";
