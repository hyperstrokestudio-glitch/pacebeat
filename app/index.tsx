import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMetronome } from '../src/hooks/useMetronome';
import { spacing } from '../src/theme';
import { BpmPanel } from '../src/ui/BpmPanel';
import { CenterBpmDisplay } from '../src/ui/CenterBpmDisplay';
import { GemButton } from '../src/ui/GemButton';
import { StatusOrbRow } from '../src/ui/StatusOrbRow';
import { StoneBackground } from '../src/ui/StoneBackground';

export default function HomeScreen() {
  const { ready, bpm, isPlaying, start, stop, adjustBpm } = useMetronome();

  if (!ready) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.root}>
      <StoneBackground />
      <SafeAreaView style={styles.safe}>
        <StatusOrbRow isPlaying={isPlaying} />

        <CenterBpmDisplay bpm={bpm} />

        <BpmPanel bpm={bpm} onAdjust={adjustBpm} />

        <View style={styles.actionsRow}>
          <GemButton variant="start" disabled={isPlaying} onPress={() => void start()} />
          <GemButton variant="stop" disabled={!isPlaying} onPress={stop} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#05080E',
  },
  loading: {
    flex: 1,
    backgroundColor: '#05080E',
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
});
