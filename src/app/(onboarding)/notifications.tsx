import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setNotificationPromptSeen } from '@/lib/storage/onboarding';

export default function NotificationsOnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const finish = async () => {
    await setNotificationPromptSeen(true);
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={[styles.title, { color: colors.text }]}>Stay informed</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Notifications can share appointment confirmations, reminders, bed request updates, and
          medical report releases. You can enable them later in Settings.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          title="Enable Notifications"
          onPress={async () => {
            // Push infrastructure is marked needs_config until Expo push + backend are wired.
            await finish();
          }}
        />
        <Button title="Continue without notifications" variant="outline" onPress={finish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  title: { ...Typography.title },
  body: { ...Typography.body },
  actions: { gap: Spacing.md, paddingBottom: Spacing['2xl'] },
});
