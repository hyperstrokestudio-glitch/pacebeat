import { SAMPLE_RATE } from '../metronome/bpm';

const CLICK_DURATION_SEC = 0.02;
const CLICK_FREQ_HZ = 1200;

export function generateBeatPcm(bpm: number, sampleCount: number): Int16Array {
  const pcm = new Int16Array(sampleCount);
  const clickSamples = Math.min(
    sampleCount,
    Math.round(SAMPLE_RATE * CLICK_DURATION_SEC),
  );

  for (let i = 0; i < clickSamples; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = 1 - i / clickSamples;
    const sample =
      Math.sin(2 * Math.PI * CLICK_FREQ_HZ * t) * envelope * 0.85 * 0.8;
    pcm[i] = Math.round(sample * 32767);
  }

  return pcm;
}

export function buildWavBuffer(pcm: Int16Array): Uint8Array {
  const dataSize = pcm.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < pcm.length; i++) {
    view.setInt16(offset, pcm[i] ?? 0, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

function bytesToBase64(bytes: Uint8Array): string {
  const g = globalThis as { btoa?: (data: string) => string };
  if (typeof g.btoa === 'function') {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i] ?? 0);
    }
    return g.btoa(binary);
  }

  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];
    const triplet = (b0 << 16) | ((b1 ?? 0) << 8) | (b2 ?? 0);
    output += alphabet[(triplet >> 18) & 63];
    output += alphabet[(triplet >> 12) & 63];
    output += b1 === undefined ? '=' : alphabet[(triplet >> 6) & 63];
    output += b2 === undefined ? '=' : alphabet[triplet & 63];
  }
  return output;
}

export function buildWavBase64(pcm: Int16Array): string {
  return bytesToBase64(buildWavBuffer(pcm));
}

export const WAV_HEADER_BYTES = 44;
