import { useCallback, useRef } from 'react';

type Options = {
  onStep: () => void;
  initialDelayMs?: number;
  intervalMs?: number;
};

export function usePressRepeat({
  onStep,
  initialDelayMs = 400,
  intervalMs = 120,
}: Options) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onPressIn = useCallback(() => {
    onStep();
    clearTimers();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(onStep, intervalMs);
    }, initialDelayMs);
  }, [clearTimers, initialDelayMs, intervalMs, onStep]);

  const onPressOut = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  return { onPressIn, onPressOut };
}
