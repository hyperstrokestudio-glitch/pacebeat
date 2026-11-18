import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../theme';

function Peak({ width, height, color }: { width: number; height: number; color: string }) {
  return (
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: width / 2,
        borderRightWidth: width / 2,
        borderBottomWidth: height,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
      }}
    />
  );
}

export function AppHeader() {
  return (
    <View style={styles.wrap}>
      <View style={styles.mountains}>
        <Peak width={22} height={14} color="#7EB6DE" />
        <View style={styles.centerPeak}>
          <Peak width={34} height={22} color="#D7F3FF" />
        </View>
        <Peak width={22} height={14} color="#7EB6DE" />
      </View>
      <Text style={styles.title}>PACE BEAT</Text>
      <View style={styles.subtitleRow}>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>RUNNING METRONOME</Text>
        <View style={styles.rule} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  mountains: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
  },
  centerPeak: {
    marginHorizontal: -4,
  },
  title: {
    ...typography.serifTitle,
    color: '#EAF6FF',
    fontSize: 32,
    letterSpacing: 3,
    textShadowColor: colors.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rule: {
    width: 28,
    height: 1,
    backgroundColor: colors.accentDim,
  },
  subtitle: {
    ...typography.serifLabel,
    color: colors.accent,
    fontSize: 10,
    letterSpacing: 2.4,
  },
});
