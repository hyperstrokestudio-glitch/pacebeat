import AsyncStorage from '@react-native-async-storage/async-storage';
import { clampBpm, DEFAULT_BPM } from '../metronome/bpm';

const BPM_KEY = 'pacebeat.bpm';

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
