import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Hospital } from '@/types';

type Props = {
  hospital: Hospital;
  onPress?: () => void;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function HospitalCard({ hospital, onPress }: Props) {
  const { colors } = useTheme();
  const distance = hospital.distanceKm != null ? `${hospital.distanceKm.toFixed(1)} km` : null;

  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.initials, { color: colors.primaryDeep }]}>
            {initials(hospital.name)}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {hospital.name}
          </Text>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={2}>
              {hospital.address}
              {distance ? ` · ${distance}` : ''}
            </Text>
          </View>
          {hospital.hasEmergency || hospital.bedAvailabilitySummary ? (
            <View style={styles.badges}>
              {hospital.hasEmergency ? <StatusBadge label="Emergency" tone="error" /> : null}
              {hospital.bedAvailabilitySummary ? (
                <StatusBadge label={hospital.bedAvailabilitySummary} tone="info" />
              ) : null}
            </View>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  initials: { ...Typography.captionMedium, fontWeight: '700' },
  content: { flex: 1, gap: 4 },
  name: { ...Typography.subheading },
  location: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  meta: { ...Typography.caption, flex: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
