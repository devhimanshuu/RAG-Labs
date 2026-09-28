import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/brand-icons";
import { APP_VERSION } from "@/lib/constants/app";
import { footerColumns, repoUrl } from "@/lib/mock-data/landing";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-inset">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-xs text-xs leading-relaxed text-fg-muted">
              The laboratory for RAG engineering. Experiment, inspect, compare and
              benchmark modern Retrieval-Augmented Generation systems.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" asChild>
                <a href={repoUrl} target="_blank" rel="noreferrer">
                  <GithubIcon />
                  Star on GitHub
                </a>
              </Button>
              <span className="technical text-2xs text-fg-disabled">v{APP_VERSION}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <nav key={column.id} aria-label={column.label} className="flex flex-col gap-2.5">
                <h3 className="technical text-2xs uppercase tracking-[0.16em] text-fg-muted">
                  {column.label}
                </h3>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-fg-secondary transition-colors hover:text-accent focus-ring rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="technical text-2xs text-fg-disabled">
            © 2026 RAGLab — built for people who want to know why the system works.
          </p>
          <p className="technical text-2xs text-fg-disabled">
            All metrics on this page are illustrative sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
