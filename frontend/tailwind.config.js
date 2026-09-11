/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Apex Slate & Indigo Design Palette
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary Brand Action
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        emerald: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669', // Income / Savings / Positive
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        rose: {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48', // Expense / Debt / Alert
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        amber: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706', // Warning / Projection
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        slate: {
          50:  '#F8FAFC', // Crisp Main Background Canvas
          100: '#F1F5F9', // Muted Element Fill
          200: '#E2E8F0', // Border Lines
          300: '#CBD5E1', // Subtle Divider
          400: '#94A3B8', // Placeholder / Disabled
          500: '#64748B', // Secondary Subtitles
          600: '#475569', // Muted Body Copy
          700: '#334155', // Subheadings
          800: '#1E293B', // High-Contrast Subtitles
          900: '#0F172A', // Primary Headings & Dark Elements
          950: '#020617',
        },
        // Legacy alias fallbacks for backwards compatibility
        paper:     '#F8FAFC',
        paperline: '#E2E8F0',
        surface:   '#FFFFFF',
        stamp:     '#F1F5F9',
        ink:       '#0F172A',
        inksoft:   '#64748B',
      },
      fontFamily: {
        display: ['"Outfit"', '"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'subtle':     '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card':       '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'glow-indigo':'0 0 24px -4px rgba(79, 70, 229, 0.3)',
        'glow-emerald':'0 0 24px -4px rgba(5, 150, 105, 0.3)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
}
