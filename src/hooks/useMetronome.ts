import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { writeBeatWavForBpm } from '../audio/beatWavCache';
import { beatDurationSeconds, clampBpm } from '../metro/bpm';
import {
  loadBpm,
  loadVolumePercent,
  saveBpm,
  saveVolumePercent,
} from '../storage/preferences';

export function useMetronome() {
  const [bpm, setBpmState] = useState(170);
  const [volumePercent, setVolumePercentState] = useState(85);
  const [isRunning, setIsRunning] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);
  const bpmRef = useRef(bpm);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedBpm, storedVolume] = await Promise.all([
        loadBpm(),
        loadVolumePercent(),
      ]);
      if (cancelled) return;
      setBpmState(storedBpm);
      setVolumePercentState(storedVolume);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyVolume = useCallback((player: AudioPlayer, percent: number) => {
    player.volume = Math.min(1, Math.max(0, percent / 100));
  }, []);

  const ensurePlayer = useCallback(
    async (nextBpm: number) => {
      const uri = await writeBeatWavForBpm(nextBpm);
      const existing = playerRef.current;
      if (existing) {
        existing.replace(uri);
        existing.loop = true;
        applyVolume(existing, volumePercent);
        return existing;
      }
      const player = createAudioPlayer(uri, { updateInterval: 16 });
      player.loop = true;
      applyVolume(player, volumePercent);
      playerRef.current = player;
      return player;
    },
    [applyVolume, volumePercent],
  );

  useEffect(() => {
    if (!ready) return;
    void ensurePlayer(bpm);
  }, [bpm, ensurePlayer, ready]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    applyVolume(player, volumePercent);
    void saveVolumePercent(volumePercent);
  }, [applyVolume, volumePercent]);

  useEffect(() => {
    if (!ready) return;
    void saveBpm(bpm);
  }, [bpm, ready]);

  useEffect(() => {
    return () => {
      playerRef.current?.release();
      playerRef.current = null;
    };
  }, []);

  const setBpm = useCallback((value: number | ((prev: number) => number)) => {
    setBpmState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      return clampBpm(next);
    });
  }, []);

  const setVolumePercent = useCallback((value: number) => {
    setVolumePercentState(Math.min(100, Math.max(0, Math.round(value))));
  }, []);

  const stop = useCallback(async () => {
    const player = playerRef.current;
    if (player) {
      player.pause();
      player.setActiveForLockScreen(false);
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
    const player = await ensurePlayer(bpmRef.current);
    player.setActiveForLockScreen(true, {
      title: 'PaceBeat',
      artist: 'Metronome',
    });
    player.play();
    setIsRunning(true);
  }, [ensurePlayer]);

  const toggleRunning = useCallback(async () => {
    if (isRunning) {
      await stop();
    } else {
      await start();
    }
  }, [isRunning, start, stop]);

  useEffect(() => {
    if (!isRunning) return;
    void (async () => {
      const player = await ensurePlayer(bpm);
      player.play();
    })();
  }, [bpm, ensurePlayer, isRunning]);

  return {
    bpm,
    setBpm,
    volumePercent,
    setVolumePercent,
    isRunning,
    toggleRunning,
    playerRef,
    beatDuration: beatDurationSeconds(bpm),
    ready,
  };
}
