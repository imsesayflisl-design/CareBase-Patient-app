import { Platform, type ColorValue } from 'react-native';
import { Colors, Brand } from './colors';

// Re-exported primitives — kept here because theme.ts historically declared
// the layout tokens inline rather than pulling from ./colors (the two files
// previously shared a single import surface).
export { Brand, Colors };
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const Radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const Metric = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const Typography = {
  display: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44 },
  title: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
  heading: { fontSize: 22, fontWeight: '600' as const, lineHeight: 30 },
  subheading: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  captionMedium: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  formLabel: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  formInput: { fontSize: 17, fontWeight: '400' as const, lineHeight: 22 },
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardSoft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

export const MaxContentWidth = 760;

export const BottomTabInset = Platform.select({ ios: 88, android: 72 }) ?? 72;
