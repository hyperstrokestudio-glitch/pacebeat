export const BPM_MIN = 60;
export const BPM_MAX = 200;
export const BPM_DEFAULT = 170;
export const SAMPLE_RATE = 44100;

export function clampBpm(value: number): number {
  return Math.min(BPM_MAX, Math.max(BPM_MIN, Math.round(value)));
}

/** Integer PCM samples for one beat at the given BPM. */
export function beatSampleCount(bpm: number): number {
  const clamped = clampBpm(bpm);
  return Math.round((SAMPLE_RATE * 60) / clamped);
}

export function beatDurationSeconds(bpm: number): number {
  return beatSampleCount(bpm) / SAMPLE_RATE;
}
