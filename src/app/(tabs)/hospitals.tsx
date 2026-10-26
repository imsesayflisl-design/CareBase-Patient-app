import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HospitalCard } from '@/components/cards/hospital-card';
import { BackendGate } from '@/components/states/backend-gate';
import { Screen } from '@/components/ui/screen';
import { SearchBar } from '@/components/ui/search-bar';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { patientApi } from '@/lib/api/patient';
import { useAuthSession } from '@/lib/auth/session';
import { isBackendConfigured } from '@/lib/config';
import type { Hospital } from '@/types';

export default function HospitalsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useAuthSession();
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(async () => {
    if (!isBackendConfigured()) {
      setHospitals([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await session.getToken();
      const data = await patientApi.hospitals(token ?? '', { q: searchTerm || undefined });
      setHospitals(data);
    } catch (e) {
      setError(e);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, session]);

  useEffect(() => {
    load();
  }, [load]);

  const hasQuery = searchTerm.length > 0;

  return (
    <Screen refreshing={loading} onRefresh={load}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Hospitals</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find care near you, from emergency units to specialist clinics.
        </Text>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search by hospital or city"
        onSubmit={() => setSearchTerm(query.trim())}
      />

      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          {hasQuery ? 'Search results' : 'All hospitals'}
        </Text>
        {!loading && !error ? (
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {hospitals.length} {hospitals.length === 1 ? 'hospital' : 'hospitals'}
          </Text>
        ) : null}
      </View>

      <BackendGate
        loading={loading}
        error={error}
        onRetry={load}
        isEmpty={hospitals.length === 0}
        emptyTitle={hasQuery ? 'No hospitals found' : 'No hospitals yet'}
        emptyDescription={
          hasQuery
            ? 'Try a different hospital name or city.'
            : 'Hospitals appear here once facilities join CareBase and publish their services.'
        }>
        <View style={styles.list}>
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onPress={() => router.push(`/hospitals/${hospital.id}`)}
            />
          ))}
        </View>
      </BackendGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: Spacing.sm, marginBottom: Spacing.lg, gap: Spacing.xs },
  title: { ...Typography.title },
  subtitle: { ...Typography.caption },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  listTitle: { ...Typography.subheading },
  count: { ...Typography.small },
  list: { gap: Spacing.md },
});
