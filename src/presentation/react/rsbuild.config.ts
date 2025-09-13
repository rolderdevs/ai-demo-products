import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: { port: 8000 },
  source: {
    entry: {
      index: './src/presentation/react/index.tsx',
    },
  },
});
