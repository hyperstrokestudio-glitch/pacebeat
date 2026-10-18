import { File, Paths } from 'expo-file-system';
import { buildOneBeatWav } from './clickWav';

export async function writeBeatWavForBpm(bpm: number): Promise<string> {
  const bytes = buildOneBeatWav(bpm);
  const file = new File(Paths.cache, `pacebeat-beat-${bpm}.wav`);
  file.write(bytes);
  return file.uri;
}
