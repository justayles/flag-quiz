import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { COUNTRIES } from '@/data/countries';
import { ROUND_SIZE, roundCount } from '@/quiz/engine';
import { useQuiz } from '@/quiz/quizStore';
import { colors } from '@/theme';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const PREVIEW_FLAGS = ['jp', 'br', 'ke', 'se', 'in', 'za', 'ca', 'nz'];

export default function HomeScreen() {
  const router = useRouter();
  const { game, startQuiz } = useQuiz();
  const rounds = roundCount();
  const lastRoundSize = COUNTRIES.length % ROUND_SIZE || ROUND_SIZE;
  const canResume = Boolean(game);

  const begin = () => {
    startQuiz();
    router.push('/quiz');
  };

  const resume = () => {
    router.push(game?.phase === 'roundComplete' ? '/results' : '/quiz');
  };

  return (
    <Screen>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.flagRow}>
            {PREVIEW_FLAGS.map((code) => (
              <View key={code} style={styles.previewFlag}>
                <Image
                  source={{ uri: `https://flagcdn.com/w80/${code}.png` }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
          <Text style={styles.kicker}>WORLD FLAGS QUIZ</Text>
          <Text style={styles.title}>Flaggy</Text>
          <Text style={styles.subtitle}>
            A flag from every country. Four choices. {ROUND_SIZE} countries at a time, shuffled each
            game.
          </Text>
        </View>

        <View style={styles.stats}>
          <Stat value={`${COUNTRIES.length}`} label="countries" />
          <Stat value="4" label="choices" />
          <Stat value={`${ROUND_SIZE}`} label="per round" />
          <Stat value={`${rounds}`} label="rounds" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <Text style={styles.cardBody}>
            Each question shows one flag. Pick the matching country from four names. Rounds are{' '}
            {ROUND_SIZE} countries, with a final round of {lastRoundSize}. The full set is randomized
            every time you start a new quiz.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {canResume ? (
          <>
            <PrimaryButton label="Resume quiz" onPress={resume} />
            <Pressable
              accessibilityRole="button"
              onPress={begin}
              style={styles.secondary}
            >
              <Text style={styles.secondaryLabel}>Start a new shuffled quiz</Text>
            </Pressable>
          </>
        ) : (
          <PrimaryButton label="Start quiz" onPress={begin} />
        )}
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  bodyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 22,
    paddingVertical: 12,
  },
  hero: {
    gap: 10,
  },
  flagRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  previewFlag: {
    flex: 1,
    height: 28,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.4,
  },
  title: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    gap: 12,
    paddingTop: 12,
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
