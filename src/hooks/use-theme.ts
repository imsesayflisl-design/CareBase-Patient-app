import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppearanceStore } from '@/lib/storage/appearance';

export function useTheme() {
  const systemScheme = useColorScheme();
  const preference = useAppearanceStore((s) => s.preference);

  const resolved =
    preference === 'system'
      ? systemScheme === 'unspecified'
        ? 'light'
        : systemScheme
      : preference;

  return {
    colors: Colors[resolved],
    scheme: resolved,
    isDark: resolved === 'dark',
  };
}
