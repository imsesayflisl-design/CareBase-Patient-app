import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DateStrip } from '@/components/forms/date-strip';
import { SlotPicker } from '@/components/forms/slot-picker';
import { StepHeader } from '@/components/forms/step-indicator';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { bookingDraftStore, useBookingDraft } from '@/lib/booking/draft';
import type { AppointmentSlot } from '@/types';
import { formatDate, toISODate } from '@/utils/date';

export default function BookDateTimeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const draft = useBookingDraft();
  const doctor = draft.doctor;
  const [selectedDate, setSelectedDate] = useState<string>(() => toISODate(new Date()));

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      if (!doctor) return [] as AppointmentSlot[];
      return patientApi.doctorSlots(token, doctor.id, selectedDate);
    },
    [doctor?.id, selectedDate, session],
  );

  const slots = data ?? [];

  const selectDate = (date: string) => {
    setSelectedDate(date);
    if (draft.slot && toISODate(draft.slot.startsAt) !== date) {
      bookingDraftStore.setSlot(null);
    }
  };

  if (!doctor) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Date & Time' }} />
        <EmptyState
          title="Choose a doctor first"
          description="Select a hospital and doctor, then pick an available time."
          actionLabel="Start booking"
          onAction={() => router.replace('/appointments/book/hospital')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Date & Time' }} />
      <StepHeader
        step={3}
        total={5}
        title="Choose a date and time"
        subtitle={`${doctor.fullName} · ${doctor.specialty}`}
      />

      <DateStrip value={selectedDate} onChange={selectDate} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Available times</Text>
      <Text style={[styles.selectedDate, { color: colors.textSecondary }]}>
        {formatDate(selectedDate)}
      </Text>

      <View style={styles.slots}>
        <SlotPicker
          slots={slots}
          value={draft.slot?.id ?? null}
          loading={loading}
          error={error}
          onRetry={refetch}
          onSelect={(slot) =>
            bookingDraftStore.setSlot({ id: slot.id, startsAt: slot.startsAt, endsAt: slot.endsAt })
          }
        />
      </View>

      <Button
        title="Continue"
        disabled={!draft.slot}
        onPress={() => router.push('/appointments/book/details')}
        style={styles.cta}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...Typography.subheading, marginTop: Spacing.xl },
  selectedDate: { ...Typography.caption, marginTop: 2 },
  slots: { marginTop: Spacing.lg },
  cta: { marginTop: Spacing['2xl'] },
});
