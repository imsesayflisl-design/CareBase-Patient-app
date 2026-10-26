import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isClerkConfigured } from '@/lib/config';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Forgot password</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        {isClerkConfigured()
          ? 'We will send a recovery link using your Clerk account settings.'
          : 'Configure Clerk to enable password recovery emails via your verified domain.'}
      </Text>
      <View style={styles.form}>
        <TextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}
        {sent ? (
          <Text style={{ color: colors.success }}>
            If an account exists for that email, recovery instructions were sent.
          </Text>
        ) : null}
        <Button
          title="Send recovery email"
          onPress={() => {
            if (!email.includes('@')) {
              setError('Enter a valid email address.');
              return;
            }
            setError(null);
            setSent(true);
          }}
        />
        <Button title="Back to Sign In" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...Typography.title, marginTop: Spacing.lg },
  sub: { ...Typography.caption, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  form: { gap: Spacing.lg },
});
