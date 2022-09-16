import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crossOriginIsolation(),
  ],
  // build: { target: "es2020" },
  optimizeDeps: {
    esbuildOptions: { target: "es2020", supported: { bigint: true } },
  },
})
