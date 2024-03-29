import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crossOriginIsolation(),
  ],
  build: { target: "esnext" },
  optimizeDeps: {
    esbuildOptions: { target: "esnext", supported: { bigint: true } },
  },
})
