import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { visitTypeLabel } from '@/lib/booking/draft';
import type { Appointment } from '@/types';
import { statusLabel, statusTone } from '@/utils/appointments';
import { formatTime } from '@/utils/date';

type Props = {
  appointment: Appointment;
  onPress?: () => void;
};

export function AppointmentCard({ appointment, onPress }: Props) {
  const { colors } = useTheme();
  const when = new Date(appointment.startsAt);

  const weekday = when.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const month = when.toLocaleDateString(undefined, { month: 'short' });

  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={[styles.date, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.weekday, { color: colors.primaryDeep }]}>{weekday}</Text>
          <Text style={[styles.day, { color: colors.primaryDeep }]}>{when.getDate()}</Text>
          <Text style={[styles.month, { color: colors.primaryDeep }]}>{month}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {appointment.doctorName}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
          <Text style={[styles.hospital, { color: colors.textSecondary }]} numberOfLines={1}>
            {appointment.hospitalName}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.time, { color: colors.textSecondary }]} numberOfLines={1}>
              {formatTime(appointment.startsAt)} · {visitTypeLabel(appointment.visitType)}
            </Text>
          </View>
          <View style={styles.footer}>
            <StatusBadge
              label={statusLabel(appointment.status)}
              tone={statusTone(appointment.status)}
            />
            <Text style={[styles.reference, { color: colors.textSecondary }]}>
              {appointment.reference}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md },
  date: {
    width: 56,
    minHeight: 74,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  weekday: { ...Typography.small, fontWeight: '700', letterSpacing: 0.6 },
  day: { fontSize: 22, lineHeight: 27, fontWeight: '700' },
  month: { ...Typography.small, fontWeight: '600' },
  content: { flex: 1, gap: 3 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: { ...Typography.subheading, flex: 1 },
  hospital: { ...Typography.caption },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  time: { ...Typography.caption, flex: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  reference: { ...Typography.small },
});
