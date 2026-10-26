import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePressRepeat } from '../hooks/usePressRepeat';
import { colors, typography } from '../theme';

type Props = {
  bpm: number;
  onAdjust: (delta: number) => void;
};

export function BpmPanel({ bpm, onAdjust }: Props) {
  const minusRepeat = usePressRepeat({
    onStep: () => onAdjust(-1),
  });
  const plusRepeat = usePressRepeat({
    onStep: () => onAdjust(1),
  });

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[colors.metalLight, colors.metalDark, colors.metalMid]}
        style={styles.border}
      >
        <View style={styles.panel}>
          <Text style={styles.title}>Tempo</Text>

          <View style={styles.controlRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Decrease BPM"
              onPress={() => onAdjust(-1)}
              onPressIn={minusRepeat.onPressIn}
              onPressOut={minusRepeat.onPressOut}
              style={({ pressed }) => [
                styles.stepBtn,
                pressed && styles.stepBtnPressed,
              ]}
            >
              <Text style={styles.stepLabel}>−</Text>
            </Pressable>

            <View style={styles.valueBox}>
              <Text style={styles.value}>{bpm}</Text>
              <Text style={styles.unit}>BPM</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Increase BPM"
              onPress={() => onAdjust(1)}
              onPressIn={plusRepeat.onPressIn}
              onPressOut={plusRepeat.onPressOut}
              style={({ pressed }) => [
                styles.stepBtn,
                pressed && styles.stepBtnPressed,
              ]}
            >
              <Text style={styles.stepLabel}>+</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  border: {
    borderRadius: 10,
    padding: 2,
  },
  panel: {
    backgroundColor: colors.panelInner,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  title: {
    ...typography.serifTitle,
    color: colors.textPrimary,
    fontSize: 11,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 44,
    height: 48,
    borderRadius: 6,
    backgroundColor: colors.metalDark,
    borderWidth: 1,
    borderColor: colors.metalMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPressed: {
    backgroundColor: '#141C26',
  },
  stepLabel: {
    ...typography.panelValue,
    color: colors.textPrimary,
    fontSize: 26,
    lineHeight: 28,
  },
  valueBox: {
    flex: 1,
    backgroundColor: '#060A10',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 8,
    alignItems: 'center',
  },
  value: {
    ...typography.panelValue,
    color: colors.accent,
    fontSize: 28,
    textShadowColor: colors.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  unit: {
    ...typography.unitLabel,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
