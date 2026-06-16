import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import yaml from '@rollup/plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), yaml()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // Force a single React instance. aburungo-design-system is linked
    // (link:../aburungo-design-system) and ships its own node_modules/react,
    // so without dedupe the bundle ends up with two React copies — its
    // components call hooks against a different React than the app, which
    // throws "Cannot read properties of null (reading 'useId')" at runtime.
    dedupe: ['react', 'react-dom'],
  },
})
