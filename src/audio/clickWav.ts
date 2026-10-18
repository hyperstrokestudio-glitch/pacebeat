import { beatSampleCount, SAMPLE_RATE } from '../metro/bpm';

const CLICK_MS = 20;
const CLICK_HZ = 880;

function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i += 1) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

/** Builds a mono 16-bit PCM WAV: short click then silence for exactly one beat. */
export function buildOneBeatWav(bpm: number): Uint8Array {
  const numSamples = beatSampleCount(bpm);
  const clickSamples = Math.min(
    numSamples,
    Math.round((SAMPLE_RATE * CLICK_MS) / 1000),
  );
  const dataBytes = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i += 1) {
    let sample = 0;
    if (i < clickSamples) {
      const t = i / SAMPLE_RATE;
      const envelope = Math.exp(-t * 120);
      sample = Math.sin(2 * Math.PI * CLICK_HZ * t) * envelope * 0.65;
    }
    const int16 = Math.max(-32767, Math.min(32767, Math.round(sample * 32767)));
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

export function wavHeaderSize(bytes: Uint8Array): number {
  if (bytes.length < 44) return 0;
  if (
    bytes[0] !== 0x52 ||
    bytes[1] !== 0x49 ||
    bytes[2] !== 0x46 ||
    bytes[3] !== 0x46
  ) {
    return 0;
  }
  return 44;
}

export function wavDataByteLength(bytes: Uint8Array): number {
  if (bytes.length < 44) return 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(40, true);
}
