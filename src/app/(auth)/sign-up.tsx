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

export default function SignUpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    setError(null);
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      setError('Enter your name, a valid email, and a password of at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isClerkConfigured()) {
        // Custom flow requires the hook inside a Clerk-mounted tree; route to verify after create.
        // For now, navigate to verification screen with email param when Clerk is present.
        router.push({ pathname: '/(auth)/verify-email', params: { email } });
        return;
      }

      // Local development path until Clerk keys are added.
      session.setDemoSignedIn(true);
      session.setProfileComplete(false);
      router.replace('/(auth)/complete-profile');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        {isClerkConfigured()
          ? 'Secure sign-up powered by Clerk.'
          : 'Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY for production auth. Local demo mode is active.'}
      </Text>

      <View style={styles.form}>
        <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
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
        <TextField
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          secureToggle
        />
        {error ? <Text style={{ color: colors.error, ...Typography.caption }}>{error}</Text> : null}
        <Button title="Create Account" loading={loading} onPress={createAccount} />
        <Text style={[styles.legal, { color: colors.textSecondary }]}>
          By creating an account you agree to CareBase Terms and Privacy Policy.
        </Text>
        <Text style={[styles.switch, { color: colors.textSecondary }]}>
          Already have an account?{' '}
          <Link href="/(auth)/sign-in" style={{ color: colors.primary, fontWeight: '600' }}>
            Sign In
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
  legal: { ...Typography.small, textAlign: 'center' },
  switch: { ...Typography.caption, textAlign: 'center', marginBottom: Spacing.xl },
});
