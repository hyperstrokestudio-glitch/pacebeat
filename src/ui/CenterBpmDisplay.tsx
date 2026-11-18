import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { usePressRepeat } from '../hooks/usePressRepeat';
import { colors, typography } from '../theme';
import { BpmKeypad } from './BpmKeypad';

type Props = {
  bpm: number;
  isPlaying: boolean;
  pulse: SharedValue<number>;
  onAdjust: (delta: number) => void;
  onSetBpm: (bpm: number) => void;
};

function BeatLight({ pulse, active }: { pulse: SharedValue<number>; active: boolean }) {
  const glow = useAnimatedStyle(() => {
    const beat = active ? pulse.value : 1;
    return {
      opacity: active ? 0.35 + beat * 0.65 : 1,
      transform: [{ scale: active ? 0.92 + beat * 0.12 : 1 }],
    };
  }, [active]);

  return (
    <Animated.View style={[styles.beatLight, glow]}>
      <View style={styles.beatCore} />
    </Animated.View>
  );
}

export function CenterBpmDisplay({ bpm, isPlaying, pulse, onAdjust, onSetBpm }: Props) {
  const [keypadOpen, setKeypadOpen] = useState(false);
  const minusRepeat = usePressRepeat({
    onStep: () => onAdjust(-1),
  });
  const plusRepeat = usePressRepeat({
    onStep: () => onAdjust(1),
  });

  useEffect(() => {
    if (!isPlaying) return;
    setKeypadOpen(false);
    minusRepeat.onPressOut();
    plusRepeat.onPressOut();
  }, [isPlaying, minusRepeat.onPressOut, plusRepeat.onPressOut]);

  const digits = isPlaying ? (
    <View style={styles.readout}>
      <Text style={styles.digits}>{bpm}</Text>
    </View>
  ) : (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Enter BPM"
      onPress={() => setKeypadOpen(true)}
      style={styles.readout}
    >
      <Text style={styles.digits}>{bpm}</Text>
    </Pressable>
  );

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[colors.metalLight, colors.metalDark, colors.metalMid]}
        style={styles.frame}
      >
        <View style={styles.face}>
          <Text style={styles.bpmLabel}>BPM</Text>
          <View style={styles.heroRow}>
            {digits}
            <BeatLight pulse={pulse} active={isPlaying} />
          </View>
        </View>
      </LinearGradient>

      {isPlaying ? null : (
        <View style={styles.stepper}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease BPM"
            onPressIn={minusRepeat.onPressIn}
            onPressOut={minusRepeat.onPressOut}
            style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
          >
            <Text style={styles.stepLabel}>−</Text>
          </Pressable>
          <View style={styles.stepValue}>
            <Text style={styles.stepDigits}>{bpm}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase BPM"
            onPressIn={plusRepeat.onPressIn}
            onPressOut={plusRepeat.onPressOut}
            style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
          >
            <Text style={styles.stepLabel}>+</Text>
          </Pressable>
        </View>
      )}

      {keypadOpen ? (
        <BpmKeypad
          bpm={bpm}
          onClose={() => setKeypadOpen(false)}
          onSubmit={(next) => {
            onSetBpm(next);
            setKeypadOpen(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 16,
  },
  frame: {
    borderRadius: 16,
    padding: 3,
  },
  face: {
    borderRadius: 13,
    backgroundColor: colors.panelInner,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 4,
  },
  bpmLabel: {
    ...typography.serifLabel,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readout: {
    flex: 1,
  },
  digits: {
    ...typography.timer,
    color: '#F4FBFF',
    fontSize: 84,
    letterSpacing: 1,
    textShadowColor: colors.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    includeFontPadding: false,
  },
  beatLight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  beatCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F4FBFF',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  stepBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.panelInner,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPressed: {
    backgroundColor: '#102033',
  },
  stepLabel: {
    ...typography.panelValue,
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 32,
  },
  stepValue: {
    minWidth: 92,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: '#071018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDigits: {
    ...typography.panelValue,
    color: colors.textPrimary,
    fontSize: 22,
  },
});
