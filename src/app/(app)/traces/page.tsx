import type { Metadata } from "next";

import { TracesView } from "@/components/traces/traces-view";

export const metadata: Metadata = { title: "Traces" };

export default function TracesPage() {
  return <TracesView />;
}
