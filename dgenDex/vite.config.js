import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
    plugins: [
        react(),
        viteSingleFile()
    ],
    build: {
        // Ensure assets are inlined so everything is in one file
        target: 'esnext',
        assetsDir: '',
        rollupOptions: {
            output: {
                manualChunks: undefined,
                inlineDynamicImports: true,
            },
        },
    },
});
