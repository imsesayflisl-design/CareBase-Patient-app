import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { StepHeader } from '@/components/forms/step-indicator';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { bookingDraftStore, useBookingDraft, VISIT_TYPES } from '@/lib/booking/draft';

export default function BookDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const draft = useBookingDraft();
  const [visitType, setVisitType] = useState(draft.visitType || 'in_person');
  const [reason, setReason] = useState(draft.reason);
  const [notes, setNotes] = useState(draft.notes);

  if (!draft.slot || !draft.doctor) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Visit Details' }} />
        <EmptyState
          title="Your booking is incomplete"
          description="Please choose a hospital, doctor, and time before adding visit details."
          actionLabel="Start booking"
          onAction={() => router.replace('/appointments/book/hospital')}
        />
      </Screen>
    );
  }

  const save = () => {
    bookingDraftStore.setVisitDetails({ visitType, reason: reason.trim(), notes: notes.trim() });
    router.push('/appointments/book/review');
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Visit Details' }} />
      <StepHeader
        step={4}
        total={5}
        title="Visit details"
        subtitle="This helps the hospital prepare for your visit."
      />

      <Text style={[styles.label, { color: colors.text }]}>Appointment type</Text>
      <View style={styles.chips}>
        {VISIT_TYPES.map((type) => (
          <Button
            key={type.value}
            title={type.label}
            fullWidth={false}
            variant={visitType === type.value ? 'primary' : 'outline'}
            onPress={() => setVisitType(type.value)}
            style={styles.chip}
          />
        ))}
      </View>

      <View style={styles.form}>
        <TextField
          label="Reason for visit (optional)"
          value={reason}
          onChangeText={setReason}
          placeholder="e.g. Persistent headache"
          hint="Share only what you are comfortable with."
        />
        <TextField
          label="Notes for the clinician (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.multiline}
        />
        <Button title="Review request" onPress={save} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { ...Typography.label, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, minHeight: 44 },
  form: { gap: Spacing.lg, marginTop: Spacing.xl },
  multiline: { minHeight: 96, textAlignVertical: 'top', paddingTop: Spacing.md },
});
