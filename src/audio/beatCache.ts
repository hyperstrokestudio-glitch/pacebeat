import * as FileSystem from 'expo-file-system/legacy';
import { clampBpm } from '../metronome/bpm';
import { createOneBeatWavBase64 } from './clickWav';

export async function getBeatFileUri(bpm: number): Promise<string> {
  const clamped = clampBpm(bpm);
  const dir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!dir) {
    return `data:audio/wav;base64,${createOneBeatWavBase64(clamped)}`;
  }

  const path = `${dir}pacebeat-beat-${clamped}.wav`;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    const base64 = createOneBeatWavBase64(clamped);
    await FileSystem.writeAsStringAsync(path, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }
  return path;
}
