import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type Variant = 'start' | 'stop';

type Props = {
  variant: Variant;
  onPress: () => void;
  disabled?: boolean;
};

const palettes: Record<
  Variant,
  { gradient: [string, string, string]; glow: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  start: {
    gradient: [colors.gemGreenTop, colors.gemGreenMid, colors.gemGreenBottom],
    glow: colors.runGreenGlow,
    icon: 'play',
  },
  stop: {
    gradient: [colors.gemRedTop, colors.gemRedMid, colors.gemRedBottom],
    glow: colors.stopRedGlow,
    icon: 'square',
  },
};

export function GemButton({ variant, onPress, disabled = false }: Props) {
  const palette = palettes[variant];
  const label = variant === 'start' ? 'Start' : 'Stop';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={[colors.metalLight, colors.metalDark, colors.metalMid]}
        style={styles.metalFrame}
      >
        <LinearGradient colors={palette.gradient} style={styles.gemFace}>
          <View style={styles.gemHighlight} />
          <Ionicons name={palette.icon} size={28} color="#F5FFFA" />
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </LinearGradient>
      <View style={[styles.glow, { shadowColor: palette.glow }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 100,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  metalFrame: {
    flex: 1,
    borderRadius: 12,
    padding: 4,
    minHeight: 100,
  },
  gemFace: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  gemHighlight: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  label: {
    ...typography.gemLabel,
    color: '#F8FFFE',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  glow: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    width: '70%',
    height: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
  },
});
