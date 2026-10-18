import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export function StoneBackground() {
  return (
    <>
      <LinearGradient
        colors={[colors.backgroundTop, '#0A1018', colors.backgroundBottom]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.vignette} pointerEvents="none" />
      <View style={styles.torchLeft} pointerEvents="none" />
      <View style={styles.torchRight} pointerEvents="none" />
    </>
  );
}

const styles = StyleSheet.create({
  vignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 80,
  },
  torchLeft: {
    position: 'absolute',
    bottom: 0,
    left: -20,
    width: 80,
    height: 120,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 120, 40, 0.06)',
  },
  torchRight: {
    position: 'absolute',
    bottom: 0,
    right: -20,
    width: 80,
    height: 120,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 120, 40, 0.06)',
  },
});
