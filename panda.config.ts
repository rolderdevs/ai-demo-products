import { defineConfig } from '@pandacss/dev';
import { defaultPreset } from '@rolder/ss-presets';
import { defaultTheme } from '@rolder/ss-themes';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  preflight: true,
  include: [
    './src/**/*.{js,jsx,ts,tsx}',
    // В разработке используем исходники kit, в продакшене - build info
    ...(isDev
      ? ['./kit/react/src/**/*.{js,jsx,ts,tsx}']
      : ['./node_modules/@rolder/ui-kit-react/dist/panda.buildinfo.json']),
  ],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  importMap: '@rolder/ss',
  presets: ['@pandacss/dev/presets', defaultPreset, defaultTheme],
});
