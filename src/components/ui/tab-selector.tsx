import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Tab = {
  key: string;
  label: string;
  count?: number;
};

type Props = {
  tabs: Tab[];
  value: string;
  onChange: (key: string) => void;
};

export function TabSelector({ tabs, value, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.track, { backgroundColor: colors.softBackground }]}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tab,
              active
                ? { backgroundColor: colors.card, borderColor: colors.border }
                : { backgroundColor: 'transparent', borderColor: 'transparent' },
            ]}>
            <Text style={[styles.label, { color: active ? colors.text : colors.textSecondary }]}>
              {tab.label}
            </Text>
            {tab.count != null ? (
              <View
                style={[
                  styles.count,
                  { backgroundColor: active ? colors.primarySoft : colors.card },
                ]}>
                <Text
                  style={[
                    styles.countText,
                    { color: active ? colors.primaryDeep : colors.textSecondary },
                  ]}>
                  {tab.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  track: {
    gap: 2,
    padding: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  tab: {
    minHeight: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: { ...Typography.captionMedium },
  count: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countText: { ...Typography.small, fontWeight: '700' },
});
