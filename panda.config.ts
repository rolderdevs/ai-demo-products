import { defineConfig } from '@pandacss/dev';
import { defaultPreset } from '@rolder/ss-presets';
import { defaultTheme } from '@rolder/ss-themes';

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  presets: ['@pandacss/dev/presets', defaultPreset, defaultTheme],
});
