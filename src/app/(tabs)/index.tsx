import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppointmentCard } from '@/components/cards/appointment-card';
import { BackendGate } from '@/components/states/backend-gate';
import { IconButton } from '@/components/ui/icon-button';
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
  accent: string;
};

const QUICK_ACTIONS: Action[] = [
  { icon: 'medkit-outline', label: 'Hospitals', description: 'Nearby care', href: '/(tabs)/hospitals', accent: '#D5F1ED' },
  { icon: 'person-outline', label: 'Doctors', description: 'Book consult', href: '/doctors', accent: '#E0F2FE' },
  { icon: 'scan-outline', label: 'Scans', description: 'Diagnostics', href: '/scans', accent: '#FDE68A' },
  { icon: 'bag-handle-outline', label: 'Pharmacy', description: 'Get meds', href: '/pharmacies', accent: '#FCE7F3' },
];

const MANAGE_CARE: Action[] = [
  { icon: 'calendar-clear-outline', label: 'Appointments', description: 'Requests and visits', href: '/(tabs)/appointments', accent: '#D5F1ED' },
  { icon: 'folder-open-outline', label: 'Records', description: 'Tests and notes', href: '/(tabs)/records', accent: '#E2E8F0' },
  { icon: 'bed-outline', label: 'Beds', description: 'Admission support', href: '/beds', accent: '#E0F2FE' },
  { icon: 'pulse-outline', label: 'Vitals', description: 'Track health', href: '/health', accent: '#FEE2E2' },
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
    <View style={styles.actionGrid}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => router.push(action.href)}
          style={({ pressed }) => [
            styles.actionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <View style={[styles.actionIcon, { backgroundColor: action.accent }]}>
            <Ionicons name={action.icon} size={20} color={colors.primaryDeep} />
          </View>
          <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
          <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>{action.description}</Text>
        </Pressable>
      ))}
    </View>
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
        accessibilityLabel="Search healthcare providers"
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

      <View style={[styles.heroCard, { backgroundColor: colors.primaryDeep }]}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroBadge}>Care overview</Text>
          <Text style={styles.heroStatus}>Healthy</Text>
        </View>
        <Text style={styles.heroTitle}>Your care is on track</Text>
        <Text style={styles.heroBody}>
          {upcoming
            ? `Next appointment is ${new Date(upcoming.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}.`
            : 'No appointments scheduled yet. Book a visit when you need it.'}
        </Text>
        <View style={styles.heroBottomRow}>
          <View>
            <Text style={styles.heroMetricLabel}>Active care</Text>
            <Text style={styles.heroMetricValue}>{upcoming ? '1 visit' : '0 visits'}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/appointments/book/hospital')}
            style={({ pressed }) => [
              styles.heroButton,
              { opacity: pressed ? 0.9 : 1 },
            ]}>
            <Text style={styles.heroButtonText}>Book visit</Text>
          </Pressable>
        </View>
      </View>

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
        <Text style={[styles.section, { color: colors.text }]}>Quick care</Text>
      </View>
      {renderActions(QUICK_ACTIONS)}

      <View style={styles.sectionRow}>
        <Text style={[styles.section, { color: colors.text }]}>My care</Text>
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
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  heroBadge: {
    color: '#E6FFFB',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  heroStatus: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: Spacing.xs,
  },
  heroBody: {
    color: '#D9F7F2',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 260,
    marginBottom: Spacing.lg,
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  heroMetricLabel: {
    color: '#C7F3EC',
    fontSize: 12,
    fontWeight: '600',
  },
  heroMetricValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  heroButtonText: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '700',
  },
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
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    width: '48%',
    minHeight: 116,
    borderRadius: 18,
    borderWidth: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { ...Typography.bodyMedium, marginTop: Spacing.sm },
  actionDescription: { ...Typography.caption },
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
