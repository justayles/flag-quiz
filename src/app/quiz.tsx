import { ChoiceButton } from '@/components/ChoiceButton';
import { FlagCard } from '@/components/FlagCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { useQuiz } from '@/quiz/quizStore';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function QuizScreen() {
  const router = useRouter();
  const {
    game,
    currentRound,
    currentQuestion,
    isLastQuestion,
    selectAnswer,
    goToNextQuestion,
    completeRound,
  } = useQuiz();

  useEffect(() => {
    if (!game) {
      router.replace('/');
    }
  }, [game, router]);

  if (!game || !currentRound || !currentQuestion || game.phase !== 'playing') {
    return null;
  }

  const answered = Boolean(game.selectedCode);
  const questionNumber = game.questionIndex + 1;
  const questionsInRound = currentRound.questions.length;
  const roundNumber = game.roundIndex + 1;
  const answeredInRound = game.roundCorrect + game.roundMissed.length;

  const onSelect = (code: string) => {
    if (answered) {
      return;
    }

    selectAnswer(code);
  };

  const onNext = () => {
    if (isLastQuestion) {
      completeRound();
      router.replace('/results');
      return;
    }
    goToNextQuestion();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Home"
          onPress={() => router.replace('/')}
          hitSlop={12}
        >
          <Text style={styles.back}>Home</Text>
        </Pressable>
        <Text style={styles.round}>
          Round {roundNumber} of {game.rounds.length}
        </Text>
        <Text style={styles.score}>
          {game.roundCorrect}/{answeredInRound}
        </Text>
      </View>

      <Text style={styles.progressLabel}>
        {questionNumber} of {questionsInRound}
      </Text>
      <ProgressBar progress={questionNumber / questionsInRound} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.flagWrap}>
          <FlagCard key={currentQuestion.country.code} code={currentQuestion.country.code} />
          <Text style={styles.prompt}>Which country flies this flag?</Text>
        </View>

        <View style={styles.choices}>
          {currentQuestion.choices.map((choice, index) => {
            let tone: 'idle' | 'correct' | 'wrong' | 'muted' = 'idle';
            if (answered) {
              if (choice.code === currentQuestion.country.code) {
                tone = 'correct';
              } else if (choice.code === game.selectedCode) {
                tone = 'wrong';
              } else {
                tone = 'muted';
              }
            }

            return (
              <ChoiceButton
                key={choice.code}
                index={index}
                label={choice.name}
                tone={tone}
                disabled={answered}
                onPress={() => onSelect(choice.code)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {answered ? (
          <PrimaryButton
            label={isLastQuestion ? 'See round results' : 'Next flag'}
            onPress={onNext}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  back: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
    width: 64,
  },
  round: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  score: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '800',
    width: 64,
    textAlign: 'right',
  },
  progressLabel: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 12,
    gap: 18,
  },
  flagWrap: {
    gap: 14,
  },
  prompt: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  choices: {
    gap: 10,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  placeholder: {
    height: 56,
  },
});
