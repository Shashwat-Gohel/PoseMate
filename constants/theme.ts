export const colors = {
  // Pure iOS Pro Camera Dark Palette
  background: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  surfaceGlass: 'rgba(28, 28, 30, 0.78)',
  surfaceHighlight: '#3A3A3C',
  
  // Apple SF Typography & System Grays
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textMuted: '#8E8E93',
  textSubtle: '#636366',

  // iOS Camera Accent (Signature Camera Yellow / Gold)
  accent: '#FFD60A',
  accentLight: '#FFE875',
  accentStrong: '#E5C000',
  accentGlow: 'rgba(255, 214, 10, 0.15)',

  // iOS System Colors
  success: '#34C759',
  danger: '#FF3B30',
  blue: '#007AFF',

  // System Borders & Blur Dividers
  border: '#2C2C2E',
  borderLight: '#3A3A3C',
  borderGlass: 'rgba(255, 255, 255, 0.12)',
};

export const typography = {
  display: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const, letterSpacing: 0.37 },
  heading: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: 0.35 },
  title: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const, letterSpacing: -0.4 },
  body: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const, letterSpacing: -0.24 },
  subhead: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const, letterSpacing: -0.08 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  label: { fontSize: 11, lineHeight: 13, fontWeight: '600' as const, letterSpacing: 0.07 },
  mono: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const, letterSpacing: 0.5 },
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};
