import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Doctor } from '@/types';

type Props = {
  doctor: Doctor;
  onPress?: () => void;
};

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return [parts[0], parts[parts.length - 1]]
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function DoctorCard({ doctor, onPress }: Props) {
  const { colors } = useTheme();

  const fee =
    doctor.consultationFee != null
      ? `${doctor.currency ?? ''} ${doctor.consultationFee.toFixed(2)}`.trim()
      : null;

  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.initials, { color: colors.primaryDeep }]}>
            {initials(doctor.fullName)}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {doctor.fullName}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
            {doctor.specialty}
            {doctor.hospitalName ? ` · ${doctor.hospitalName}` : ''}
          </Text>
          <View style={styles.badges}>
            {doctor.available ? <StatusBadge label="Available" tone="success" /> : null}
            {doctor.yearsExperience != null ? (
              <StatusBadge label={`${doctor.yearsExperience} yrs`} tone="neutral" />
            ) : null}
            {fee ? <StatusBadge label={fee} tone="primary" /> : null}
          </View>
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
  meta: { ...Typography.caption },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
