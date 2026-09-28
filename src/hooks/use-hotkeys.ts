"use client";

import * as React from "react";

/**
 * Global hotkeys.
 *
 * Binds window-level keydown listeners and supports:
 *   - "mod+k"        single combinations (mod = ⌘ on macOS, Ctrl elsewhere)
 *   - "mod+shift+e"  shifted combinations
 *   - "g d"          two-key sequences, Linear/Raycast style
 *
 * Bindings are ignored while the user is typing in a field unless the
 * combination requires a modifier, so ⌘K still works inside an input.
 */

const SEQUENCE_TIMEOUT_MS = 900;

export function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function useHotkeys(
  bindings: Record<string, (event: KeyboardEvent) => void>,
  enabled = true,
): void {
  // Kept in a ref so the listener never needs re-binding when handlers change.
  const bindingsRef = React.useRef(bindings);
  bindingsRef.current = bindings;

  React.useEffect(() => {
    if (!enabled) return;
    let pendingSequence: string | null = null;
    let sequenceTimer: ReturnType<typeof setTimeout> | null = null;

    function clearSequence() {
      pendingSequence = null;
      if (sequenceTimer) {
        clearTimeout(sequenceTimer);
        sequenceTimer = null;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const mod = isMac() ? event.metaKey : event.ctrlKey;
      const needsModifier = mod || event.altKey;
      const typing = isEditableTarget(event.target);

      const key = event.key.toLowerCase();
      if (["meta", "control", "alt", "shift"].includes(key)) return;

      // --- Sequence bindings ("g d") -------------------------------------
      if (!needsModifier && !typing && /^[a-z]$/.test(key)) {
        if (pendingSequence) {
          const combination = `${pendingSequence} ${key}`;
          const handler = bindingsRef.current[combination];
          clearSequence();
          if (handler) {
            event.preventDefault();
            handler(event);
          }
          return;
        }

        const startsSequence = Object.keys(bindingsRef.current).some((binding) =>
          binding.startsWith(`${key} `),
        );
        if (startsSequence) {
          pendingSequence = key;
          sequenceTimer = setTimeout(clearSequence, SEQUENCE_TIMEOUT_MS);
          return;
        }
      } else if (pendingSequence && needsModifier) {
        clearSequence();
      }

      // --- Combination bindings ------------------------------------------
      if (!needsModifier && typing) return;

      const parts: string[] = [];
      if (mod) parts.push("mod");
      if (event.ctrlKey && !mod) parts.push("ctrl");
      if (event.altKey) parts.push("alt");
      if (event.shiftKey) parts.push("shift");
      parts.push(key);

      const combination = parts.join("+");
      const handler = bindingsRef.current[combination];

      if (handler) {
        event.preventDefault();
        handler(event);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearSequence();
    };
  }, [enabled]);
}

/** Formats a shortcut for display, resolving mod to ⌘ or Ctrl. */
export function formatShortcut(combination: string): string {
  const map: Record<string, string> = {
    mod: isMac() ? "⌘" : "Ctrl",
    shift: isMac() ? "⇧" : "Shift",
    alt: isMac() ? "⌥" : "Alt",
    ctrl: "Ctrl",
    enter: "↵",
    escape: "Esc",
  };

  return combination
    .split("+")
    .map((part) => map[part] ?? part.toUpperCase())
    .join(isMac() ? "" : "+");
}
