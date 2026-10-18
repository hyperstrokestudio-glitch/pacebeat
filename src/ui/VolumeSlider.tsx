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
  const dragStart = useSharedValue(value);

  const setValueFromX = (x: number) => {
    'worklet';
    const width = trackWidth.value;
    if (width <= 0) return;
    const ratio = Math.min(1, Math.max(0, x / width));
    runOnJS(onChange)(Math.round(ratio * 100));
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      dragStart.value = value;
    })
    .onUpdate((event) => {
      setValueFromX(event.x);
    });

  const tap = Gesture.Tap().onEnd((event) => {
    setValueFromX(event.x);
  });

  const gesture = Gesture.Race(pan, tap);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>VOLUME</Text>
      <View style={styles.row}>
        <GestureDetector gesture={gesture}>
          <View
            style={styles.trackShell}
            onLayout={(event) => {
              trackWidth.value = event.nativeEvent.layout.width;
            }}
          >
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${value}%` }]} />
            </View>
            <View
              style={[
                styles.thumb,
                { left: `${Math.min(100, Math.max(0, value))}%` },
              ]}
            />
          </View>
        </GestureDetector>
        <Text style={styles.percent}>{value}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 10,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  trackShell: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#0A1018',
    borderWidth: 1,
    borderColor: colors.panelBorder,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderTopRightRadius: radius.pill,
    borderBottomRightRadius: radius.pill,
  },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    backgroundColor: colors.panelTop,
    borderWidth: 1,
    borderColor: colors.panelHighlight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
  },
  percent: {
    ...typography.value,
    color: colors.textPrimary,
    minWidth: 44,
    textAlign: 'right',
  },
});
