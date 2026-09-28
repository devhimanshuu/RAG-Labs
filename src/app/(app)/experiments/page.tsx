import type { Metadata } from "next";

import { ExperimentsView } from "@/components/experiments/experiments-view";

export const metadata: Metadata = { title: "Experiments" };

export default function ExperimentsPage() {
  return <ExperimentsView />;
}
