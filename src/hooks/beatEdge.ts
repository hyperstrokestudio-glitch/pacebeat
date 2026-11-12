/** How many beats have elapsed, starting at 0. */
export function beatIndex(elapsedMs: number, beatMs: number): number {
  if (!Number.isFinite(elapsedMs) || !Number.isFinite(beatMs) || beatMs <= 0) return 0;
  return Math.floor(elapsedMs / beatMs);
}

/** Bright flash, then dark again before the next beat. */
export function beatFlashReleaseMs(beatMs: number): number {
  return Math.max(50, Math.min(140, beatMs * 0.35));
}
