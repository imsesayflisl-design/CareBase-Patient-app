import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppointmentCard } from '@/components/cards/appointment-card';
import { BackendGate } from '@/components/states/backend-gate';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { MenuRow } from '@/components/ui/menu-row';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { nextUpcomingAppointment } from '@/utils/appointments';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Action = {
  icon: IconName;
  label: string;
  description: string;
  href: Href;
};

const FIND_CARE: Action[] = [
  { icon: 'medkit-outline', label: 'Hospitals', description: 'Nearby care and emergency units', href: '/(tabs)/hospitals' },
  { icon: 'person-outline', label: 'Doctors', description: 'Specialists and consultation fees', href: '/doctors' },
  { icon: 'bag-handle-outline', label: 'Pharmacies', description: 'Medicine availability nearby', href: '/pharmacies' },
  { icon: 'scan-outline', label: 'Scans', description: 'Imaging and diagnostic services', href: '/scans' },
];

const MANAGE_CARE: Action[] = [
  { icon: 'calendar-clear-outline', label: 'Appointments', description: 'Requests, confirmations, and visits', href: '/(tabs)/appointments' },
  { icon: 'folder-open-outline', label: 'Medical records', description: 'Visits, tests, and prescriptions', href: '/(tabs)/records' },
  { icon: 'bed-outline', label: 'Hospital beds', description: 'Request admission or check availability', href: '/beds' },
  { icon: 'pulse-outline', label: 'Health readings', description: 'Track blood pressure and more', href: '/health' },
];

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const firstFocus = useRef(true);

  const appointments = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      return patientApi.appointments(token);
    },
    [session],
  );

  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      appointments.refetch();
    }, [appointments.refetch]),
  );

  const upcoming = appointments.data ? nextUpcomingAppointment(appointments.data) : null;
  const name = session.firstName ?? 'there';

  const renderActions = (actions: Action[]) => (
    <Card padded={false}>
      {actions.map((action, index) => (
        <MenuRow
          key={action.label}
          icon={action.icon}
          label={action.label}
          description={action.description}
          onPress={() => router.push(action.href)}
          last={index === actions.length - 1}
        />
      ))}
    </Card>
  );

  return (
    <Screen refreshing={appointments.loading} onRefresh={appointments.refetch}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {greetingForHour(new Date().getHours())}
          </Text>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        </View>
        <IconButton
          icon="notifications-outline"
          label="Notifications"
          onPress={() => router.push('/notifications')}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search hospitals, doctors, and pharmacies"
        onPress={() => router.push('/search')}
        style={({ pressed }) => [
          styles.search,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}>
        <Ionicons name="search" size={19} color={colors.textSecondary} />
        <Text style={[styles.searchText, { color: colors.textSecondary }]}>
          Search hospitals, doctors, pharmacies
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Find emergency care"
        onPress={() => router.push('/emergency')}
        style={({ pressed }) => [
          styles.emergency,
          { backgroundColor: colors.emergency, opacity: pressed ? 0.9 : 1 },
        ]}>
        <Ionicons name="medkit" size={24} color="#FFFFFF" />
        <View style={styles.emergencyCopy}>
          <Text style={styles.emergencyTitle}>Emergency care</Text>
          <Text style={styles.emergencyBody}>Find the nearest emergency department</Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color="#FFFFFF" />
      </Pressable>

      <View style={styles.sectionRow}>
        <Text style={[styles.section, { color: colors.text }]}>Find care</Text>
      </View>
      {renderActions(FIND_CARE)}

      <View style={styles.sectionRow}>
        <Text style={[styles.section, { color: colors.text }]}>Manage care</Text>
      </View>
      {renderActions(MANAGE_CARE)}

      <View style={styles.sectionRow}>
        <Text style={[styles.section, { color: colors.text }]}>Upcoming visit</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all appointments"
          hitSlop={8}
          onPress={() => router.push('/(tabs)/appointments')}>
          <Text style={[styles.sectionLink, { color: colors.primary }]}>See all</Text>
        </Pressable>
      </View>

      <BackendGate
        loading={appointments.loading}
        error={appointments.error}
        onRetry={appointments.refetch}
        loadingCount={1}
        isEmpty={!appointments.loading && !appointments.error && !upcoming}
        emptyTitle="No upcoming visits"
        emptyDescription="Book a visit when you are ready. Pending requests stay separate from confirmed appointments."
        emptyActionLabel="Book appointment"
        onEmptyAction={() => router.push('/appointments/book/hospital')}>
        {upcoming ? (
          <AppointmentCard
            appointment={upcoming}
            onPress={() =>
              router.push({ pathname: '/appointments/[id]', params: { id: upcoming.id } })
            }
          />
        ) : null}
      </BackendGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  headerCopy: { flex: 1, gap: 2 },
  greeting: { ...Typography.caption },
  name: { ...Typography.title },
  search: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  searchText: { ...Typography.body, flex: 1 },
  emergency: {
    borderRadius: 18,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emergencyCopy: { flex: 1, gap: 2 },
  emergencyTitle: { ...Typography.bodyMedium, color: '#FFFFFF', fontWeight: '700' },
  emergencyBody: { ...Typography.caption, color: '#FFFFFF', opacity: 0.9 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  section: { ...Typography.subheading },
  sectionLink: { ...Typography.captionMedium },
});
