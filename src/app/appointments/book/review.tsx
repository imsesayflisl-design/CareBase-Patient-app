import { Stack, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text } from 'react-native';

import { OrderSummary } from '@/components/forms/order-summary';
import { StepHeader } from '@/components/forms/step-indicator';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useMutation } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { bookingDraftStore, useBookingDraft, visitTypeLabel } from '@/lib/booking/draft';
import { formatDateTime } from '@/utils/date';

export default function BookReviewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const draft = useBookingDraft();

  const submit = useMutation(async () => {
    const token = await session.getToken();
    if (!token) throw new Error('Your session has expired. Please sign in again.');
    if (!draft.hospital || !draft.doctor || !draft.slot) {
      throw new Error('Your booking is missing information.');
    }
    return patientApi.createAppointment(token, {
      hospitalId: draft.hospital.id,
      doctorId: draft.doctor.id,
      slotId: draft.slot.id,
      visitType: draft.visitType,
      reason: draft.reason || undefined,
      notes: draft.notes || undefined,
    });
  });

  if (!draft.hospital || !draft.doctor || !draft.slot) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Review' }} />
        <EmptyState
          title="Your booking is incomplete"
          description="Please choose a hospital, doctor, and time before reviewing your request."
          actionLabel="Start booking"
          onAction={() => router.replace('/appointments/book/hospital')}
        />
      </Screen>
    );
  }

  const onConfirm = async () => {
    try {
      const appointment = await submit.run();
      bookingDraftStore.reset();
      router.replace({
        pathname: '/appointments/book/submitted',
        params: { id: appointment.id },
      });
    } catch (error) {
      Alert.alert(
        'Could not submit request',
        error instanceof Error ? error.message : 'Please try again in a moment.',
      );
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Review' }} />
      <StepHeader
        step={5}
        total={5}
        title="Review your request"
        subtitle="Confirm the details before sending them to the hospital."
      />

      <OrderSummary
        title="Appointment details"
        rows={[
          { label: 'Hospital', value: draft.hospital.name },
          { label: 'Doctor', value: `${draft.doctor.fullName} · ${draft.doctor.specialty}` },
          { label: 'Date & time', value: formatDateTime(draft.slot.startsAt) },
          { label: 'Type', value: visitTypeLabel(draft.visitType) },
          { label: 'Reason', value: draft.reason || 'Not provided' },
          { label: 'Notes', value: draft.notes || 'None' },
          {
            label: 'Consultation fee',
            value:
              draft.doctor.consultationFee != null
                ? `${draft.doctor.currency ?? ''} ${draft.doctor.consultationFee.toFixed(2)}`.trim()
                : 'Confirmed by hospital',
          },
        ]}
      />

      <Text style={[styles.notice, { color: colors.textSecondary }]}>
        Your request is sent to the hospital for confirmation. It is not a confirmed appointment
        until the hospital accepts it.
      </Text>

      <Button
        title="Submit request"
        loading={submit.loading}
        onPress={onConfirm}
        style={styles.cta}
      />
      <Button
        title="Back"
        variant="ghost"
        onPress={() => router.back()}
        style={styles.back}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { ...Typography.caption, marginTop: Spacing.lg },
  cta: { marginTop: Spacing.xl },
  back: { marginTop: Spacing.sm },
});
