import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthSession } from '@/lib/auth/session';
import { isClerkConfigured } from '@/lib/config';

export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isClerkConfigured()) {
        // Clerk custom sign-in flow hooks into verify / home after session create.
        router.replace('/(auth)/loading');
        return;
      }
      session.setDemoSignedIn(true);
      if (!session.profileComplete) {
        router.replace('/(auth)/complete-profile');
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Sign in to access your CareBase patient account.
      </Text>

      <View style={styles.form}>
        <TextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          secureToggle
        />
        <Link href="/(auth)/forgot-password" style={{ color: colors.primary, alignSelf: 'flex-end' }}>
          Forgot Password
        </Link>
        {error ? <Text style={{ color: colors.error, ...Typography.caption }}>{error}</Text> : null}
        <Button title="Sign In" loading={loading} onPress={signIn} />
        <Text style={[styles.switch, { color: colors.textSecondary }]}>
          New to CareBase?{' '}
          <Link href="/(auth)/sign-up" style={{ color: colors.primary, fontWeight: '600' }}>
            Create Account
          </Link>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...Typography.title, marginTop: Spacing.lg },
  sub: { ...Typography.caption, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  form: { gap: Spacing.lg },
  switch: { ...Typography.caption, textAlign: 'center', marginBottom: Spacing.xl },
});
