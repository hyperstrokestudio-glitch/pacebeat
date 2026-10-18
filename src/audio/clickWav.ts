import { beatSampleCount } from '../metronome/bpm';
import { buildWavBase64, generateBeatPcm } from './wav';

export function createOneBeatWavBase64(bpm: number): string {
  const samples = beatSampleCount(bpm);
  const pcm = generateBeatPcm(bpm, samples);
  return buildWavBase64(pcm);
}
