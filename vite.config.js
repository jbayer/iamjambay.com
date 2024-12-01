import { defineConfig } from 'vite';


export default defineConfig({
    build: {
        manifest: true, // Generates manifest.json for hashed assets
        outDir: 'dist/scripts', // Output directory matches Eleventy output
        rollupOptions: {
            input: './src/_includes/scripts/main.ts', // Entry file
        },
    },
    server: {
        watch: {
            usePolling: true, // Optional: Ensures file changes are detected
        },
    },
});
