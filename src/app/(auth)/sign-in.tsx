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

// Clerk hooks (only used when configured; lazy-required to keep Expo Go bootable)
let clerkUseSignIn: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  clerkUseSignIn = require('@clerk/expo').useSignIn;
} catch {
  clerkUseSignIn = null;
}

export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Clerk sign-in (only active when configured)
  const clerkSignIn = isClerkConfigured() && clerkUseSignIn ? clerkUseSignIn() : null;

  const signIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isClerkConfigured() && clerkSignIn) {
        const { signIn: clerkSignInObj, setActive } = clerkSignIn;
        const result = await clerkSignInObj.create({
          identifier: email.trim(),
          password,
        });
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          if (!session.profileComplete) {
            router.replace('/(auth)/complete-profile');
          } else {
            router.replace('/(tabs)');
          }
          return;
        }
        setError('Additional verification required.');
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
      <View style={styles.wrapper}>
        <View style={[styles.brandRow, { backgroundColor: colors.softBackground, borderColor: colors.border }]}>
          <View style={[styles.brandBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.brandMark, { color: colors.primary }]}>C</Text>
          </View>
          <Text style={[styles.brandLabel, { color: colors.textSecondary }]}>CareBase</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Sign in to access your patient dashboard.
        </Text>

        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
          <Link href="/(auth)/forgot-password" style={{ color: colors.primary, alignSelf: 'flex-end', ...Typography.label }}>
            Forgot Password
          </Link>
          {error ? <Text style={{ color: colors.error, ...Typography.caption }}>{error}</Text> : null}
          <Button title="Sign In" loading={loading} onPress={signIn} />
        </View>

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
  switch: { ...Typography.caption, textAlign: 'center', marginTop: Spacing.xl, marginBottom: Spacing.xl },
});