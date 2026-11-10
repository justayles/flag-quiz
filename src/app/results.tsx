import { FlagCard } from '@/components/FlagCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useQuiz } from '@/quiz/quizStore';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ResultsScreen() {
  const router = useRouter();
  const quiz = useQuiz();
  const { continueToNextRound, startQuiz, resetQuiz, totalCountries } = quiz;
  const [view] = useState(quiz.game);

  useEffect(() => {
    if (!view) {
      router.replace('/');
    }
  }, [view, router]);

  if (!view) {
    return null;
  }

  const round = view.rounds[view.roundIndex];
  const roundTotal = round?.questions.length ?? 0;
  const percent = roundTotal ? Math.round((view.roundCorrect / roundTotal) * 100) : 0;
  const overallPercent = Math.round((view.totalCorrect / answeredSoFar(view)) * 100);
  const finished = view.roundIndex === view.rounds.length - 1;

  const onContinue = () => {
    continueToNextRound();
    router.replace('/quiz');
  };

  const onPlayAgain = () => {
    startQuiz();
    router.replace('/quiz');
  };

  const onHome = () => {
    resetQuiz();
    router.replace('/');
  };

  return (
    <Screen>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>{finished ? 'WORLD COMPLETE' : `ROUND ${view.roundIndex + 1} COMPLETE`}</Text>
        <Text style={styles.title}>{finished ? 'Quiz finished' : 'Nice work'}</Text>
        <Text style={styles.subtitle}>
          {finished
            ? `You identified ${view.totalCorrect} of ${totalCountries} flags.`
            : `You got ${view.roundCorrect} of ${roundTotal} flags in this round.`}
        </Text>

        <View style={styles.scoreRow}>
          <ScoreTile value={`${view.roundCorrect}/${roundTotal}`} label={`${percent}% this round`} />
          <ScoreTile
            value={`${view.totalCorrect}/${answeredSoFar(view)}`}
            label={`${Number.isFinite(overallPercent) ? overallPercent : 0}% overall`}
          />
        </View>

        {view.roundMissed.length > 0 ? (
          <View style={styles.missed}>
            <Text style={styles.missedTitle}>Missed this round</Text>
            {view.roundMissed.map((country) => (
              <View key={country.code} style={styles.missedRow}>
                <FlagCard code={country.code} size="thumb" />
                <Text style={styles.missedName}>{country.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.perfect}>
            <Text style={styles.perfectText}>Perfect round. Every flag in this set was correct.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {finished ? (
          <>
            <PrimaryButton label="Play again" onPress={onPlayAgain} />
            <Pressable accessibilityRole="button" onPress={onHome} style={styles.secondary}>
              <Text style={styles.secondaryLabel}>Back to home</Text>
            </Pressable>
          </>
        ) : (
          <PrimaryButton
            label={`Start round ${view.roundIndex + 2}`}
            onPress={onContinue}
          />
        )}
      </View>
    </Screen>
  );
}

function answeredSoFar(game: {
  rounds: { questions: unknown[] }[];
  roundIndex: number;
}): number {
  return game.rounds.slice(0, game.roundIndex + 1).reduce((sum, round) => sum + round.questions.length, 0);
}

function ScoreTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 16,
    gap: 16,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 8,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  tileValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  tileLabel: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  missed: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  missedTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  missedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  missedName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  perfect: {
    backgroundColor: colors.correctBg,
    borderRadius: 16,
    padding: 16,
  },
  perfectText: {
    color: colors.correct,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  footer: {
    gap: 10,
    paddingTop: 8,
  },
  secondary: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});
