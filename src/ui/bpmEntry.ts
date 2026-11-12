import { MAX_BPM, MIN_BPM } from '../metronome/bpm';

export type BpmKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'backspace' | 'clear';

const DIGITS = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function nextBpmEntry(entry: string, key: BpmKey, replace: boolean): { entry: string; replace: boolean } {
  if (key === 'clear') return { entry: '', replace: false };
  if (key === 'backspace') {
    return { entry: replace ? '' : entry.slice(0, -1), replace: false };
  }
  if (!DIGITS.has(key)) return { entry, replace };
  const base = replace ? '' : entry;
  if (base.length >= 3) return { entry: base, replace: false };
  if (base.length === 0 && key === '0') return { entry: '', replace: false };
  return { entry: base + key, replace: false };
}

export function bpmEntryState(entry: string): 'empty' | 'partial' | 'valid' | 'high' {
  if (entry === '') return 'empty';
  const value = Number(entry);
  if (!Number.isInteger(value)) return 'empty';
  if (value > MAX_BPM) return 'high';
  if (value < MIN_BPM) return 'partial';
  return 'valid';
}

export function enteredBpm(entry: string): number | null {
  return bpmEntryState(entry) === 'valid' ? Number(entry) : null;
}
