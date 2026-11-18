import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMetronome } from '../src/hooks/useMetronome';
import { spacing } from '../src/theme';
import { AppHeader } from '../src/ui/AppHeader';
import { CenterBpmDisplay } from '../src/ui/CenterBpmDisplay';
import { GemButton } from '../src/ui/GemButton';
import { StoneBackground } from '../src/ui/StoneBackground';
import { VolumeSlider } from '../src/ui/VolumeSlider';

export default function HomeScreen() {
  const {
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
  } = useMetronome();

  if (!ready) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.root}>
      <StoneBackground />
      <SafeAreaView style={styles.safe}>
        <AppHeader />

        <CenterBpmDisplay
          bpm={bpm}
          isPlaying={isPlaying}
          pulse={beatPulse}
          onAdjust={adjustBpm}
          onSetBpm={(next) => {
            void setBpm(next);
          }}
        />

        <GemButton
          running={isPlaying}
          onPress={() => {
            if (isPlaying) {
              stop();
              return;
            }
            void start();
          }}
        />

        <VolumeSlider
          value={volume}
          onChange={(next) => {
            void setVolume(next);
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050910',
  },
  loading: {
    flex: 1,
    backgroundColor: '#050910',
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
