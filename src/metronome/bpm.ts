export const SAMPLE_RATE = 44100;

export const MIN_BPM = 10;
export const MAX_BPM = 300;
export const DEFAULT_BPM = 170;

export function clampBpm(bpm: number): number {
  if (!Number.isFinite(bpm)) return DEFAULT_BPM;
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));
}

/** Integer PCM samples for one beat at the given BPM. */
export function beatSampleCount(bpm: number): number {
  const clamped = clampBpm(bpm);
  return Math.round((SAMPLE_RATE * 60) / clamped);
}

export function beatDurationSeconds(bpm: number): number {
  return beatSampleCount(bpm) / SAMPLE_RATE;
}

export function stepBpm(bpm: number, delta: number): number {
  return clampBpm(bpm + delta);
}
