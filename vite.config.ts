/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  test: {
    // environment: "happy-dom",
    workspace: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "happy-dom",
          include: [ "./router/test/*.test.ts" ]
        }
      },

      {
        extends: true,
        test: {
          name: "browser",
          browser: {
            provider: "playwright",
            enabled: true,
            headless: true,
            instances: [
              { browser: "chromium" }
            ],
          },
          include: [ "./router/test/*.test.tsx" ]
        }
      }
    ]
  },
  plugins: [react()],
})
