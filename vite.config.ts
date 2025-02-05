import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'idb',
      '@mui/material',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDayjs',
      'dayjs'
    ],
    force: true
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/x-date-pickers'],
          'database': ['idb']
        }
      }
    }
  }
});
