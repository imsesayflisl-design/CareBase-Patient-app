import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackendGate } from '@/components/states/backend-gate';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { AppointmentSlot } from '@/types';
import { formatTime, relativeDayLabel } from '@/utils/date';

type Props = {
  slots: AppointmentSlot[];
  value: string | null;
  onSelect: (slot: AppointmentSlot) => void;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

function periodFor(slot: AppointmentSlot): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date(slot.startsAt).getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function SlotPicker({
  slots,
  value,
  onSelect,
  loading,
  error,
  onRetry,
  emptyTitle = 'No times available',
  emptyDescription = 'Try another date or check back later. Only times returned by the hospital are shown.',
}: Props) {
  const { colors } = useTheme();

  const groups = [
    { key: 'morning', label: 'Morning', slots: slots.filter((slot) => periodFor(slot) === 'morning') },
    { key: 'afternoon', label: 'Afternoon', slots: slots.filter((slot) => periodFor(slot) === 'afternoon') },
    { key: 'evening', label: 'Evening', slots: slots.filter((slot) => periodFor(slot) === 'evening') },
  ];

  return (
    <BackendGate
      loading={loading}
      error={error}
      onRetry={onRetry}
      loadingCount={2}
      isEmpty={slots.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}>
      {slots[0] ? (
        <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
          {relativeDayLabel(slots[0].startsAt)}
        </Text>
      ) : null}
      {groups.map((group) => {
        if (group.slots.length === 0) return null;
        return (
          <View key={group.key} style={styles.group}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
              {group.label}
            </Text>
            <View style={styles.grid}>
              {group.slots.map((slot) => {
                const selected = slot.id === value;
                const disabled = !slot.available;
                return (
                  <Pressable
                    key={slot.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${formatTime(slot.startsAt)}${disabled ? ', unavailable' : ''}`}
                    accessibilityState={{ selected, disabled }}
                    disabled={disabled}
                    onPress={() => onSelect(slot)}
                    style={({ pressed }) => [
                      styles.slot,
                      {
                        backgroundColor: selected ? colors.primary : colors.card,
                        borderColor: selected ? colors.primary : colors.border,
                        opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.slotText,
                        { color: selected ? '#FFFFFF' : colors.text },
                      ]}>
                      {formatTime(slot.startsAt)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </BackendGate>
  );
}

const styles = StyleSheet.create({
  dayLabel: { ...Typography.captionMedium, marginBottom: Spacing.md },
  group: { marginBottom: Spacing.lg },
  groupLabel: {
    ...Typography.small,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  slot: {
    minWidth: 92,
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotText: { ...Typography.captionMedium, fontWeight: '600' },
});
