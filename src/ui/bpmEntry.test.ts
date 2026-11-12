import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bpmEntryState, enteredBpm, nextBpmEntry } from './bpmEntry';

describe('bpm keypad entry', () => {
  it('replaces the current tempo on the first digit', () => {
    const next = nextBpmEntry('170', '9', true);
    assert.deepEqual(next, { entry: '9', replace: false });
    assert.equal(bpmEntryState(next.entry), 'partial');
    assert.equal(enteredBpm(next.entry), null);
  });

  it('builds a tempo inside 10–300 and ignores a fourth digit', () => {
    let entry = '';
    let replace = false;
    for (const key of ['1', '2', '0'] as const) {
      ({ entry, replace } = nextBpmEntry(entry, key, replace));
    }
    assert.equal(entry, '120');
    assert.equal(enteredBpm(entry), 120);
    assert.equal(nextBpmEntry(entry, '4', false).entry, '120');
  });

  it('rejects a leading zero and values above 300', () => {
    assert.equal(nextBpmEntry('', '0', false).entry, '');
    assert.equal(bpmEntryState('301'), 'high');
    assert.equal(enteredBpm('301'), null);
    assert.equal(enteredBpm('300'), 300);
    assert.equal(enteredBpm('10'), 10);
  });

  it('clears and backspaces', () => {
    assert.deepEqual(nextBpmEntry('170', 'backspace', true), { entry: '', replace: false });
    assert.equal(nextBpmEntry('120', 'backspace', false).entry, '12');
    assert.equal(nextBpmEntry('120', 'clear', false).entry, '');
    assert.equal(bpmEntryState(''), 'empty');
  });
});
