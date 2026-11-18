import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createPressRepeatController, PRESS_REPEAT_TIMING } from './usePressRepeat';

type TimerId = ReturnType<typeof setTimeout>;

type Entry = {
  id: number;
  at: number;
  interval: number | null;
  fn: () => void;
};

function createFakeClock() {
  let now = 0;
  let nextId = 1;
  const entries: Entry[] = [];

  const remove = (id: TimerId) => {
    const index = entries.findIndex((entry) => entry.id === (id as unknown as number));
    if (index >= 0) entries.splice(index, 1);
  };

  const schedule = (fn: () => void, ms: number, interval: number | null) => {
    const id = nextId;
    nextId += 1;
    entries.push({ id, at: now + ms, interval, fn });
    return id as unknown as TimerId;
  };

  return {
    now: () => now,
    api: {
      setTimeout: (fn: () => void, ms: number) => schedule(fn, ms, null),
      clearTimeout: remove,
      setInterval: (fn: () => void, ms: number) => schedule(fn, ms, ms),
      clearInterval: remove,
    },
    advance(ms: number) {
      const target = now + ms;
      for (;;) {
        const due = entries
          .filter((entry) => entry.at <= target)
          .sort((a, b) => a.at - b.at || a.id - b.id);
        const next = due[0];
        if (!next) break;
        now = next.at;
        if (next.interval == null) {
          remove(next.id as unknown as TimerId);
          next.fn();
        } else {
          next.at += next.interval;
          next.fn();
        }
      }
      now = target;
    },
  };
}

describe('press repeat', () => {
  it('changes tempo by one on a tap', () => {
    const clock = createFakeClock();
    let count = 0;
    const repeat = createPressRepeatController(() => {
      count += 1;
    }, PRESS_REPEAT_TIMING, clock.api);

    repeat.pressIn();
    repeat.pressOut();
    clock.advance(5000);
    assert.equal(count, 1);
  });

  it('repeats every 280ms after a 500ms hold', () => {
    const clock = createFakeClock();
    const stamps: number[] = [];
    const repeat = createPressRepeatController(() => {
      stamps.push(clock.now());
    }, PRESS_REPEAT_TIMING, clock.api);

    repeat.pressIn();
    clock.advance(PRESS_REPEAT_TIMING.accelerateAfterMs - 1);

    assert.deepEqual(stamps, [0, 780, 1060, 1340, 1620, 1900, 2180, 2460, 2740]);
    for (let i = 2; i < stamps.length; i += 1) {
      assert.equal(stamps[i] - stamps[i - 1], PRESS_REPEAT_TIMING.intervalMs);
    }
  });

  it('doubles the repeat rate after a 3s hold and stops on release', () => {
    const clock = createFakeClock();
    const stamps: number[] = [];
    const repeat = createPressRepeatController(() => {
      stamps.push(clock.now());
    }, PRESS_REPEAT_TIMING, clock.api);

    repeat.pressIn();
    clock.advance(3000 + PRESS_REPEAT_TIMING.fastIntervalMs * 3);

    assert.deepEqual(stamps.slice(-3), [3140, 3280, 3420]);
    assert.equal(stamps.at(-1)! - stamps.at(-2)!, PRESS_REPEAT_TIMING.fastIntervalMs);
    assert.equal(PRESS_REPEAT_TIMING.fastIntervalMs * 2, PRESS_REPEAT_TIMING.intervalMs);

    const held = stamps.length;
    repeat.pressOut();
    clock.advance(2000);
    assert.equal(stamps.length, held);
  });
});
