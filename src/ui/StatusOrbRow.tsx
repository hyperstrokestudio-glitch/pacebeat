import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { StatusOrb } from './StatusOrb';

type Props = {
  isPlaying: boolean;
};

export function StatusOrbRow({ isPlaying }: Props) {
  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[colors.metalLight, colors.metalDark, colors.metalMid]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.border}
      >
        <View style={styles.inner}>
          <View style={styles.spikeLeft} />
          <View style={styles.spikeRight} />
          <StatusOrb variant="run" active={isPlaying} label="Run" />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  border: {
    borderRadius: 14,
    padding: 3,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.panelInner,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  spikeLeft: {
    position: 'absolute',
    left: -6,
    top: '40%',
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.metalMid,
  },
  spikeRight: {
    position: 'absolute',
    right: -6,
    top: '40%',
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.metalMid,
  },
});
