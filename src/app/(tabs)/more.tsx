import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { MenuRow } from '@/components/ui/menu-row';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthSession } from '@/lib/auth/session';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function MoreScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();

  const name = session.firstName ?? 'CareBase patient';
  const email = session.email ?? 'Sign in to manage your account';

  const signOut = () => {
    Alert.alert('Sign out', 'You will need to sign in again to access your CareBase account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          session.setDemoSignedIn(false);
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>More</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Account, preferences, and support.
        </Text>
      </View>

      <Card onPress={() => router.push('/profile')}>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.initials, { color: colors.primaryDeep }]}>
              {initials(name)}
            </Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {name}
            </Text>
            <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
              {email}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
      </View>
      <Card padded={false}>
        <MenuRow
          icon="person-outline"
          label="Profile"
          description="Personal and emergency details"
          onPress={() => router.push('/profile')}
        />
        <MenuRow
          icon="settings-outline"
          label="Settings"
          description="Language, appearance, and notifications"
          onPress={() => router.push('/settings')}
        />
        <MenuRow
          icon="notifications-outline"
          label="Notifications"
          description="Appointment and hospital updates"
          onPress={() => router.push('/notifications')}
        />
        <MenuRow
          icon="help-circle-outline"
          label="Help and support"
          description="Get help with your CareBase account"
          onPress={() => router.push('/support')}
          last
        />
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Session</Text>
      </View>
      <Card padded={false}>
        <MenuRow
          icon="log-out-outline"
          label="Sign out"
          tone="danger"
          onPress={signOut}
          last
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: Spacing.sm, marginBottom: Spacing.lg, gap: Spacing.xs },
  title: { ...Typography.title },
  subtitle: { ...Typography.caption },
  identity: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { ...Typography.captionMedium, fontWeight: '700' },
  identityCopy: { flex: 1, gap: 2 },
  name: { ...Typography.subheading },
  email: { ...Typography.caption },
  sectionHeader: { marginTop: Spacing.xl, marginBottom: Spacing.md },
  sectionTitle: { ...Typography.subheading },
});
