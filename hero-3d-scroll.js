/**
 * ==========================================================================
 * HERO ULTRA-SMOOTH CANVAS ENGINE — INAS 2027
 * - Renderizado en Canvas 60-120 FPS con secuencia WebP optimizada
 * - CERO latencia de decodificación (0ms de retraso al mover el mouse)
 * - CERO saltos o congelamientos: respuesta inmediata, sedosa y continua
 * - Escalado inteligente 'cover' que llena la pantalla con nitidez HiDPI
 * ==========================================================================
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', initHeroScrubber);

    function initHeroScrubber() {
        const stage = document.getElementById('hero-presentation-stage');
        const canvas = document.getElementById('hero-canvas');
        const fallbackVideo = document.getElementById('hero-video');

        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const TOTAL_FRAMES = 71; // Recortado exactamente en el fotograma 70 (antes de mover los labios)
        const images = new Array(TOTAL_FRAMES);
        const loadedFlags = new Array(TOTAL_FRAMES).fill(false);

        let targetRatio = 0;   // Inicia en la postura de bienvenida inicial (0.0 a 1.0)
        let currentRatio = 0;  // Posición suavizada actual
        let lastDrawnIndex = -1;
        let isFirstFrameDrawn = false;

        // ----------------------------------------------------------------------
        // 1. CARGA INTELIGENTE DE CUADROS (Frame 0 prioritario, resto asíncrono)
        // ----------------------------------------------------------------------
        function getFramePath(idx) {
            const num = String(idx).padStart(3, '0');
            return `assets/hero_frames/frame_${num}.webp`;
        }

        // Cargar y pintar cuadro 0 de inmediato
        const frame0 = new Image();
        frame0.decoding = 'async';
        frame0.src = getFramePath(0);
        images[0] = frame0;

        frame0.onload = () => {
            loadedFlags[0] = true;
            resizeCanvas();
            drawCover(frame0);
            isFirstFrameDrawn = true;
            loadRemainingFrames();
        };

        frame0.onerror = () => {
            console.warn('[Hero Canvas] No se encontraron cuadros WebP, activando fallback a video');
            if (fallbackVideo) {
                fallbackVideo.style.display = 'block';
                canvas.style.display = 'none';
            }
        };

        // Cargar los 119 cuadros restantes en segundo plano
        function loadRemainingFrames() {
            for (let i = 1; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.decoding = 'async';
                img.src = getFramePath(i);
                images[i] = img;
                img.onload = () => {
                    loadedFlags[i] = true;
                };
            }
        }

        // ----------------------------------------------------------------------
        // 2. AJUSTE DE RESOLUCIÓN DEL CANVAS (HiDPI / Retina Crisp)
        // ----------------------------------------------------------------------
        function resizeCanvas() {
            if (!stage || !canvas) return;
            const rect = stage.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);

            if (lastDrawnIndex >= 0 && images[lastDrawnIndex]) {
                drawCover(images[lastDrawnIndex]);
            } else if (images[0] && loadedFlags[0]) {
                drawCover(images[0]);
            }
        }

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();

        // ----------------------------------------------------------------------
        // 3. FUNCIÓN DE DIBUJADO COVER (Pantalla completa sin distorsión)
        // ----------------------------------------------------------------------
        function drawCover(img) {
            if (!img || !img.complete || img.naturalWidth === 0) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const nw = img.naturalWidth;
            const nh = img.naturalHeight;

            const scale = Math.max(cw / nw, ch / nh);
            const dw = nw * scale;
            const dh = nh * scale;
            const dx = (cw - dw) / 2;
            const dy = (ch - dh) / 2;

            ctx.drawImage(img, dx, dy, dw, dh);
        }

        // ----------------------------------------------------------------------
        // 4. SEGUIMIENTO DEL CURSOR (MOUSE Y TOUCH)
        // ----------------------------------------------------------------------
        function updateFromPointer(clientX, clientY) {
            if (!stage) return;
            const rect = stage.getBoundingClientRect();

            // Activo si el puntero está en la mitad superior de la página o sobre el Hero
            if (clientY <= rect.bottom + 80) {
                const x = clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, x / rect.width));
                targetRatio = ratio;
            }
        }

        window.addEventListener('mousemove', (e) => {
            updateFromPointer(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                updateFromPointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        // ----------------------------------------------------------------------
        // 5. BUCLE DE RENDERIZADO A 60 FPS ULTRA-FLUIDO
        // ----------------------------------------------------------------------
        function renderLoop() {
            // Factor LERP rápido y reactivo (0.32 = respuesta instantánea, sin retraso ni saltos)
            const diff = targetRatio - currentRatio;
            currentRatio += diff * 0.32;

            // Mapear al cuadro más cercano (0 a 119)
            const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentRatio * (TOTAL_FRAMES - 1))));

            if (targetIndex !== lastDrawnIndex) {
                // Si el cuadro objetivo ya está cargado, pintarlo
                if (loadedFlags[targetIndex] && images[targetIndex]) {
                    drawCover(images[targetIndex]);
                    lastDrawnIndex = targetIndex;
                } else {
                    // Si aún no ha cargado, buscar el cuadro cargado más próximo para evitar saltos o parpadeos
                    let closest = -1;
                    let minDistance = 999;
                    for (let i = 0; i < TOTAL_FRAMES; i++) {
                        if (loadedFlags[i]) {
                            const dist = Math.abs(i - targetIndex);
                            if (dist < minDistance) {
                                minDistance = dist;
                                closest = i;
                            }
                        }
                    }
                    if (closest >= 0 && closest !== lastDrawnIndex && images[closest]) {
                        drawCover(images[closest]);
                        lastDrawnIndex = closest;
                    }
                }
            }

            requestAnimationFrame(renderLoop);
        }

        requestAnimationFrame(renderLoop);
    }
})();
