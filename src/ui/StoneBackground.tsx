import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export function StoneBackground() {
  return (
    <LinearGradient
      colors={[colors.backgroundTop, '#0A1624', colors.backgroundBottom]}
      locations={[0, 0.45, 1]}
      style={StyleSheet.absoluteFill}
    />
  );
}
