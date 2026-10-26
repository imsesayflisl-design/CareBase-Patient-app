import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { DateStrip } from '@/components/forms/date-strip';
import { SlotPicker } from '@/components/forms/slot-picker';
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
import type { AppointmentSlot } from '@/types';
import { formatDate, formatDateTime, toISODate } from '@/utils/date';

export default function RescheduleAppointmentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedDate, setSelectedDate] = useState<string>(() => toISODate(new Date()));
  const [slotId, setSlotId] = useState<string | null>(null);

  const appointmentState = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      if (!id) return null;
      return patientApi.appointment(token, id);
    },
    [id, session],
  );

  const appointment = appointmentState.data;

  const slotsState = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      if (!appointment) return [] as AppointmentSlot[];
      return patientApi.doctorSlots(token, appointment.doctorId, selectedDate);
    },
    [appointment?.doctorId, selectedDate, session],
  );

  const reschedule = useMutation(async () => {
    const token = await session.getToken();
    if (!token) throw new Error('Your session has expired. Please sign in again.');
    if (!id || !slotId) throw new Error('Select a new time first.');
    return patientApi.rescheduleAppointment(token, id, slotId);
  });

  if (!id) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Reschedule' }} />
        <EmptyState
          title="Appointment not found"
          description="We could not locate this appointment."
          actionLabel="Back to appointments"
          onAction={() => router.replace('/(tabs)/appointments')}
        />
      </Screen>
    );
  }

  const submit = async () => {
    try {
      await reschedule.run();
      Alert.alert(
        'Reschedule requested',
        'The hospital will review your new time and update the appointment. You will be notified of the decision.',
        [
          {
            text: 'OK',
            onPress: () => router.replace({ pathname: '/appointments/[id]', params: { id } }),
          },
        ],
      );
    } catch (err) {
      Alert.alert(
        'Could not request reschedule',
        err instanceof Error ? err.message : 'Please try again in a moment.',
      );
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Reschedule' }} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Request a new time</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Only times returned by the hospital are shown. Your appointment stays pending until the
          hospital confirms the change.
        </Text>
      </View>

      <BackendGate
        loading={appointmentState.loading}
        error={appointmentState.error}
        onRetry={appointmentState.refetch}>
        {appointment ? (
          <Card>
            <InfoRow label="Current" value={formatDateTime(appointment.startsAt)} emphasize last={false} />
            <InfoRow label="Doctor" value={appointment.doctorName} />
            <InfoRow label="Hospital" value={appointment.hospitalName} last />
          </Card>
        ) : null}
      </BackendGate>

      {appointment ? (
        <View style={styles.picker}>
          <DateStrip value={selectedDate} onChange={setSelectedDate} />
          <Text style={[styles.selectedDate, { color: colors.textSecondary }]}>
            Showing availability for {formatDate(selectedDate)}
          </Text>
          <SlotPicker
            slots={slotsState.data ?? []}
            value={slotId}
            loading={slotsState.loading}
            error={slotsState.error}
            onRetry={slotsState.refetch}
            onSelect={(slot: AppointmentSlot) => setSlotId(slot.id)}
          />
        </View>
      ) : null}

      <Button
        title="Request reschedule"
        disabled={!slotId}
        loading={reschedule.loading}
        onPress={submit}
        style={styles.cta}
      />
      <Button title="Keep current time" variant="ghost" onPress={() => router.back()} style={styles.secondary} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.xs, marginTop: Spacing.lg, marginBottom: Spacing.xl },
  title: { ...Typography.title },
  sub: { ...Typography.caption },
  picker: { marginTop: Spacing.xl },
  selectedDate: { ...Typography.caption, marginTop: Spacing.lg, marginBottom: Spacing.lg },
  cta: { marginTop: Spacing.xl },
  secondary: { marginTop: Spacing.sm },
});
