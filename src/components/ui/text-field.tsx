import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  hint?: string;
  secureToggle?: boolean;
  secureTextEntry?: boolean;
  style?: object;
};

export function TextField({
  label,
  error,
  hint,
  secureToggle = false,
  secureTextEntry = false,
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
          secureTextEntry={hidden}
          style={[styles.input, { color: colors.text }, style]}
          {...(rest as any)}
        />
        {secureToggle ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8}>
            <Text style={{ color: colors.accent, ...Typography.captionMedium }}>
              {hidden ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.meta, { color: colors.error }]}>{error}</Text> : null}
      {!error && hint ? <Text style={[styles.meta, { color: colors.textSecondary }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  label: { ...Typography.formLabel },
  inputRow: {
    minHeight: 52,
    borderRadius: Spacing.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.formInput,
    paddingVertical: Spacing.md,
  },
  meta: { ...Typography.small },
});
