import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { InfoRow } from '@/components/ui/info-row';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Row = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  rows: Row[];
};

export function OrderSummary({ title, rows }: Props) {
  const { colors } = useTheme();

  return (
    <Card>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View>
        {rows.map((row, index) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value}
            last={index === rows.length - 1}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { ...Typography.subheading, marginBottom: Spacing.sm },
});
