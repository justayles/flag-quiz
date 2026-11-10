import { flagUrl } from '@/quiz/engine';
import { colors } from '@/theme';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image as RNImage, StyleSheet, View } from 'react-native';

type Props = {
  code: string;
  size?: 'hero' | 'thumb';
};

export function FlagCard({ code, size = 'hero' }: Props) {
  const isHero = size === 'hero';
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [code]);

  if (!isHero) {
    return (
      <View style={styles.thumbFrame}>
        <RNImage
          accessibilityLabel={`${code.toUpperCase()} flag`}
          source={{ uri: flagUrl(code, 80) }}
          style={styles.thumbFlag}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.heroFrame}>
      {loaded ? null : (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.muted} />
        </View>
      )}
      <Image
        accessibilityLabel={`${code.toUpperCase()} flag`}
        source={{ uri: flagUrl(code, 640) }}
        style={styles.heroFlag}
        contentFit="contain"
        transition={200}
        onLoad={() => setLoaded(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroFrame: {
    width: '100%',
    aspectRatio: 1.65,
    padding: 16,
    backgroundColor: colors.flagFrame,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  thumbFrame: {
    width: 44,
    height: 32,
    padding: 3,
    borderRadius: 8,
    backgroundColor: colors.flagFrame,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFlag: {
    width: '100%',
    height: '100%',
  },
  thumbFlag: {
    width: 38,
    height: 26,
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
