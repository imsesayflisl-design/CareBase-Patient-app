import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppointmentCard } from '@/components/cards/appointment-card';
import { BackendGate } from '@/components/states/backend-gate';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { Radius, Spacing, Typography } from '@/constants/theme';
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
  { icon: 'medkit-outline', label: 'Hospitals', description: 'Nearby care', href: '/(tabs)/hospitals', accent: '#F3F4F6' },
  { icon: 'person-outline', label: 'Doctors', description: 'Book consult', href: '/doctors', accent: '#EEF2FF' },
  { icon: 'scan-outline', label: 'Scans', description: 'Diagnostics', href: '/scans', accent: '#F5F3FF' },
  { icon: 'bag-handle-outline', label: 'Pharmacy', description: 'Get meds', href: '/pharmacies', accent: '#F8FAFC' },
];

const MANAGE_CARE: Action[] = [
  { icon: 'calendar-clear-outline', label: 'Appointments', description: 'Requests and visits', href: '/(tabs)/appointments', accent: '#F3F4F6' },
  { icon: 'folder-open-outline', label: 'Records', description: 'Tests and notes', href: '/(tabs)/records', accent: '#F8FAFC' },
  { icon: 'bed-outline', label: 'Beds', description: 'Admission support', href: '/beds', accent: '#EEF2FF' },
  { icon: 'pulse-outline', label: 'Vitals', description: 'Track health', href: '/health', accent: '#F5F3FF' },
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
    }, [appointments]),
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
        <View style={styles.brandBlock}>
          <View style={[styles.brandMark, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="medical" size={16} color={colors.primaryDeep} />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greetingForHour(new Date().getHours())}
            </Text>
            <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          </View>
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

      <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <View style={[styles.heroTopRow, { borderBottomColor: colors.border }]}>
          <Text style={styles.heroBadge}>Overview</Text>
          <View style={styles.heroStatusPill}>
            <Text style={styles.heroStatus}>Healthy</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Your care plan is on track</Text>
        <Text style={styles.heroBody}>
          {upcoming
            ? `Next appointment is ${new Date(upcoming.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}.`
            : 'No appointments scheduled yet. Book a visit when you need it.'}
        </Text>

        <View style={styles.heroMetrics}>
          <View style={styles.metricBubble}>
            <Text style={styles.metricLabel}>Care score</Text>
            <Text style={styles.metricValue}>96%</Text>
          </View>
          <View style={styles.metricBubble}>
            <Text style={styles.metricLabel}>Active care</Text>
            <Text style={styles.metricValue}>{upcoming ? '1 visit' : '0 visits'}</Text>
          </View>
        </View>

        <View style={styles.heroBottomRow}>
          <View>
            <Text style={styles.heroMetricLabel}>Next visit</Text>
            <Text style={styles.heroMetricValue}>
              {upcoming ? 'Tomorrow' : 'No visit booked'}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/appointments/book/hospital')}
            style={({ pressed }) => [
              styles.heroButton,
              { opacity: pressed ? 0.92 : 1 },
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
        <View style={styles.emergencyIconWrap}>
          <Ionicons name="medkit" size={20} color="#FFFFFF" />
        </View>
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
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2 },
  greeting: { ...Typography.caption },
  name: { ...Typography.title },
  search: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  searchText: { ...Typography.body, flex: 1 },
  heroCard: {
    position: 'relative',
    borderRadius: 28,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  heroGlow: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    zIndex: 1,
  },
  heroBadge: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroStatusPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroStatus: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: Spacing.xs,
    maxWidth: 260,
    zIndex: 1,
  },
  heroBody: {
    color: '#D1D5DB',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 270,
    marginBottom: Spacing.lg,
    zIndex: 1,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    zIndex: 1,
  },
  metricBubble: {
    flex: 1,
    minHeight: 72,
    borderRadius: 16,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
    zIndex: 1,
  },
  heroMetricLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
  },
  heroMetricValue: {
    color: '#FFFFFF',
    fontSize: 18,
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
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  emergency: {
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emergencyIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
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
    minHeight: 104,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
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
