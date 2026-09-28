import { Check } from "lucide-react";

import { Section, SectionHeader } from "@/components/landing/section";
import { CodeBlock } from "@/components/ui/code-block";
import { developerPoints, developerSnippet } from "@/lib/mock-data/landing";

/**
 * Developer positioning.
 *
 * The differentiator from a consumer "chat with your PDF" product is that
 * everything stays addressable — so this section pairs the claims with the
 * config file that backs them up.
 */
export function DeveloperSection() {
  return (
    <Section id="developers" width="wide">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* min-w-0 keeps the YAML line from widening the whole grid on small screens. */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <SectionHeader
            eyebrow="For engineers"
            title="Built for people who want to know why the system works."
            description="A working answer you cannot explain is not a working system. RAGLabs keeps every retrieval step, every score and every model call addressable."
          />

          <ul className="mt-8 flex flex-col gap-3.5">
            {developerPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-muted">
                  <Check className="size-2.5 text-accent" aria-hidden />
                </span>
                <span className="text-sm leading-relaxed text-fg-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <CodeBlock
            code={developerSnippet}
            title="raglab.yaml"
            language="yaml"
            lineNumbers
            maxHeight="26rem"
          />
          <p className="text-xs leading-relaxed text-fg-muted">
            The canvas and the config file describe the same pipeline, so an
            experiment created in the UI can be exported, reviewed in a pull request
            and rerun in CI with the identical configuration.
          </p>
        </div>
      </div>
    </Section>
  );
}
