import { useCallback, useEffect, useRef } from 'react';

export const PRESS_REPEAT_TIMING = {
  initialDelayMs: 500,
  intervalMs: 280,
  accelerateAfterMs: 3000,
  fastIntervalMs: 140,
} as const;

type Timing = {
  initialDelayMs: number;
  intervalMs: number;
  accelerateAfterMs: number;
  fastIntervalMs: number;
};

type TimerId = ReturnType<typeof setTimeout>;

type TimerApi = {
  setTimeout: (fn: () => void, ms: number) => TimerId;
  clearTimeout: (id: TimerId) => void;
  setInterval: (fn: () => void, ms: number) => TimerId;
  clearInterval: (id: TimerId) => void;
};

const defaultTimers: TimerApi = {
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (id) => clearTimeout(id),
  setInterval: (fn, ms) => setInterval(fn, ms),
  clearInterval: (id) => clearInterval(id),
};

export function createPressRepeatController(
  onStep: () => void,
  timing: Timing = PRESS_REPEAT_TIMING,
  timers: TimerApi = defaultTimers,
) {
  let delayId: TimerId | null = null;
  let accelerateId: TimerId | null = null;
  let intervalId: TimerId | null = null;

  const clearIntervalOnly = () => {
    if (intervalId) {
      timers.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const clear = () => {
    if (delayId) {
      timers.clearTimeout(delayId);
      delayId = null;
    }
    if (accelerateId) {
      timers.clearTimeout(accelerateId);
      accelerateId = null;
    }
    clearIntervalOnly();
  };

  const startInterval = (ms: number) => {
    clearIntervalOnly();
    intervalId = timers.setInterval(onStep, ms);
  };

  return {
    pressIn() {
      clear();
      onStep();
      delayId = timers.setTimeout(() => {
        startInterval(timing.intervalMs);
      }, timing.initialDelayMs);
      accelerateId = timers.setTimeout(() => {
        startInterval(timing.fastIntervalMs);
      }, timing.accelerateAfterMs);
    },
    pressOut() {
      clear();
    },
    dispose() {
      clear();
    },
  };
}

type Options = {
  onStep: () => void;
  initialDelayMs?: number;
  intervalMs?: number;
  accelerateAfterMs?: number;
  fastIntervalMs?: number;
};

export function usePressRepeat({
  onStep,
  initialDelayMs = PRESS_REPEAT_TIMING.initialDelayMs,
  intervalMs = PRESS_REPEAT_TIMING.intervalMs,
  accelerateAfterMs = PRESS_REPEAT_TIMING.accelerateAfterMs,
  fastIntervalMs = PRESS_REPEAT_TIMING.fastIntervalMs,
}: Options) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  const controllerRef = useRef<ReturnType<typeof createPressRepeatController> | null>(null);

  const getController = useCallback(() => {
    if (!controllerRef.current) {
      controllerRef.current = createPressRepeatController(() => onStepRef.current(), {
        initialDelayMs,
        intervalMs,
        accelerateAfterMs,
        fastIntervalMs,
      });
    }
    return controllerRef.current;
  }, [accelerateAfterMs, fastIntervalMs, initialDelayMs, intervalMs]);

  useEffect(() => {
    return () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  const onPressIn = useCallback(() => {
    getController().pressIn();
  }, [getController]);

  const onPressOut = useCallback(() => {
    getController().pressOut();
  }, [getController]);

  return { onPressIn, onPressOut };
}
