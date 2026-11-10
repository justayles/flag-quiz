import { COUNTRIES, type Country } from '@/data/countries';
import { buildRounds, type Question, type Round } from '@/quiz/engine';
import { useMemo, useSyncExternalStore } from 'react';

export type QuizPhase = 'playing' | 'roundComplete';

export type QuizSnapshot = {
  rounds: Round[];
  roundIndex: number;
  questionIndex: number;
  selectedCode: string | null;
  roundCorrect: number;
  totalCorrect: number;
  roundMissed: Country[];
  allMissed: Country[];
  phase: QuizPhase;
};

type Listener = () => void;

let snapshot: QuizSnapshot | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function setSnapshot(next: QuizSnapshot | null) {
  snapshot = next;
  emit();
}

function createGame(): QuizSnapshot {
  return {
    rounds: buildRounds(COUNTRIES),
    roundIndex: 0,
    questionIndex: 0,
    selectedCode: null,
    roundCorrect: 0,
    totalCorrect: 0,
    roundMissed: [],
    allMissed: [],
    phase: 'playing',
  };
}

export function startQuiz() {
  setSnapshot(createGame());
}

export function resetQuiz() {
  setSnapshot(null);
}

export function selectAnswer(code: string) {
  const current = snapshot;
  if (!current || current.selectedCode || current.phase !== 'playing') {
    return;
  }

  const round = current.rounds[current.roundIndex];
  const question = round?.questions[current.questionIndex];
  if (!question) {
    return;
  }

  const isCorrect = code === question.country.code;
  setSnapshot({
    ...current,
    selectedCode: code,
    roundCorrect: current.roundCorrect + (isCorrect ? 1 : 0),
    totalCorrect: current.totalCorrect + (isCorrect ? 1 : 0),
    roundMissed: isCorrect ? current.roundMissed : [...current.roundMissed, question.country],
    allMissed: isCorrect ? current.allMissed : [...current.allMissed, question.country],
  });
}

export function goToNextQuestion() {
  const current = snapshot;
  if (!current || !current.selectedCode || current.phase !== 'playing') {
    return;
  }

  const round = current.rounds[current.roundIndex];
  if (!round || current.questionIndex >= round.questions.length - 1) {
    return;
  }

  setSnapshot({
    ...current,
    questionIndex: current.questionIndex + 1,
    selectedCode: null,
  });
}

export function completeRound() {
  const current = snapshot;
  if (!current || !current.selectedCode) {
    return;
  }

  setSnapshot({ ...current, phase: 'roundComplete' });
}

export function continueToNextRound() {
  const current = snapshot;
  if (!current || current.roundIndex >= current.rounds.length - 1) {
    return;
  }

  setSnapshot({
    ...current,
    roundIndex: current.roundIndex + 1,
    questionIndex: 0,
    selectedCode: null,
    roundCorrect: 0,
    roundMissed: [],
    phase: 'playing',
  });
}

export function useQuiz() {
  const game = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return useMemo(() => {
    const currentRound = game?.rounds[game.roundIndex] ?? null;
    const currentQuestion = currentRound?.questions[game?.questionIndex ?? 0] ?? null;

    return {
      game,
      currentRound,
      currentQuestion,
      isLastRound: Boolean(game && game.roundIndex === game.rounds.length - 1),
      isLastQuestion: Boolean(
        currentRound && game && game.questionIndex === currentRound.questions.length - 1,
      ),
      totalCountries: COUNTRIES.length,
      startQuiz,
      selectAnswer,
      goToNextQuestion,
      completeRound,
      continueToNextRound,
      resetQuiz,
    };
  }, [game]);
}

export type { Question, Round };
