import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), visualizer()],
  server: { port: 3000, allowedHosts: ['2901-2405-4802-1bde-e7e0-34b6-de4-ae66-d5b3.ngrok-free.app'] },
  css: { devSourcemap: true },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
})
