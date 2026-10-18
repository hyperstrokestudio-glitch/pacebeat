import type { AudioPlayer } from 'expo-audio';
import { useEffect, type RefObject } from 'react';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export function useBeatPulse(
  isRunning: boolean,
  playerRef: RefObject<AudioPlayer | null>,
  beatDuration: number,
) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!isRunning) {
      pulse.value = withTiming(0, { duration: 120 });
      return;
    }

    let frame = 0;
    let lastTime = 0;
    let armed = true;

    const tick = () => {
      const player = playerRef.current;
      if (!player) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const t = player.currentTime;
      const wrapped =
        lastTime > 0.02 && t < lastTime - beatDuration * 0.25;
      const nearStart = t < 0.015;
      if (armed && (wrapped || (lastTime === 0 && nearStart))) {
        armed = false;
        pulse.value = withSequence(
          withTiming(1, { duration: 45 }),
          withTiming(0, { duration: 140 }),
        );
      }
      if (t > beatDuration * 0.08) {
        armed = true;
      }
      lastTime = t;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [beatDuration, isRunning, playerRef, pulse]);

  return pulse;
}
