// Design tokens ported from the web app's style.css
export const colors = {
  brand: '#FF4500',
  brandDark: '#CC3700',
  brandGlow: 'rgba(255,69,0,0.22)',
  ink: '#1A0A00',
  inkMid: '#6B4F3A',
  inkLight: '#A8896E',
  surface: '#FFFAF7',
  surface2: '#FFF3EC',
  border: '#F0E0D4',
  white: '#FFFFFF',
  placeholder: '#FFE0CC',
  danger: '#D93025',
  success: '#1E8E3E',
};

export const radius = { sm: 12, md: 18, lg: 24, xl: 32, full: 999 };

// Poppins weights as loaded in the root layout
export const font = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extra: 'Poppins_800ExtraBold',
};

export const shadow = {
  soft: {
    shadowColor: '#1A0A00',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  card: {
    shadowColor: '#1A0A00',
    shadowOpacity: 0.09,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cta: {
    shadowColor: '#FF4500',
    shadowOpacity: 0.38,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

export const CATEGORIES = [
  { key: 'all', label: 'All', icon: '▦' },
  { key: 'mains', label: 'Mains', icon: '🍛' },
  { key: 'suya', label: 'Suya', icon: '🔥' },
  { key: 'shawarma', label: 'Shawarma', icon: '🌯' },
  { key: 'drinks', label: 'Drinks', icon: '🥤' },
  { key: 'sides', label: 'Sides', icon: '🍟' },
] as const;
