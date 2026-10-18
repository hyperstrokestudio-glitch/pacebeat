import AsyncStorage from '@react-native-async-storage/async-storage';
import { BPM_DEFAULT, clampBpm } from '../metro/bpm';

const BPM_KEY = 'pacebeat.bpm';
const VOLUME_KEY = 'pacebeat.volume';

export async function loadBpm(): Promise<number> {
  const raw = await AsyncStorage.getItem(BPM_KEY);
  if (raw == null) return BPM_DEFAULT;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return BPM_DEFAULT;
  return clampBpm(parsed);
}

export async function saveBpm(bpm: number): Promise<void> {
  await AsyncStorage.setItem(BPM_KEY, String(clampBpm(bpm)));
}

export async function loadVolumePercent(): Promise<number> {
  const raw = await AsyncStorage.getItem(VOLUME_KEY);
  if (raw == null) return 85;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return 85;
  return Math.min(100, Math.max(0, parsed));
}

export async function saveVolumePercent(percent: number): Promise<void> {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  await AsyncStorage.setItem(VOLUME_KEY, String(clamped));
}
