import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { BackendGate } from '@/components/states/backend-gate';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { InfoRow } from '@/components/ui/info-row';
import { Screen } from '@/components/ui/screen';
import { StatusBadge } from '@/components/ui/status-badge';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { callPhone, openDirections } from '@/lib/maps/directions';
import { appointmentFeeLabel, statusLabel, statusTone } from '@/utils/appointments';
import { formatDateTime } from '@/utils/date';
import { visitTypeLabel } from '@/lib/booking/draft';

const CANCELLABLE = new Set(['pending', 'confirmed', 'reschedule_requested']);
const RESCHEDULABLE = new Set(['pending', 'confirmed', 'reschedule_requested']);

export default function AppointmentDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const firstFocus = useRef(true);

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      if (!id) return null;
      return patientApi.appointment(token, id);
    },
    [id, session],
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

  if (!id) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Appointment' }} />
        <EmptyState
          title="Appointment not found"
          description="This appointment may have been removed."
          actionLabel="Back to appointments"
          onAction={() => router.replace('/(tabs)/appointments')}
        />
      </Screen>
    );
  }

  const appointment = data;
  const canCancel = appointment ? CANCELLABLE.has(appointment.status) : false;
  const canReschedule = appointment ? RESCHEDULABLE.has(appointment.status) : false;

  const onDirections = async () => {
    if (!appointment) return;
    const opened = await openDirections({
      address: appointment.hospitalAddress,
      label: appointment.hospitalName,
    });
    if (!opened) {
      Alert.alert('Directions unavailable', 'This hospital has not published a location yet.');
    }
  };

  const onContact = async () => {
    const phone = appointment?.hospitalPhone;
    if (!phone) {
      Alert.alert('Phone unavailable', 'This hospital has not published a contact number yet.');
      return;
    }
    const opened = await callPhone(phone);
    if (!opened) {
      Alert.alert('Cannot place call', `Call the hospital on ${phone}.`);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Appointment' }} />
      <BackendGate loading={loading} error={error} onRetry={refetch}>
        {appointment ? (
          <View style={styles.wrap}>
            <View style={styles.heading}>
              <Text style={[styles.title, { color: colors.text }]}>
                {appointment.doctorName}
              </Text>
              <StatusBadge
                label={statusLabel(appointment.status)}
                tone={statusTone(appointment.status)}
              />
            </View>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              {appointment.hospitalName}
              {appointment.departmentName ? ` · ${appointment.departmentName}` : ''}
            </Text>

            {appointment.status === 'pending' || appointment.status === 'reschedule_requested' ? (
              <View style={[styles.notice, { backgroundColor: colors.softBackground }]}>
                <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                  This request is awaiting hospital confirmation. It is not a confirmed appointment
                  yet.
                </Text>
              </View>
            ) : null}

            <Card>
              <InfoRow label="Reference" value={appointment.reference} emphasize last={false} />
              <InfoRow label="Date & time" value={formatDateTime(appointment.startsAt)} />
              <InfoRow label="Visit type" value={visitTypeLabel(appointment.visitType)} />
              <InfoRow label="Reason" value={appointment.reason || 'Not provided'} />
              {appointment.notes ? <InfoRow label="Notes" value={appointment.notes} /> : null}
              <InfoRow
                label="Payment"
                value={appointment.paymentStatus ? statusLabel(appointment.paymentStatus) : 'Not required'}
              />
              <InfoRow label="Fee" value={appointmentFeeLabel(appointment) ?? 'Confirmed by hospital'} last />
            </Card>

            {appointment.hospitalAddress ? (
              <Card>
                <InfoRow label="Hospital location" value={appointment.hospitalAddress} emphasize last />
              </Card>
            ) : null}

            <View style={styles.actions}>
              <Button title="Get directions" variant="outline" onPress={onDirections} />
              <Button title="Contact hospital" variant="outline" onPress={onContact} />
              {canReschedule ? (
                <Button
                  title="Request reschedule"
                  variant="secondary"
                  onPress={() =>
                    router.push({ pathname: '/appointments/[id]/reschedule', params: { id } })
                  }
                />
              ) : null}
              {canCancel ? (
                <Button
                  title="Cancel appointment"
                  variant="danger"
                  onPress={() =>
                    router.push({ pathname: '/appointments/[id]/cancel', params: { id } })
                  }
                />
              ) : null}
            </View>
          </View>
        ) : null}
      </BackendGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.lg, marginTop: Spacing.sm },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  title: { ...Typography.title, flex: 1 },
  sub: { ...Typography.caption, marginTop: -Spacing.sm },
  notice: { borderRadius: 12, padding: Spacing.md },
  noticeText: { ...Typography.small },
  actions: { gap: Spacing.sm, marginTop: Spacing.sm },
});
