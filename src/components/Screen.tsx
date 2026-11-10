import { colors } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ANDROID_NAV_MIN = 48;

export function Screen({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const bottomGap =
    Platform.OS === 'android' ? Math.max(ANDROID_NAV_MIN - insets.bottom, 12) : 8;

  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundMid, colors.background]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={[styles.safe, { paddingBottom: bottomGap }]} edges={['top', 'bottom']}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
