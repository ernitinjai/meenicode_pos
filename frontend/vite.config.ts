import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
//const basePath = isProduction ? '/meenicode/' : '/meenicode/';

export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: "::",
    port: 8081,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'chunk-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'index.css';
          }
          return 'asset-[name][extname]';
        },
      },
    },
  },
}));
