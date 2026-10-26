import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { beatSampleCount, clampBpm, DEFAULT_BPM, MAX_BPM, MIN_BPM, stepBpm } from './bpm';
import { buildWavBuffer, generateBeatPcm, WAV_HEADER_BYTES } from '../audio/wav';

describe('clampBpm', () => {
  it('clamps to 10–300 and rounds', () => {
    assert.equal(clampBpm(DEFAULT_BPM), 170);
    assert.equal(clampBpm(9), MIN_BPM);
    assert.equal(clampBpm(301), MAX_BPM);
    assert.equal(clampBpm(120.6), 121);
    assert.equal(clampBpm(Number.NaN), DEFAULT_BPM);
  });
});

describe('stepBpm', () => {
  it('steps within bounds', () => {
    assert.equal(stepBpm(170, 1), 171);
    assert.equal(stepBpm(10, -1), MIN_BPM);
    assert.equal(stepBpm(300, 1), MAX_BPM);
  });
});

describe('beatSampleCount', () => {
  it('uses integer samples for loop boundary', () => {
    const at170 = beatSampleCount(170);
    assert.equal(at170, Math.round((44100 * 60) / 170));
    assert.ok(at170 > 0);
  });
});

describe('wav beat', () => {
  it('builds header plus one beat of PCM', () => {
    const samples = beatSampleCount(120);
    const pcm = generateBeatPcm(120, samples);
    assert.equal(pcm.length, samples);
    const wav = buildWavBuffer(pcm);
    assert.equal(wav.byteLength, WAV_HEADER_BYTES + samples * 2);
  });
});
