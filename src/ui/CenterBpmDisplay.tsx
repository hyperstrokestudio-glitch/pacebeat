import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

type Props = {
  bpm: number;
};

export function CenterBpmDisplay({ bpm }: Props) {
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
            <Text style={styles.digits}>{bpm}</Text>
            <Text style={styles.unitLabel}>BPM</Text>
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
