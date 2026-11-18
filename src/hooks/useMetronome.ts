import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBeatFileUri } from '../audio/beatCache';
import { useBeatPulse } from './useBeatPulse';
import { beatDurationSeconds, clampBpm, DEFAULT_BPM } from '../metronome/bpm';
import { loadBpm, loadVolume, saveBpm, saveVolume, DEFAULT_VOLUME } from '../storage/preferences';

/** Mix with Spotify/podcasts; do not grab exclusive audio focus (lock screen needs doNotMix). */
const METRONOME_AUDIO_MODE = {
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'mixWithOthers' as const,
};

export function useMetronome() {
  const [ready, setReady] = useState(false);
  const [bpm, setBpmState] = useState(DEFAULT_BPM);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const bpmRef = useRef(bpm);
  const volumeRef = useRef(volume);
  bpmRef.current = bpm;
  volumeRef.current = volume;

  useEffect(() => {
    let mounted = true;
    void (async () => {
      await setAudioModeAsync(METRONOME_AUDIO_MODE);
      const [storedBpm, storedVolume] = await Promise.all([loadBpm(), loadVolume()]);
      if (mounted) {
        setBpmState(storedBpm);
        setVolumeState(storedVolume);
        volumeRef.current = storedVolume;
        setReady(true);
      }
    })();

    return () => {
      mounted = false;
      playerRef.current?.pause();
      playerRef.current?.remove();
      playerRef.current = null;
    };
  }, []);

  const loadBeatIntoPlayer = useCallback(
    async (player: ReturnType<typeof createAudioPlayer>, tempo: number) => {
      const uri = await getBeatFileUri(tempo);
      player.replace({ uri });
      player.loop = true;
      player.volume = volumeRef.current / 100;
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
      bpmRef.current = clamped;
      setBpmState(clamped);
      await saveBpm(clamped);
      if (playerRef.current) {
        await loadBeatIntoPlayer(playerRef.current, clamped);
        if (playerRef.current.playing) {
          playerRef.current.play();
        }
      }
    },
    [loadBeatIntoPlayer],
  );

  const setVolume = useCallback(async (next: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(next)));
    volumeRef.current = clamped;
    setVolumeState(clamped);
    await saveVolume(clamped);
    if (playerRef.current) {
      playerRef.current.volume = clamped / 100;
    }
  }, []);

  const adjustBpm = useCallback(
    (delta: number) => {
      void setBpm(bpmRef.current + delta);
    },
    [setBpm],
  );

  const start = useCallback(async () => {
    await setAudioModeAsync(METRONOME_AUDIO_MODE);
    const player = await ensurePlayer();
    player.play();
    setIsPlaying(true);
  }, [ensurePlayer]);

  const stop = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      player.pause();
      void player.seekTo(0);
    }
    setIsPlaying(false);
  }, []);

  const beatPulse = useBeatPulse(isPlaying, beatDurationSeconds(bpm));

  return {
    ready,
    bpm,
    volume,
    isPlaying,
    beatPulse,
    start,
    stop,
    adjustBpm,
    setBpm,
    setVolume,
  };
}
