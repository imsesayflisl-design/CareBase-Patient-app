import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { BackendGate } from '@/components/states/backend-gate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { InfoRow } from '@/components/ui/info-row';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync, useMutation } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { formatDateTime } from '@/utils/date';

export default function CancelAppointmentScreen() {
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

  const cancel = useMutation(async () => {
    const token = await session.getToken();
    if (!token) throw new Error('Your session has expired. Please sign in again.');
    if (!id) throw new Error('Appointment not found.');
    return patientApi.cancelAppointment(token, id);
  });

  if (!id) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Cancel Appointment' }} />
        <EmptyState
          title="Appointment not found"
          description="We could not locate this appointment."
          actionLabel="Back to appointments"
          onAction={() => router.replace('/(tabs)/appointments')}
        />
      </Screen>
    );
  }

  const performCancel = async () => {
    try {
      await cancel.run();
      Alert.alert(
        'Appointment cancelled',
        'The appointment has been cancelled and the hospital has been notified.',
        [
          {
            text: 'OK',
            onPress: () => router.replace({ pathname: '/appointments/[id]', params: { id } }),
          },
        ],
      );
    } catch (err) {
      Alert.alert(
        'Could not cancel',
        err instanceof Error ? err.message : 'Please try again in a moment.',
      );
    }
  };

  const confirm = () => {
    Alert.alert(
      'Cancel this appointment?',
      'This will notify the hospital and cannot be undone. You can book a new appointment at any time.',
      [
        { text: 'Keep appointment', style: 'cancel' },
        { text: 'Yes, cancel', style: 'destructive', onPress: performCancel },
      ],
    );
  };

  const appointment = data;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Cancel Appointment' }} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Cancel appointment</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Please review the appointment before cancelling.
        </Text>
      </View>

      <BackendGate loading={loading} error={error} onRetry={refetch}>
        {appointment ? (
          <Card>
            <InfoRow label="Reference" value={appointment.reference} emphasize last={false} />
            <InfoRow label="Doctor" value={appointment.doctorName} />
            <InfoRow label="Hospital" value={appointment.hospitalName} />
            <InfoRow label="Date & time" value={formatDateTime(appointment.startsAt)} last />
          </Card>
        ) : null}
      </BackendGate>

      <Text style={[styles.warning, { color: colors.error }]}>
        Cancellation rules are applied by the hospital. Some services may not be refundable.
      </Text>

      <Button
        title="Yes, cancel appointment"
        variant="danger"
        loading={cancel.loading}
        onPress={confirm}
        style={styles.cta}
      />
      <Button
        title="Keep appointment"
        variant="ghost"
        onPress={() => router.back()}
        style={styles.secondary}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.xs, marginTop: Spacing.lg, marginBottom: Spacing.xl },
  title: { ...Typography.title },
  sub: { ...Typography.caption },
  warning: { ...Typography.caption, marginTop: Spacing.lg },
  cta: { marginTop: Spacing.xl },
  secondary: { marginTop: Spacing.sm },
});
