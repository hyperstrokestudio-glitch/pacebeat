import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, typography } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  label?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  variant?: 'primary' | 'secondary' | 'round';
  active?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function BevelButton({
  label,
  onPress,
  onPressIn,
  onPressOut,
  variant = 'secondary',
  active = false,
  style,
  accessibilityLabel,
}: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value * 2 }],
    shadowOpacity: 0.35 - pressed.value * 0.15,
  }));

  const isPrimary = variant === 'primary';
  const isRound = variant === 'round';

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 60 });
        onPressIn?.();
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 100 });
        onPressOut?.();
      }}
      style={[
        styles.base,
        isRound && styles.round,
        isPrimary && styles.primaryWrap,
        !isPrimary && !isRound && styles.secondaryWrap,
        animatedStyle,
        style,
      ]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={
            active
              ? ['#2A8FA8', '#1B5570', '#123648']
              : ['#45DFFF', '#2499C4', '#156080']
          }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={[styles.primaryGradient, active && styles.primaryRunning]}
        >
          <View style={styles.primaryHighlight} />
          <Text style={styles.primaryLabel}>{label}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.secondaryFace, isRound && styles.roundFace]}>
          <View style={styles.secondaryHighlight} />
          <Text style={[styles.secondaryLabel, isRound && styles.roundLabel]}>
            {label}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  round: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
  },
  primaryWrap: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  secondaryWrap: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  primaryGradient: {
    minHeight: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.panelHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  primaryRunning: {
    borderColor: colors.accentMuted,
  },
  primaryHighlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  primaryLabel: {
    ...typography.control,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  secondaryFace: {
    minWidth: 56,
    minHeight: 56,
    backgroundColor: colors.panelTop,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  roundFace: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
  },
  secondaryHighlight: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  secondaryLabel: {
    ...typography.control,
    color: colors.textPrimary,
    fontSize: 28,
    lineHeight: 30,
  },
  roundLabel: {
    marginTop: -2,
  },
});
