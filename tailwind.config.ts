/**
 * Meridian design tokens — mirrored in CSS variables for runtime theming.
 * Linear-meets-EHR: quiet surfaces, deep teal authority, mint active markers.
 */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        ground: '#F3F7F6',
        card: '#FFFFFF',
        line: '#E1EAE8',
        ink: '#0E2A2B',
        muted: '#546B6C',
        primary: {
          DEFAULT: '#0F5C5C',
          night: '#0B2F30',
          signal: '#14877F',
          mint: '#5EEAD4',
        },
        risk: '#E4694F',
        status: {
          active: { bg: '#DDF3EA', fg: '#0A6847' },
          ready: { bg: '#DCEBFA', fg: '#1B4F8A' },
          pending: { bg: '#FBEBCB', fg: '#805200' },
          critical: { bg: '#FBE0DA', fg: '#A12A18' },
          inactive: { bg: '#E9EEED', fg: '#4A5F60' },
          chronic: { bg: '#F3E8FA', fg: '#6B2C8F' },
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        body: ['15px', { lineHeight: '1.55' }],
        label: ['12px', { lineHeight: '1.2', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(14, 42, 43, 0.04), 0 8px 24px rgba(14, 42, 43, 0.04)',
      },
      spacing: {
        sidebar: '264px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
