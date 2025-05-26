/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#001119',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        primaryForeground: '#000000',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        secondaryForeground: '#ffffff',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        mutedForeground: '#cbd5e1',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: '#0D1D25',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        LIGHT_100: '#FFFFFF',
        LIGHT_200: '#FFFAF1',
        LIGHT_300: '#E1E1E6',
        LIGHT_400: '#C4C4CC',
        LIGHT_500: '#7C7C8A',
        LIGHT_600: '#76797B',
        LIGHT_700: '#4D585E',
        DARK_100: '#000405',
        DARK_200: '#00070A',
        DARK_300: '#000204',
        DARK_400: '#000A0F',
        DARK_500: '#000C12',
        DARK_600: '#00111A',
        DARK_700: '#001119',
        DARK_800: '#0D161B',
        DARK_900: '#0D1D25',
        DARK_1000: '#192227',
        GRADIENTS_200:
          'linear-gradient(to bottom, #091e26, #081b24, #051921, #03161e, #00131c);',
        TINTS_TOMATO_100: '#750310',
        TINTS_TOMATO_200: '#92000E',
        TINTS_TOMATO_300: '#AB222E',
        TINTS_TOMATO_400: '#AB4D55',
        TINTS_CARROT_100: '#FBA94C',
        TINTS_MINT_100: '#04D361',
        TINTS_CAKE_200: '#82F3FF',
        TINTS_CAKE_100: '#065E7C',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        roboto: ['var(--font-roboto)'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
