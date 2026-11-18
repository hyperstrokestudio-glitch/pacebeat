import AsyncStorage from '@react-native-async-storage/async-storage';
import { clampBpm, DEFAULT_BPM } from '../metronome/bpm';

const BPM_KEY = 'pacebeat.bpm';
const VOLUME_KEY = 'pacebeat.volume';

export const DEFAULT_VOLUME = 50;

export function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_VOLUME;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export async function loadBpm(): Promise<number> {
  const raw = await AsyncStorage.getItem(BPM_KEY);
  if (raw == null) return DEFAULT_BPM;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return DEFAULT_BPM;
  return clampBpm(parsed);
}

export async function saveBpm(bpm: number): Promise<void> {
  await AsyncStorage.setItem(BPM_KEY, String(clampBpm(bpm)));
}

export async function loadVolume(): Promise<number> {
  const raw = await AsyncStorage.getItem(VOLUME_KEY);
  if (raw == null) return DEFAULT_VOLUME;
  return clampVolume(Number.parseInt(raw, 10));
}

export async function saveVolume(volume: number): Promise<void> {
  await AsyncStorage.setItem(VOLUME_KEY, String(clampVolume(volume)));
}
