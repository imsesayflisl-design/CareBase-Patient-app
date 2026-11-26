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

let clerkUseSignUp: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  clerkUseSignUp = require('@clerk/expo').useSignUp;
} catch {
  clerkUseSignUp = null;
}

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

  const clerkSignUp = isClerkConfigured() && clerkUseSignUp ? clerkUseSignUp() : null;

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
      if (isClerkConfigured() && clerkSignUp) {
        const { signUp, setActive } = clerkSignUp;
        const result = await signUp.create({
          emailAddress: email.trim(),
          password,
          firstName: fullName.trim().split(' ')[0],
          lastName: fullName.trim().split(' ').slice(1).join(' ') || undefined,
        });
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          session.setProfileComplete(false);
          router.replace('/(auth)/complete-profile');
          return;
        }
        // Email verification required
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        router.push({ pathname: '/(auth)/verify-email', params: { email } });
        return;
      }

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
      <View style={styles.wrapper}>
        <View style={[styles.brandRow, { backgroundColor: colors.softBackground, borderColor: colors.border }]}>
          <View style={[styles.brandBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.brandMark, { color: colors.primary }]}>C</Text>
          </View>
          <Text style={[styles.brandLabel, { color: colors.textSecondary }]}>Create account</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Get started</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          {isClerkConfigured()
            ? 'Secure sign-up powered by Clerk.'
            : 'Local demo mode is active. Add your Clerk key for production auth.'}
        </Text>

        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
        </View>

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
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  brandMark: {
    fontSize: 15,
    fontWeight: '700',
  },
  brandLabel: {
    ...Typography.label,
  },
  title: { ...Typography.title, marginTop: Spacing.sm },
  sub: { ...Typography.body, marginTop: Spacing.sm, marginBottom: Spacing.xl },
  formCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.xl,
    gap: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  legal: { ...Typography.small, textAlign: 'center', marginTop: Spacing.lg },
  switch: { ...Typography.caption, textAlign: 'center', marginTop: Spacing.lg, marginBottom: Spacing.xl },
});