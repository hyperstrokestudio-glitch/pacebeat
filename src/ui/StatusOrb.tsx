import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type OrbVariant = 'run' | 'pause' | 'stop';

type Props = {
  variant: OrbVariant;
  active: boolean;
  label: string;
};

const orbPalette: Record<
  OrbVariant,
  { active: [string, string, string]; muted: [string, string, string]; text: string }
> = {
  run: {
    active: ['#7AF0A8', colors.runGreen, colors.runGreenDark],
    muted: ['#2A4035', '#1A2E24', '#0F1A14'],
    text: colors.runGreen,
  },
  pause: {
    active: ['#FFD86A', colors.pauseAmber, colors.pauseAmberDark],
    muted: ['#3A3420', '#2A2418', '#1A160E'],
    text: colors.pauseAmber,
  },
  stop: {
    active: ['#FF9A9A', colors.stopRed, colors.stopRedDark],
    muted: ['#3A2020', '#2A1616', '#1A0E0E'],
    text: colors.stopRed,
  },
};

export function StatusOrb({ variant, active, label }: Props) {
  const palette = orbPalette[variant];
  const gradient = active ? palette.active : palette.muted;

  return (
    <View style={styles.wrap}>
      <View style={[styles.frame, active && styles.frameActive]}>
        <LinearGradient colors={gradient} style={styles.orb}>
          <View style={styles.highlight} />
          <View style={styles.core} />
        </LinearGradient>
      </View>
      <Text
        style={[
          styles.label,
          { color: active ? palette.text : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    flex: 1,
  },
  frame: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.metalDark,
    backgroundColor: colors.metalMid,
  },
  frameActive: {
    borderColor: colors.metalEdge,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  orb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  highlight: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 18,
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: [{ rotate: '-24deg' }],
  },
  core: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  label: {
    ...typography.serifLabel,
    marginTop: 8,
    textTransform: 'uppercase',
  },
});
