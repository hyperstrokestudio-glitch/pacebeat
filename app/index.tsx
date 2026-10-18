import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBeatPulse } from '../src/hooks/useBeatPulse';
import { useMetronome } from '../src/hooks/useMetronome';
import { usePressRepeat } from '../src/hooks/usePressRepeat';
import { colors, spacing, typography } from '../src/theme';
import { BeatPip } from '../src/ui/BeatPip';
import { BevelButton } from '../src/ui/BevelButton';
import { VolumeSlider } from '../src/ui/VolumeSlider';

export default function HomeScreen() {
  const {
    bpm,
    setBpm,
    volumePercent,
    setVolumePercent,
    isRunning,
    toggleRunning,
    playerRef,
    beatDuration,
    ready,
  } = useMetronome();

  const pulse = useBeatPulse(isRunning, playerRef, beatDuration);

  const minusRepeat = usePressRepeat({
    onStep: () => setBpm((value) => value - 1),
  });
  const plusRepeat = usePressRepeat({
    onStep: () => setBpm((value) => value + 1),
  });

  if (!ready) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.backgroundTop, colors.backgroundBottom]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glow} pointerEvents="none" />
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>PACEBEAT</Text>

        <View style={styles.readoutRow}>
          <BevelButton
            variant="round"
            label="−"
            accessibilityLabel="Decrease BPM"
            onPress={() => setBpm((value) => value - 1)}
            onPressIn={minusRepeat.onPressIn}
            onPressOut={minusRepeat.onPressOut}
          />

          <View style={styles.readoutPanel}>
            <LinearGradient
              colors={[colors.panelTop, colors.panelBottom]}
              style={styles.readoutGradient}
            >
              <View style={styles.readoutHighlight} />
              <Text style={styles.bpmLabel}>BPM</Text>
              <View style={styles.bpmRow}>
                <Text style={styles.bpmValue}>{bpm}</Text>
                <BeatPip pulse={pulse} />
              </View>
            </LinearGradient>
          </View>

          <BevelButton
            variant="round"
            label="+"
            accessibilityLabel="Increase BPM"
            onPress={() => setBpm((value) => value + 1)}
            onPressIn={plusRepeat.onPressIn}
            onPressOut={plusRepeat.onPressOut}
          />
        </View>

        <BevelButton
          variant="primary"
          label={isRunning ? 'Stop' : 'Start'}
          active={isRunning}
          onPress={() => {
            void toggleRunning();
          }}
          style={styles.startButton}
        />

        <VolumeSlider value={volumePercent} onChange={setVolumePercent} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundTop,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.backgroundTop,
  },
  glow: {
    position: 'absolute',
    top: '22%',
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(61, 214, 255, 0.08)',
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.title,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  readoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  readoutPanel: {
    flex: 1,
    maxWidth: 260,
    borderRadius: 22,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  readoutGradient: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readoutHighlight: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  bpmLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bpmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  bpmValue: {
    ...typography.bpm,
    color: colors.textPrimary,
    includeFontPadding: false,
  },
  startButton: {
    marginTop: spacing.sm,
  },
});
