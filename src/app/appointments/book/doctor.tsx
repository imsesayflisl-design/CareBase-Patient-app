import { Stack, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DoctorCard } from '@/components/cards/doctor-card';
import { StepHeader } from '@/components/forms/step-indicator';
import { BackendGate } from '@/components/states/backend-gate';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Screen } from '@/components/ui/screen';
import { Spacing, Typography } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { bookingDraftStore, useBookingDraft } from '@/lib/booking/draft';
import type { Doctor } from '@/types';

export default function BookDoctorScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const draft = useBookingDraft();
  const hospital = draft.hospital;
  const [departmentId, setDepartmentId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      if (!hospital) return { doctors: [] as Doctor[], departments: [] as { id: string; name: string }[] };
      const [doctors, hospitalDetail] = await Promise.all([
        patientApi.doctors(token, { hospitalId: hospital.id }),
        patientApi.hospital(token, hospital.id),
      ]);
      return { doctors, departments: hospitalDetail.departments ?? [] };
    },
    [hospital?.id, session],
  );

  const doctors = data?.doctors ?? [];
  const departments = data?.departments ?? [];

  const filtered = useMemo(
    () => (departmentId ? doctors.filter((d) => d.departmentId === departmentId) : doctors),
    [doctors, departmentId],
  );

  const selectDoctor = useCallback(
    (doctor: Doctor) => {
      bookingDraftStore.setDoctor({
        id: doctor.id,
        fullName: doctor.fullName,
        specialty: doctor.specialty,
        hospitalName: doctor.hospitalName,
        consultationFee: doctor.consultationFee,
        currency: doctor.currency,
      });
      router.push('/appointments/book/datetime');
    },
    [router],
  );

  if (!hospital) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Select Doctor' }} />
        <EmptyState
          title="Choose a hospital first"
          description="Select the hospital you want to visit, then pick a department and doctor."
          actionLabel="Select hospital"
          onAction={() => router.replace('/appointments/book/hospital')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Select Doctor' }} />
      <StepHeader
        step={2}
        total={5}
        title="Select a doctor"
        subtitle={hospital.name}
      />

      <Pressable onPress={() => router.replace('/appointments/book/hospital')}>
        <Text style={[styles.change, { color: colors.primary }]}>Change hospital</Text>
      </Pressable>

      {departments.length > 0 ? (
        <View style={styles.chips}>
          <Button
            title="All departments"
            fullWidth={false}
            variant={departmentId === null ? 'primary' : 'outline'}
            onPress={() => setDepartmentId(null)}
            style={styles.chip}
          />
          {departments.map((department) => (
            <Button
              key={department.id}
              title={department.name}
              fullWidth={false}
              variant={departmentId === department.id ? 'primary' : 'outline'}
              onPress={() => setDepartmentId(department.id)}
              style={styles.chip}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.list}>
        <BackendGate
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={filtered.length === 0}
          emptyTitle="No doctors available"
          emptyDescription="Doctors appear here once the hospital publishes their departments and availability.">
          {filtered.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onPress={() => selectDoctor(doctor)} />
          ))}
        </BackendGate>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  change: { ...Typography.captionMedium, marginBottom: Spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  chip: { paddingHorizontal: Spacing.md, minHeight: 44 },
  list: { gap: Spacing.md },
});
