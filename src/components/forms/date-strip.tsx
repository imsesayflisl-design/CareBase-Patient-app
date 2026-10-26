import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  addDays,
  dayNumber,
  isToday,
  monthLabel,
  startOfDay,
  toISODate,
  weekdayShort,
} from '@/utils/date';

type Props = {
  value: string | null;
  onChange: (isoDate: string) => void;
  disablePast?: boolean;
};

export function DateStrip({ value, onChange, disablePast = true }: Props) {
  const { colors } = useTheme();
  const [weekOffset, setWeekOffset] = useState(0);

  const days = useMemo(() => {
    const base = addDays(startOfDay(new Date()), weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => addDays(base, index));
  }, [weekOffset]);

  const canGoBack = weekOffset > 0;

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous week"
          accessibilityState={{ disabled: !canGoBack }}
          onPress={() => canGoBack && setWeekOffset((offset) => offset - 1)}
          disabled={!canGoBack}
          style={({ pressed }) => [
            styles.chevron,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: !canGoBack ? 0.35 : pressed ? 0.6 : 1,
            },
          ]}>
          <Ionicons name="chevron-back" size={19} color={colors.text} />
        </Pressable>
        <Text style={[styles.month, { color: colors.text }]}>{monthLabel(days[0])}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next week"
          onPress={() => setWeekOffset((offset) => offset + 1)}
          style={({ pressed }) => [
            styles.chevron,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}>
          <Ionicons name="chevron-forward" size={19} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.row}>
        {days.map((day) => {
          const iso = toISODate(day);
          const selected = iso === value;
          const today = isToday(day);
          const disabled = disablePast && startOfDay(day).getTime() < startOfDay(new Date()).getTime();

          return (
            <Pressable
              key={iso}
              accessibilityRole="button"
              accessibilityLabel={day.toLocaleDateString(undefined, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() => onChange(iso)}
              style={({ pressed }) => [
                styles.day,
                {
                  backgroundColor: selected ? colors.primary : colors.card,
                  borderColor: selected
                    ? colors.primary
                    : today
                      ? colors.primary
                      : colors.border,
                  opacity: disabled ? 0.35 : pressed ? 0.7 : 1,
                },
              ]}>
              <Text
                style={[
                  styles.weekday,
                  { color: selected ? '#FFFFFF' : colors.textSecondary },
                ]}>
                {weekdayShort(day)}
              </Text>
              <Text
                style={[
                  styles.number,
                  { color: selected ? '#FFFFFF' : colors.text },
                ]}>
                {dayNumber(day)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  month: { ...Typography.subheading },
  chevron: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', gap: Spacing.xs, justifyContent: 'space-between' },
  day: {
    flex: 1,
    minHeight: 66,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  weekday: { ...Typography.small },
  number: { ...Typography.bodyMedium, fontWeight: '700' },
});
