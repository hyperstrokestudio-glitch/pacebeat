import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { colors } from '../theme';

type Props = {
  pulse: SharedValue<number>;
};

export function BeatPip({ pulse }: Props) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.35 }],
    backgroundColor: pulse.value > 0.2 ? colors.accent : colors.inactive,
    shadowOpacity: 0.2 + pulse.value * 0.6,
    borderColor: pulse.value > 0.2 ? colors.accent : colors.panelBorder,
  }));

  return (
    <View style={styles.shell}>
      <Animated.View style={[styles.pip, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0A1018',
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    marginTop: 28,
  },
  pip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
});
