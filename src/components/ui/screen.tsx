'use client'; // Reanimated 4 prefers this annotation on RN targets
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { ScreenEntrance } from '@/components/motion/use-screen-entrance';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: object;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({ children, scroll = true, padded = true, style, refreshing, onRefresh }: Props) {
  const { colors } = useTheme();

  // Staggered content entrance on route focus. Wrapped so each direct child
  // animates in with a small delay between them; remounted when focus moves
  // to another route.
  const wrappedChildren = <ScreenEntrance entranceDuration={320}>{children}</ScreenEntrance>;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {padded && <View style={[styles.padded, { backgroundColor: colors.background }]}>{wrappedChildren}</View>}
          </ScrollView>
        ) : <View style={[styles.inner, { backgroundColor: colors.background }]}>{children}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  inner: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center' },
  padded: { paddingHorizontal: 20, paddingBottom: 32 },
});
