import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: {
    sourcemap: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Isolate heavy vendor libs into separate cached chunks
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/lenis')) return 'lenis';
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/rehype') || id.includes('node_modules/unified') || id.includes('node_modules/micromark') || id.includes('node_modules/mdast') || id.includes('node_modules/hast')) return 'markdown';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react-router')) return 'router';
          if (id.includes('node_modules/lucide-react')) return 'lucide';
        },
      },
    },
  },
});
