import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isBackendConfigured } from '@/lib/config';
import { BackendUnavailableError } from '@/lib/api/client';

type Props = {
  loading?: boolean;
  error?: unknown;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRetry?: () => void;
  loadingCount?: number;
  children: React.ReactNode;
  isEmpty?: boolean;
};

export function BackendGate({
  loading,
  error,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  loadingCount = 3,
  children,
  isEmpty,
}: Props) {
  const { colors } = useTheme();

  if (!isBackendConfigured()) {
    return (
      <View style={styles.box}>
        <Text style={[styles.title, { color: colors.text }]}>Waiting for CareBase backend</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Set EXPO_PUBLIC_API_URL to your CareBase API. This screen will load live hospital,
          pharmacy, and medical data once the shared backend is connected. No placeholder
          healthcare data is shown.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View>
        {Array.from({ length: loadingCount }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </View>
    );
  }

  if (error) {
    const message =
      error instanceof BackendUnavailableError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unable to load data.';
    return (
      <EmptyState
        title="Couldn’t load data"
        description={message}
        actionLabel={onRetry ? 'Retry' : undefined}
        onAction={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction ?? onRetry}
      />
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  box: {
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  title: { ...Typography.subheading },
  body: { ...Typography.caption },
});
