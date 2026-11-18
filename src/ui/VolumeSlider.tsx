import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { colors, radius, typography } from '../theme';

type Props = {
  value: number;
  onChange: (next: number) => void;
};

export function VolumeSlider({ value, onChange }: Props) {
  const trackWidth = useSharedValue(1);

  const setValueFromX = (x: number) => {
    'worklet';
    const width = trackWidth.value;
    if (width <= 0) return;
    const ratio = Math.min(1, Math.max(0, x / width));
    runOnJS(onChange)(Math.round(ratio * 100));
  };

  const pan = Gesture.Pan().onUpdate((event) => {
    setValueFromX(event.x);
  });
  const tap = Gesture.Tap().onEnd((event) => {
    setValueFromX(event.x);
  });
  const gesture = Gesture.Race(pan, tap);
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={styles.frame}>
      <View style={styles.header}>
        <Ionicons name="volume-medium" size={16} color={colors.textSecondary} />
        <Text style={styles.label}>BEAT VOLUME</Text>
        <Text style={styles.percent}>{clamped}%</Text>
      </View>
      <GestureDetector gesture={gesture}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Beat volume"
          accessibilityValue={{ min: 0, max: 100, now: clamped }}
          style={styles.trackShell}
          onLayout={(event) => {
            trackWidth.value = event.nativeEvent.layout.width;
          }}
        >
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${clamped}%` }]} />
          </View>
          <View style={[styles.thumb, { left: `${clamped}%` }]} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.panelInner,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...typography.serifLabel,
    flex: 1,
    color: colors.textSecondary,
    letterSpacing: 1.6,
  },
  percent: {
    ...typography.serifLabel,
    color: colors.textPrimary,
  },
  trackShell: {
    height: 28,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: '#071018',
    borderWidth: 1,
    borderColor: colors.metalDark,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    backgroundColor: '#D7E7F5',
    borderWidth: 2,
    borderColor: colors.accent,
  },
});
