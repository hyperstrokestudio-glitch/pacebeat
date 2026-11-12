import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { beatFlashReleaseMs, beatIndex } from './beatEdge';

describe('beat clock', () => {
  it('counts one beat per interval', () => {
    const beatMs = 500;
    assert.equal(beatIndex(0, beatMs), 0);
    assert.equal(beatIndex(499, beatMs), 0);
    assert.equal(beatIndex(500, beatMs), 1);
    assert.equal(beatIndex(1499, beatMs), 2);
  });

  it('keeps the flash shorter than the beat', () => {
    assert.equal(beatFlashReleaseMs(500), 140);
    assert.equal(beatFlashReleaseMs(200), 70);
    assert.ok(beatFlashReleaseMs(200) < 200);
  });
});
