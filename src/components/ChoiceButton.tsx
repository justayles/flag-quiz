import { colors } from '@/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Tone = 'idle' | 'correct' | 'wrong' | 'muted';

type Props = {
  label: string;
  tone: Tone;
  disabled?: boolean;
  onPress: () => void;
};

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export function ChoiceButton({ label, tone, disabled = false, onPress, index }: Props & { index: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        toneStyles[tone],
        pressed && tone === 'idle' && styles.pressed,
      ]}
    >
      <View style={[styles.badge, badgeStyles[tone]]}>
        <Text style={[styles.badgeText, badgeTextStyles[tone]]}>{LETTERS[index]}</Text>
      </View>
      <Text style={[styles.label, labelStyles[tone]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    backgroundColor: colors.cardElevated,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardElevated,
  },
  badgeText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

const toneStyles = StyleSheet.create({
  idle: {},
  correct: {
    borderColor: colors.correct,
    backgroundColor: colors.correctBg,
  },
  wrong: {
    borderColor: colors.wrong,
    backgroundColor: colors.wrongBg,
  },
  muted: {
    opacity: 0.55,
  },
});

const badgeStyles = StyleSheet.create({
  idle: {},
  correct: {
    backgroundColor: colors.correct,
  },
  wrong: {
    backgroundColor: colors.wrong,
  },
  muted: {},
});

const badgeTextStyles = StyleSheet.create({
  idle: {},
  correct: {
    color: colors.background,
  },
  wrong: {
    color: colors.white,
  },
  muted: {},
});

const labelStyles = StyleSheet.create({
  idle: {},
  correct: {
    color: colors.correct,
  },
  wrong: {
    color: colors.wrong,
  },
  muted: {
    color: colors.muted,
  },
});
