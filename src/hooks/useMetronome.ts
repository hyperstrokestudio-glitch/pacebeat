import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBeatFileUri } from '../audio/beatCache';
import { clampBpm, DEFAULT_BPM } from '../metronome/bpm';
import { loadBpm, saveBpm } from '../storage/preferences';

export function useMetronome() {
  const [ready, setReady] = useState(false);
  const [bpm, setBpmState] = useState(DEFAULT_BPM);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const stored = await loadBpm();
      if (mounted) {
        setBpmState(stored);
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
      playerRef.current?.pause();
      playerRef.current?.clearLockScreenControls();
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, []);

  const loadBeatIntoPlayer = useCallback(
    async (player: ReturnType<typeof createAudioPlayer>, tempo: number) => {
      const uri = await getBeatFileUri(tempo);
      player.replace({ uri });
      player.loop = true;
      player.volume = 1;
    },
    [],
  );

  const ensurePlayer = useCallback(async () => {
    if (!playerRef.current) {
      playerRef.current = createAudioPlayer(null, { updateInterval: 100 });
    }
    await loadBeatIntoPlayer(playerRef.current, bpmRef.current);
    return playerRef.current;
  }, [loadBeatIntoPlayer]);

  const setBpm = useCallback(
    async (next: number) => {
      const clamped = clampBpm(next);
      setBpmState(clamped);
      await saveBpm(clamped);
      if (playerRef.current) {
        await loadBeatIntoPlayer(playerRef.current, clamped);
        if (playerRef.current.playing) {
          playerRef.current.play();
          playerRef.current.updateLockScreenMetadata({
            title: 'PaceBeat',
            artist: `${clamped} BPM`,
          });
        }
      }
    },
    [loadBeatIntoPlayer],
  );

  const adjustBpm = useCallback(
    (delta: number) => {
      void setBpm(bpmRef.current + delta);
    },
    [setBpm],
  );

  const start = useCallback(async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
    const player = await ensurePlayer();
    player.setActiveForLockScreen(true, {
      title: 'PaceBeat',
      artist: `${bpmRef.current} BPM`,
    });
    player.play();
    setIsPlaying(true);
  }, [ensurePlayer]);

  const stop = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.pause();
      void player.seekTo(0);
      player.clearLockScreenControls();
    }
    setIsPlaying(false);
  }, []);

  return {
    ready,
    bpm,
    isPlaying,
    start,
    stop,
    adjustBpm,
    setBpm,
  };
}
