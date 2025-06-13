// tailwind.config.ts
import { type Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 🎨 Cores semânticas principais (baseadas nas variáveis)
        'app-background': 'hsl(var(--app-background))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card, var(--secondary)))',
          hover: 'hsl(var(--card-hover, var(--background)))',
          foreground: 'hsl(var(--card-foreground, var(--foreground)))',
        },
        input: 'hsl(var(--input))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        command: {
          DEFAULT: 'hsl(var(--command))',
          foreground: 'hsl(var(--command-foreground))',
          placeholder: 'hsl(var(--command-placeholder))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))',
        },
        highlight: 'hsl(var(--highlight))',
        'secondary-highlight': 'hsl(var(--secondary-highlight))',
        subtle: {
          foreground: 'hsl(var(--subtle-foreground))',
        },
        hover: 'hsl(var(--hover))',
        placeholder: 'hsl(var(--placeholder))',
        softForeground: 'hsl(var(--soft-foreground) / <alpha-value>)',
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary) / <alpha-value>)',
          foreground: 'hsl(var(--tertiary-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },

        // 📊 Cores para gráficos
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        // 🧱 Suporte a tokens fixos legados (temporário até refatoração completa)
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

        TINTS_TOMATO_100: '#750310',
        TINTS_TOMATO_200: '#92000E',
        TINTS_TOMATO_300: '#AB222E',
        TINTS_TOMATO_400: '#AB4D55',
        TINTS_CARROT_100: '#FBA94C',
        TINTS_PASSION_100: '#F4B400',
        TINTS_MINT_100: '#04D361',
        TINTS_CAKE_200: '#82F3FF',
        TINTS_CAKE_100: '#065E7C',

        GRADIENTS_200:
          'linear-gradient(to bottom, #091e26, #081b24, #051921, #03161e, #00131c)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        roboto: ['var(--font-roboto)'],
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  // plugins: [require('tailwindcss-animate')],
};

export default config;
