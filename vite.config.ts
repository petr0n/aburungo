import { defineConfig } from 'vitest/config'
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
  test: {
    // src/lib/supabase.ts and src/api/client.ts throw at import time when these
    // are absent, which takes down any component test that transitively reaches
    // them. A local .env.local masked that; CI has none, so the suite passed
    // here and failed there. Dummy values keep both environments identical —
    // no test should need real credentials.
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
      VITE_API_URL: 'http://localhost:3000',
    },
  },
})
