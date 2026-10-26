import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BackendGate } from '@/components/states/backend-gate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { StatusBadge } from '@/components/ui/status-badge';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { formatDateTime } from '@/utils/date';
import { statusLabel, statusTone } from '@/utils/appointments';

export default function BookSubmittedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      if (!id) return null;
      return patientApi.appointment(token, id);
    },
    [id, session],
  );

  if (!id) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Request Submitted' }} />
        <EmptyState
          title="Request not found"
          description="We could not locate this appointment request."
          actionLabel="Go to appointments"
          onAction={() => router.replace('/(tabs)/appointments')}
        />
      </Screen>
    );
  }

  const appointment = data;
  const isPending = appointment?.status === 'pending' || appointment?.status === 'reschedule_requested';

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Request Submitted', headerBackVisible: false }} />
      <View style={styles.hero}>
        <View style={[styles.check, { backgroundColor: colors.primary }]}>
          <Ionicons name="checkmark" size={32} color="#FFFFFF" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Request submitted</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {isPending
            ? 'Your appointment request was sent to the hospital. You will be notified once it is confirmed or updated.'
            : 'Your appointment has been confirmed by the hospital.'}
        </Text>
      </View>

      <BackendGate loading={loading} error={error} onRetry={refetch}>
        {appointment ? (
          <Card>
            <View style={styles.cardHeader}>
              <Text style={[styles.ref, { color: colors.text }]}>{appointment.reference}</Text>
              <StatusBadge label={statusLabel(appointment.status)} tone={statusTone(appointment.status)} />
            </View>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {appointment.doctorName} · {appointment.hospitalName}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {formatDateTime(appointment.startsAt)}
            </Text>
          </Card>
        ) : null}
      </BackendGate>

      <Button
        title="View appointment"
        onPress={() =>
          router.replace({ pathname: '/appointments/[id]', params: { id } })
        }
        style={styles.cta}
      />
      <Button
        title="Back to home"
        variant="ghost"
        onPress={() => router.replace('/(tabs)')}
        style={styles.secondary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Spacing.sm, marginTop: Spacing['2xl'], marginBottom: Spacing.xl },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: { ...Typography.title, textAlign: 'center' },
  subtitle: { ...Typography.caption, textAlign: 'center' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  ref: { ...Typography.subheading, flex: 1 },
  meta: { ...Typography.caption, marginTop: 2 },
  cta: { marginTop: Spacing.sm },
  secondary: { marginTop: Spacing.sm },
});
