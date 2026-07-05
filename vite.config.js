import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/safari-wschodnia-afryka-pytania/',
    plugins: [react()],
    server: {
        port: 5175,
        open: true,
    },
    preview: {
        port: 4175,
    },
});
