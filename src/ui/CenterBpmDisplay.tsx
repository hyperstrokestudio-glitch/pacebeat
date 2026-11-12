import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePressRepeat } from '../hooks/usePressRepeat';
import { colors, typography } from '../theme';

type Props = {
  bpm: number;
  isPlaying: boolean;
  onAdjust: (delta: number) => void;
};

export function CenterBpmDisplay({ bpm, isPlaying, onAdjust }: Props) {
  const minusRepeat = usePressRepeat({
    onStep: () => onAdjust(-1),
  });
  const plusRepeat = usePressRepeat({
    onStep: () => onAdjust(1),
  });

  useEffect(() => {
    if (!isPlaying) return;
    minusRepeat.onPressOut();
    plusRepeat.onPressOut();
  }, [isPlaying, minusRepeat.onPressOut, plusRepeat.onPressOut]);

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[colors.metalLight, colors.metalDark, '#2A3544']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.frameGradient}
      >
        <View style={styles.octagonWrap}>
          <LinearGradient
            colors={[colors.panelTop, colors.panelInner, '#060A10']}
            style={styles.face}
          >
            <View style={styles.topBevel} />
            <View style={styles.row}>
              {isPlaying ? null : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decrease BPM"
                  onPressIn={minusRepeat.onPressIn}
                  onPressOut={minusRepeat.onPressOut}
                  style={({ pressed }) => [
                    styles.stepBtn,
                    pressed && styles.stepBtnPressed,
                  ]}
                >
                  <Text style={styles.stepLabel}>−</Text>
                </Pressable>
              )}

              <View style={styles.readout}>
                <Text style={styles.digits}>{bpm}</Text>
                <Text style={styles.unitLabel}>BPM</Text>
              </View>

              {isPlaying ? null : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Increase BPM"
                  onPressIn={plusRepeat.onPressIn}
                  onPressOut={plusRepeat.onPressOut}
                  style={({ pressed }) => [
                    styles.stepBtn,
                    pressed && styles.stepBtnPressed,
                  ]}
                >
                  <Text style={styles.stepLabel}>+</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.gemSlot}>
              <LinearGradient
                colors={['#9ADFFF', colors.accent, colors.accentDim]}
                style={styles.gem}
              />
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginVertical: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
  },
  frameGradient: {
    borderRadius: 6,
    padding: 4,
  },
  octagonWrap: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1A2430',
  },
  face: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  readout: {
    flex: 1,
    alignItems: 'center',
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
  digits: {
    ...typography.timer,
    color: colors.accent,
    textShadowColor: colors.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
    includeFontPadding: false,
  },
  unitLabel: {
    ...typography.serifLabel,
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 4,
  },
  gemSlot: {
    position: 'absolute',
    bottom: -2,
    padding: 3,
    backgroundColor: colors.metalDark,
    borderWidth: 1,
    borderColor: colors.metalEdge,
    transform: [{ rotate: '45deg' }],
  },
  gem: {
    width: 12,
    height: 12,
  },
});
