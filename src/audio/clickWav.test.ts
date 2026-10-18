import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildOneBeatWav, wavDataByteLength, wavHeaderSize } from './clickWav';
import { beatSampleCount } from '../metro/bpm';

describe('buildOneBeatWav', () => {
  it('writes a valid 44-byte RIFF header and matching data chunk', () => {
    const wav = buildOneBeatWav(170);
    assert.equal(wavHeaderSize(wav), 44);
    const dataBytes = wavDataByteLength(wav);
    assert.equal(dataBytes, beatSampleCount(170) * 2);
    assert.equal(wav.length, 44 + dataBytes);
  });
});
