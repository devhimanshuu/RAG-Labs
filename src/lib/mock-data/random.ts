/**
 * Deterministic PRNG (mulberry32).
 *
 * Mock series must be identical on the server and on the client, otherwise the
 * charts re-shuffle on hydration. `Math.random()` is therefore never used in
 * the mock-data layer.
 */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;

  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a stable element from a list. */
export function pick<T>(items: readonly T[], seed: number): T {
  return items[Math.floor(createRandom(seed)() * items.length) % items.length];
}
