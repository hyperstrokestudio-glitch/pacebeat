import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MAX_BPM, MIN_BPM } from '../metronome/bpm';
import { colors, typography } from '../theme';
import { bpmEntryState, enteredBpm, nextBpmEntry, type BpmKey } from './bpmEntry';

type Props = {
  bpm: number;
  onClose: () => void;
  onSubmit: (bpm: number) => void;
};

const ROWS: BpmKey[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['clear', '0', 'backspace'],
];

const LABELS: Record<BpmKey, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  clear: 'Clear',
  backspace: 'Delete',
};

export function BpmKeypad({ bpm, onClose, onSubmit }: Props) {
  const [entry, setEntry] = useState(String(bpm));
  const [replace, setReplace] = useState(true);
  const state = bpmEntryState(entry);
  const accepted = enteredBpm(entry);

  const pressKey = (key: BpmKey) => {
    const next = nextBpmEntry(entry, key, replace);
    setEntry(next.entry);
    setReplace(next.replace);
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose} visible>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityLabel="Close keypad"
          onPress={onClose}
          style={styles.scrim}
        />
        <View style={styles.card}>
          <Text style={styles.title}>Set tempo</Text>
          <Text
            accessibilityLabel={entry === '' ? 'No tempo entered' : `Entered tempo ${entry}`}
            style={[
              styles.entry,
              state === 'high' && styles.entryHigh,
              state === 'empty' && styles.entryEmpty,
            ]}
          >
            {entry === '' ? '—' : entry}
          </Text>
          <Text style={styles.range}>
            {MIN_BPM}–{MAX_BPM} BPM
          </Text>

          {ROWS.map((row) => (
            <View key={row.join('-')} style={styles.row}>
              {row.map((key) => (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  accessibilityLabel={LABELS[key]}
                  onPress={() => pressKey(key)}
                  style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
                >
                  <Text style={[styles.keyLabel, key === 'clear' && styles.keyWord]}>
                    {key === 'clear' ? 'C' : key === 'backspace' ? '⌫' : key}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Set BPM"
            accessibilityState={{ disabled: accepted == null }}
            disabled={accepted == null}
            onPress={() => {
              if (accepted == null) return;
              onSubmit(accepted);
            }}
            style={({ pressed }) => [
              styles.setKey,
              accepted == null && styles.setKeyDisabled,
              pressed && accepted != null && styles.keyPressed,
            ]}
          >
            <Text style={styles.setLabel}>Set</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 8, 14, 0.82)',
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.panelInner,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 16,
    gap: 8,
  },
  title: {
    ...typography.serifTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  entry: {
    ...typography.timer,
    fontSize: 56,
    lineHeight: 64,
    color: colors.accent,
    textAlign: 'center',
    textShadowColor: colors.accentGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    includeFontPadding: false,
  },
  entryHigh: {
    color: colors.pauseAmber,
    textShadowColor: colors.pauseAmberGlow,
  },
  entryEmpty: {
    color: colors.textMuted,
    textShadowRadius: 0,
  },
  range: {
    ...typography.serifLabel,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    flex: 1,
    minHeight: 52,
    borderRadius: 6,
    backgroundColor: colors.metalDark,
    borderWidth: 1,
    borderColor: colors.metalMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: '#141C26',
  },
  keyLabel: {
    ...typography.panelValue,
    color: colors.textPrimary,
    fontSize: 22,
  },
  keyWord: {
    fontSize: 18,
  },
  setKey: {
    minHeight: 48,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: colors.accentDim,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setKeyDisabled: {
    opacity: 0.4,
  },
  setLabel: {
    ...typography.serifTitle,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
});
