import { StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SystemNotFoundScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Not Found</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Resource unavailable
        </Text>
        <Text style={[styles.note, { color: colors.textSecondary }]}>
          Live data loads from the CareBase backend when EXPO_PUBLIC_API_URL is configured.
          This screen is wired for navigation and will not invent hospitals, inventory, or medical results.
        </Text>
      </View>
      <Button title="Go back" variant="outline" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.sm, marginBottom: Spacing['2xl'], marginTop: Spacing.lg },
  title: { ...Typography.title },
  subtitle: { ...Typography.body },
  note: { ...Typography.caption, marginTop: Spacing.md },
});
