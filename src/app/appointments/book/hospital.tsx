import { Stack, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HospitalCard } from '@/components/cards/hospital-card';
import { StepHeader } from '@/components/forms/step-indicator';
import { BackendGate } from '@/components/states/backend-gate';
import { Screen } from '@/components/ui/screen';
import { SearchBar } from '@/components/ui/search-bar';
import { Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { bookingDraftStore } from '@/lib/booking/draft';
import type { Hospital } from '@/types';

export default function BookHospitalScreen() {
  const router = useRouter();
  const session = useAuthSession();
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error, refetch } = useAsync(
    async () => {
      const token = await session.getToken();
      if (!token) throw new Error('Your session has expired. Please sign in again.');
      return patientApi.hospitals(token, { q: searchTerm || undefined });
    },
    [searchTerm, session],
  );

  const hospitals = data ?? [];

  const selectHospital = useCallback(
    (hospital: Hospital) => {
      bookingDraftStore.setHospital({
        id: hospital.id,
        name: hospital.name,
        address: hospital.address,
      });
      router.push('/appointments/book/doctor');
    },
    [router],
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Book Appointment' }} />
      <StepHeader
        step={1}
        total={5}
        title="Select a hospital"
        subtitle="Choose where you would like to be seen."
      />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search hospitals"
        onSubmit={() => setSearchTerm(query)}
      />

      <View style={styles.list}>
        <BackendGate
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={hospitals.length === 0}
          emptyTitle="No hospitals found"
          emptyDescription="Hospitals appear here once participating facilities publish their services.">
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onPress={() => selectHospital(hospital)}
            />
          ))}
        </BackendGate>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.md, marginTop: Spacing.lg },
});
