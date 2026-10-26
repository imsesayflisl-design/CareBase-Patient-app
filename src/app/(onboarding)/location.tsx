import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { setLocationPromptSeen } from '@/lib/storage/onboarding';

export default function LocationScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const finish = async () => {
    await setLocationPromptSeen(true);
    router.replace('/(onboarding)/notifications');
  };

  const enableLocation = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Optional until expo-location is installed.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Location = require('expo-location');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Location remains optional. You can enter a place manually later.');
      }
      await finish();
    } catch {
      setMessage('Location module is not installed yet. You can continue and set location later.');
      await finish();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={[styles.title, { color: colors.text }]}>Find care near you</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Location helps CareBase show nearby hospitals, pharmacies, and directions. You can skip
          this and enter a location manually anytime.
        </Text>
        {message ? (
          <Text style={[styles.note, { color: colors.warning }]}>{message}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Button title="Enable Location" loading={loading} onPress={enableLocation} />
        <Button title="Enter Location Manually" variant="outline" onPress={finish} />
        <Button title="Skip for Now" variant="ghost" onPress={finish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: 'center', gap: Spacing.md },
  title: { ...Typography.title },
  body: { ...Typography.body },
  note: { ...Typography.caption },
  actions: { gap: Spacing.md, paddingBottom: Spacing['2xl'] },
});
