import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), basicSsl()],
  server: {
    host: '0.0.0.0', // Escuchar en todas las interfaces de red
    port: 5173,
    strictPort: false
  }
});
