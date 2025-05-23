// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000, // Frontend will run on port 3000
//     proxy: {
//       // Proxy API requests to your backend server
//       '/api': {
//         target: 'http://localhost:5000', // Your backend server address
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// });


//  ===== 3. Update your vite.config.js file =====
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy configuration for development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})