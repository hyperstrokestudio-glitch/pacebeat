import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BPM_DEFAULT,
  BPM_MAX,
  BPM_MIN,
  SAMPLE_RATE,
  beatDurationSeconds,
  beatSampleCount,
  clampBpm,
} from './bpm';

describe('clampBpm', () => {
  it('clamps to configured range', () => {
    assert.equal(clampBpm(40), BPM_MIN);
    assert.equal(clampBpm(250), BPM_MAX);
    assert.equal(clampBpm(170.6), 171);
  });

  it('defaults within range', () => {
    assert.ok(BPM_DEFAULT >= BPM_MIN && BPM_DEFAULT <= BPM_MAX);
  });
});

describe('beatSampleCount', () => {
  it('uses integer samples at 44.1 kHz', () => {
    const samples = beatSampleCount(120);
    assert.equal(samples, Math.round((SAMPLE_RATE * 60) / 120));
    assert.equal(beatDurationSeconds(120), samples / SAMPLE_RATE);
  });
});
