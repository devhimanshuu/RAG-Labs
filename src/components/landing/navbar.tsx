"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/brand-icons";
import { repoUrl, landingNav } from "@/lib/mock-data/landing";
import { cn } from "@/lib/utils";

/**
 * Marketing navbar.
 *
 * Transparent over the hero and frosted once scrolled, so the hero art is not
 * boxed in by a chrome bar. The mobile menu is a disclosure (not a modal), which
 * keeps focus handling simple and correct.
 */
export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled || menuOpen
          ? "border-b border-line bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-5 px-5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-sm focus-ring"
          aria-label="RAGLabs home"
        >
          <Logo />
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-0.5 md:flex">
          {landingNav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="rounded-sm px-2.5 py-1.5 text-xs text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg focus-ring"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg focus-ring"
          >
            <GithubIcon className="size-3.5" />
            GitHub
          </a>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/playground">
              Start experiment
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="landing-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="ml-auto flex size-8 items-center justify-center rounded-sm border border-line text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg focus-ring md:hidden"
        >
          {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="landing-mobile-menu"
          className="border-t border-line bg-canvas/95 backdrop-blur-md md:hidden"
        >
          <nav aria-label="Sections" className="flex flex-col px-5 py-3 sm:px-8">
            {landingNav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm py-2.5 text-sm text-fg-secondary transition-colors hover:text-fg focus-ring"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-sm py-2.5 text-sm text-fg-secondary transition-colors hover:text-fg focus-ring"
            >
              <GithubIcon />
              GitHub
            </a>

            <div className="mt-3 flex flex-col gap-2 border-t border-line-subtle pt-3 pb-1">
              <Button variant="secondary" asChild>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/playground" onClick={() => setMenuOpen(false)}>
                  Start experiment
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
