import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { Radius, Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
};

export function TextField({
  label,
  error,
  hint,
  secureToggle,
  secureTextEntry,
  style,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
          },
        ]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          style={[styles.input, { color: colors.text }, style]}
          {...rest}
        />
        {secureToggle ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8}>
            <Text style={{ color: colors.primary, ...Typography.captionMedium }}>
              {hidden ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.meta, { color: colors.error }]}>{error}</Text> : null}
      {!error && hint ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  label: { ...Typography.label },
  inputRow: {
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    paddingVertical: Spacing.md,
  },
  meta: { ...Typography.small },
});
