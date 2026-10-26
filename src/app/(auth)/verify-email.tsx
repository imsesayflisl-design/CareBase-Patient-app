import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function maskEmail(email?: string) {
  if (!email || !email.includes('@')) return 'your email';
  const [user, domain] = email.split('@');
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 2))}@${domain}`;
}

export default function VerifyEmailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Verify your email</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Enter the 6-digit code sent to {maskEmail(email)}. Verification is completed through Clerk
        (or a backend-managed Resend OTP). Codes are never trusted from the device alone.
      </Text>

      <View style={styles.form}>
        <TextField
          label="Verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="000000"
        />
        {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}
        <Button
          title="Verify Code"
          onPress={() => {
            if (code.length !== 6) {
              setError('Enter the 6-digit code.');
              return;
            }
            setError(null);
            router.replace('/(auth)/complete-profile');
          }}
        />
        <Button
          title={seconds > 0 ? `Resend code in ${seconds}s` : 'Resend Code'}
          variant="outline"
          disabled={seconds > 0}
          onPress={() => setSeconds(60)}
        />
        <Button title="Back to Sign In" variant="ghost" onPress={() => router.replace('/(auth)/sign-in')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...Typography.title, marginTop: Spacing.lg },
  sub: { ...Typography.caption, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  form: { gap: Spacing.lg },
});
