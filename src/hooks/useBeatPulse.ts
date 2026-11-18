import { useEffect } from 'react';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { beatFlashReleaseMs, beatIndex } from './beatEdge';

export function useBeatPulse(isRunning: boolean, beatDuration: number) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!isRunning || beatDuration <= 0) {
      pulse.value = withTiming(0, { duration: 80 });
      return;
    }

    const beatMs = beatDuration * 1000;
    const origin = Date.now();
    let lastIndex = -1;
    let frame = 0;

    const flash = () => {
      pulse.value = withSequence(
        withTiming(1, { duration: 40 }),
        withTiming(0, { duration: beatFlashReleaseMs(beatMs) }),
      );
    };

    const tick = () => {
      const index = beatIndex(Date.now() - origin, beatMs);
      if (index !== lastIndex) {
        lastIndex = index;
        flash();
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [beatDuration, isRunning, pulse]);

  return pulse;
}
