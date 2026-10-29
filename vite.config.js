import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Descubre automáticamente las 17 páginas .html de la raíz para que ninguna dé 404 en Vercel
const htmlEntries = Object.fromEntries(
    fs
        .readdirSync(__dirname)
        .filter((file) => file.endsWith('.html'))
        .map((file) => [path.basename(file, '.html'), path.resolve(__dirname, file)])
);

// Copia scripts clásicos (sin type="module") y toda la carpeta assets/ (incluidos los 71 frames 3D WebP)
function copyStaticRuntimePlugin() {
    const classicScripts = [
        'admisiones.js',
        'hero-3d-scroll.js',
        'intro-animation.js',
        'mobile-menu.js',
        'navigation.js'
    ];

    return {
        name: 'copy-inas-static-runtime',
        closeBundle() {
            const distDir = path.resolve(__dirname, 'dist');
            fs.mkdirSync(distDir, { recursive: true });

            for (const scriptFile of classicScripts) {
                const src = path.resolve(__dirname, scriptFile);
                if (fs.existsSync(src)) {
                    fs.copyFileSync(src, path.join(distDir, scriptFile));
                }
            }

            const assetsSrc = path.resolve(__dirname, 'assets');
            const assetsDest = path.join(distDir, 'assets');
            if (fs.existsSync(assetsSrc)) {
                fs.cpSync(assetsSrc, assetsDest, { recursive: true, force: true });
            }
        }
    };
}

export default defineConfig({
    server: {
        open: true
    },
    plugins: [copyStaticRuntimePlugin()],
    build: {
        rollupOptions: {
            input: htmlEntries
        }
    }
});
