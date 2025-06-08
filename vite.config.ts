/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

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
      },

      {
        test: {
          name: "m3-browser",
          browser: {
            provider: "playwright",
            enabled: true,
            headless: true,
            instances: [
              { browser: "chromium" }
            ],
          },
          include: [ "./mission-3-book-review/tests/**/*.test.tsx" ]
        }
      }
    ]
  },
  plugins: [react(), tailwindcss()],
})
