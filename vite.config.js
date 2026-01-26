import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        horizonte: 'horizonte.html',
        instalaciones: 'instalaciones.html',
        pagos: 'pagos.html'
      }
    }
  }
});
