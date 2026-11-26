/**
 * CareBase brand palette — inspired by Apple system colors.
 * Flat slate base with health-metric accents: heart-rate red, oxygen blue, activity green.
 */
export const Brand = {
  primary: '#0F172A',      // slate-900 — primary brand color
  deepSlate: '#020617',    // slate-950 — deep backgrounds
  accent: '#2563EB',       // blue-600 — single action accent
  darkText: '#0F172A',     // slate-900
  secondaryText: '#64748B', // slate-500
  background: '#FFFFFF',   // pure white — light mode background
  softBackground: '#F8FAFC', // slate-50
  card: '#FFFFFF',         // card surfaces
  border: '#E2E8F0',       // slate-200
  error: '#DC2626',        // red-600
  info: '#2563EB',         // blue-600 (single neutral accent)
  white: '#FFFFFF',
  black: '#000000',

  // Health-metric accent tokens
  hrRed: '#EF4444',        // heart-rate accent
  o2Blue: '#3B82F6',        // oxygen saturation accent
  activityGreen: '#22C55E', // daily activity accent
  metricSoft: '#FEE2E2',    // soft red-200 for HR card fills
  o2Soft: '#DBEAFE',         // soft blue-200 for O2 card fills
  activitySoft: '#DCFCE7',  // soft green-200 for activity card fills
} as const;

export const Colors = {
  light: {
    text: Brand.darkText,
    textSecondary: Brand.secondaryText,
    background: Brand.background,
    softBackground: Brand.softBackground,
    card: Brand.card,
    border: Brand.border,
    primary: Brand.primary,
    primaryDeep: Brand.deepSlate,
    primarySoft: '#F1F5F9',
    accent: Brand.accent,
    success: Brand.accent,
    successSoft: '#DBEAFE',
    warning: '#B45309',     // slate-700
    warningSoft: '#FEF3C7', // amber-200
    error: Brand.error,
    errorSoft: '#FEE2E2',    // red-200
    emergency: Brand.error,
    info: Brand.info,
    infoSoft: '#DBEAFE',
    tabInactive: Brand.secondaryText,
    tabActive: Brand.primary,
    overlay: 'rgba(15, 23, 42, 0.45)',
    skeleton: '#E2E8F0',
    inputBackground: '#F8FAFC',
    hrRed: Brand.hrRed,
    o2Blue: Brand.o2Blue,
    activityGreen: Brand.activityGreen,
    metricSoft: Brand.metricSoft,
    o2Soft: Brand.o2Soft,
    activitySoft: Brand.activitySoft,
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    background: Brand.deepSlate,
    softBackground: '#0F172A',
    card: '#0F172A',
    border: '#1E293B',
    primary: '#F8FAFC',
    primaryDeep: '#FFFFFF',
    primarySoft: '#1E293B',
    accent: '#3B82F6',
    success: '#3B82F6',
    successSoft: '#1D4ED8',
    warning: '#F59E0B',
    warningSoft: '#422006',
    error: '#F87171',
    errorSoft: '#450A0A',
    emergency: '#DC2626',
    info: '#60A5FA',
    infoSoft: '#172554',
    tabInactive: '#94A3B8',
    tabActive: '#F8FAFC',
    overlay: 'rgba(2, 6, 23, 0.7)',
    skeleton: '#1E293B',
    inputBackground: '#0F172A',
    hrRed: '#F87171',
    o2Blue: '#60A5FA',
    activityGreen: '#4ADE80',
    metricSoft: '#450A0A',
    o2Soft: '#172554',
    activitySoft: '#14532D',
  },
} as const;

export type ThemeColors = (typeof Colors)['light'];
export type ColorSchemeName = keyof typeof Colors;
