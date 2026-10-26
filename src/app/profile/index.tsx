import { Stack, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { BackendGate } from '@/components/states/backend-gate';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { InfoRow } from '@/components/ui/info-row';
import { MenuRow } from '@/components/ui/menu-row';
import { Screen } from '@/components/ui/screen';
import { StatusBadge } from '@/components/ui/status-badge';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { formatDate } from '@/utils/date';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function genderLabel(value: string | null | undefined): string {
  if (!value) return 'Not provided';
  return value.replace(/_/g, ' ');
}

export default function ProfileIndexScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      return patientApi.me(token);
    },
    [session],
  );

  const fullName =
    [data?.firstName, data?.lastName].filter(Boolean).join(' ') ||
    session.firstName ||
    'CareBase patient';
  const email = data?.email ?? session.email ?? 'Not signed in';
  const location = [data?.city, data?.country].filter(Boolean).join(', ');

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
    <Screen refreshing={loading} onRefresh={refetch}>
      <Stack.Screen options={{ title: 'Profile' }} />

      <Card style={styles.identityCard}>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.initials, { color: colors.primaryDeep }]}>
              {initials(fullName)}
            </Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {fullName}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
              {email}
            </Text>
            {data?.patientId ? (
              <Text style={[styles.patientId, { color: colors.textSecondary }]}>
                {data.patientId}
              </Text>
            ) : null}
          </View>
          <IconButton
            icon="pencil-outline"
            label="Edit profile"
            tone="plain"
            onPress={() => router.push('/profile/edit')}
          />
        </View>
        {data && !data.profileComplete ? (
          <View style={[styles.notice, { backgroundColor: colors.warningSoft }]}>
            <StatusBadge label="Profile incomplete" tone="warning" />
            <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
              Add your contact and emergency details so hospitals can reach you.
            </Text>
          </View>
        ) : null}
      </Card>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal details</Text>
      </View>

      <BackendGate
        loading={loading}
        error={error}
        onRetry={refetch}
        loadingCount={1}
        isEmpty={!loading && !error && !data}
        emptyTitle="Profile not available"
        emptyDescription="Sign in to load your CareBase patient details.">
        {data ? (
          <Card>
            <InfoRow label="Full name" value={fullName} emphasize />
            <InfoRow
              label="Date of birth"
              value={data.dateOfBirth ? formatDate(data.dateOfBirth) : 'Not provided'}
            />
            <InfoRow label="Gender" value={genderLabel(data.gender)} />
            <InfoRow label="Phone" value={data.phone || 'Not provided'} />
            <InfoRow label="Email" value={data.email} />
            <InfoRow label="Address" value={data.address || 'Not provided'} />
            <InfoRow label="Location" value={location || 'Not provided'} />
            <InfoRow
              label="Emergency contact"
              value={data.emergencyContactName || 'Not provided'}
            />
            <InfoRow
              label="Emergency phone"
              value={data.emergencyContactPhone || 'Not provided'}
              last
            />
          </Card>
        ) : null}
      </BackendGate>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
      </View>

      <Card padded={false}>
        <MenuRow
          icon="pencil-outline"
          label="Edit profile"
          description="Update your personal and emergency details"
          onPress={() => router.push('/profile/edit')}
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
        />
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
  identityCard: { marginTop: Spacing.sm, marginBottom: Spacing.xl },
  identity: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { ...Typography.heading, fontWeight: '700' },
  identityCopy: { flex: 1, gap: 2 },
  name: { ...Typography.heading },
  meta: { ...Typography.caption },
  patientId: { ...Typography.small, fontWeight: '600' },
  notice: {
    marginTop: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  noticeText: { ...Typography.small },
  sectionHeader: { marginBottom: Spacing.md },
  sectionTitle: { ...Typography.subheading },
});
