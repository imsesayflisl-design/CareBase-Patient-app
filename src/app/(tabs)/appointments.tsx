import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppointmentCard } from '@/components/cards/appointment-card';
import { BackendGate } from '@/components/states/backend-gate';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { TabSelector, type Tab } from '@/components/ui/tab-selector';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import type { Appointment } from '@/types';
import { APPOINTMENT_GROUPS, groupAppointments, type AppointmentGroup } from '@/utils/appointments';

const EMPTY_COPY: Record<AppointmentGroup, { title: string; description: string }> = {
  upcoming: {
    title: 'No upcoming appointments',
    description: 'Book a visit and your confirmed appointments will appear here.',
  },
  pending: {
    title: 'No pending requests',
    description: 'Requests waiting for hospital confirmation will appear here.',
  },
  past: {
    title: 'No past appointments',
    description: 'Completed and past visits will be listed here.',
  },
  cancelled: {
    title: 'No cancelled appointments',
    description: 'Cancelled or declined appointments will be listed here.',
  },
};

export default function AppointmentsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [tab, setTab] = useState<AppointmentGroup>('upcoming');
  const firstFocus = useRef(true);

  const { data, loading, error, refetch } = useAsync(
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
      refetch();
    }, [refetch]),
  );

  const appointments: Appointment[] = data ?? [];
  const grouped = groupAppointments(appointments);

  const tabs: Tab[] = APPOINTMENT_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    count: grouped[group.key].length,
  }));

  const visible = grouped[tab];

  return (
    <Screen refreshing={loading} onRefresh={refetch}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.text }]}>Appointments</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Requests, confirmations, and past visits.
          </Text>
        </View>
        <IconButton
          icon="add"
          label="Book appointment"
          onPress={() => router.push('/appointments/book/hospital')}
        />
      </View>

      <TabSelector tabs={tabs} value={tab} onChange={(key) => setTab(key as AppointmentGroup)} />

      {!loading && !error && appointments.length === 0 ? (
        <EmptyState
          title="No appointments yet"
          description="Start by booking an appointment with a hospital or doctor."
          actionLabel="Book appointment"
          onAction={() => router.push('/appointments/book/hospital')}
        />
      ) : (
        <>
          <View style={styles.list}>
            <BackendGate
              loading={loading}
              error={error}
              onRetry={refetch}
              isEmpty={!loading && !error && visible.length === 0}
              emptyTitle={EMPTY_COPY[tab].title}
              emptyDescription={EMPTY_COPY[tab].description}>
              {visible.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onPress={() =>
                    router.push({ pathname: '/appointments/[id]', params: { id: appointment.id } })
                  }
                />
              ))}
            </BackendGate>
          </View>

          <Button
            title="Book new appointment"
            variant="outline"
            onPress={() => router.push('/appointments/book/hospital')}
            style={styles.cta}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  headerCopy: { flex: 1, gap: Spacing.xs },
  title: { ...Typography.title },
  subtitle: { ...Typography.caption },
  list: { gap: Spacing.md, marginTop: Spacing.lg },
  cta: { marginTop: Spacing.xl },
});
