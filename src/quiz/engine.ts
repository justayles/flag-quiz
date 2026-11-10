import { COUNTRIES, type Country } from '@/data/countries';

export const ROUND_SIZE = 50;
export const CHOICE_COUNT = 4;

export type Question = {
  country: Country;
  choices: Country[];
};

export type Round = {
  questions: Question[];
};

export function shuffle<T>(items: readonly T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function makeChoices(
  correct: Country,
  pool: readonly Country[],
  choiceCount = CHOICE_COUNT,
): Country[] {
  const distractors = shuffle(pool.filter((country) => country.code !== correct.code)).slice(
    0,
    choiceCount - 1,
  );

  if (distractors.length < choiceCount - 1) {
    throw new Error('Not enough countries to build multiple-choice options.');
  }

  return shuffle([correct, ...distractors]);
}

export function buildRounds(
  countries: readonly Country[] = COUNTRIES,
  roundSize = ROUND_SIZE,
): Round[] {
  const order = shuffle(countries);
  const rounds: Round[] = [];

  for (let index = 0; index < order.length; index += roundSize) {
    const group = order.slice(index, index + roundSize);
    rounds.push({
      questions: group.map((country) => ({
        country,
        choices: makeChoices(country, countries),
      })),
    });
  }

  return rounds;
}

export function flagUrl(code: string, width = 640): string {
  return `https://flagcdn.com/w${width}/${code}.png`;
}

export function roundCount(total = COUNTRIES.length, roundSize = ROUND_SIZE): number {
  return Math.ceil(total / roundSize);
}
