import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type Props = {
  running: boolean;
  onPress: () => void;
};

export function GemButton({ running, onPress }: Props) {
  const label = running ? 'Stop' : 'Start';
  const gradient: [string, string, string] = running
    ? [colors.gemRedTop, colors.gemRedMid, colors.gemRedBottom]
    : ['#7AD7FF', '#1E8FFF', '#0C4FBE'];
  const glow = running ? colors.stopRedGlow : colors.accentGlow;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[colors.metalLight, colors.metalDark, colors.metalMid]}
        style={styles.metalFrame}
      >
        <LinearGradient colors={gradient} style={styles.face}>
          <View style={styles.highlight} />
          <Ionicons name={running ? 'square' : 'play'} size={22} color="#F7FBFF" />
          <Text style={styles.label}>{label}</Text>
        </LinearGradient>
      </LinearGradient>
      <View style={[styles.glow, { shadowColor: glow }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    minHeight: 74,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  metalFrame: {
    borderRadius: 18,
    padding: 3,
    minHeight: 74,
  },
  face: {
    minHeight: 68,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  highlight: {
    position: 'absolute',
    top: 6,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  label: {
    ...typography.gemLabel,
    color: '#F8FFFE',
    fontSize: 22,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  glow: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    width: '80%',
    height: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
});
