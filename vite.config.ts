import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  // Adding an alis to the vite config for danfojs
  resolve: {
    alias: {
      danfojs: 'danfojs/dist/danfojs-browser/src/index.js', // Ajusta según sea necesario
    },
  },
  server: {
    port: 5173, // Especifica aquí el puerto deseado
    host: '0.0.0.0', // Escuchar en todas las interfaces de red
  },
});
