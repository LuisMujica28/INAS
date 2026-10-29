/**
 * ==========================================================================
 * HERO ULTRA-SMOOTH CANVAS ENGINE — INAS 2027
 * - Renderizado en Canvas 60-120 FPS con secuencia WebP optimizada
 * - Sincronizado con la Regla Interactiva de Grados (Jardín a 11°) y el cursor
 * - Reencuadre inteligente HiDPI para escritorio (16:9) y móvil (retrato)
 * ==========================================================================
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', initHeroScrubber);

    function initHeroScrubber() {
        const stage = document.getElementById('hero-presentation-stage');
        const mediaEngine = document.getElementById('hero-media-engine') || stage;
        const canvas = document.getElementById('hero-canvas');
        const fallbackVideo = document.getElementById('hero-video');

        if (!canvas || !stage) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const TOTAL_FRAMES = 71;
        const images = new Array(TOTAL_FRAMES);
        const loadedFlags = new Array(TOTAL_FRAMES).fill(false);
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let loadedCount = 0;
        let targetRatio = 0;
        let currentRatio = 0;
        let lastDrawnIndex = -1;
        let userHasInteracted = false;
        let lastPointerTime = 0;
        let rulerLockUntil = 0;
        let welcomeAnimStart = 0;
        let welcomeTriggered = false;

        // API pública para sincronizar la estudiante 3D con la regla de grados (Jardín -> 11°)
        window.setHeroTargetRatio = function (ratio) {
            userHasInteracted = true;
            rulerLockUntil = performance.now() + 1400;
            targetRatio = Math.max(0, Math.min(1, Number(ratio) || 0));
        };

        function getFramePath(idx) {
            const num = String(idx).padStart(3, '0');
            return `assets/hero_frames/frame_${num}.webp`;
        }

        const frame0 = new Image();
        frame0.decoding = 'async';
        frame0.src = getFramePath(0);
        images[0] = frame0;

        frame0.onload = () => {
            loadedFlags[0] = true;
            loadedCount++;
            resizeCanvas();
            drawCover(frame0);
            loadRemainingFrames();
        };

        frame0.onerror = () => {
            if (fallbackVideo) {
                fallbackVideo.style.display = 'block';
                canvas.style.display = 'none';
            }
        };

        function loadRemainingFrames() {
            for (let i = 1; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.decoding = 'async';
                img.src = getFramePath(i);
                images[i] = img;
                img.onload = () => {
                    loadedFlags[i] = true;
                    loadedCount++;
                    if (!welcomeTriggered && loadedCount >= TOTAL_FRAMES && !userHasInteracted && !prefersReducedMotion) {
                        welcomeTriggered = true;
                        welcomeAnimStart = performance.now();
                    }
                };
            }
        }

        function resizeCanvas() {
            const rect = mediaEngine.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.max(1, Math.round(rect.width * dpr));
            canvas.height = Math.max(1, Math.round(rect.height * dpr));

            if (lastDrawnIndex >= 0 && images[lastDrawnIndex]) {
                drawCover(images[lastDrawnIndex]);
            } else if (images[0] && loadedFlags[0]) {
                drawCover(images[0]);
            }
        }

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();

        function drawCover(img) {
            if (!img || !img.complete || img.naturalWidth === 0) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const nw = img.naturalWidth;
            const nh = img.naturalHeight;

            const isMobileStacked = window.innerWidth <= 900;
            const scale = isMobileStacked
                ? Math.max(cw / (nw * 0.64), ch / nh)
                : Math.max(cw / nw, ch / nh);
            const dw = nw * scale;
            const dh = nh * scale;

            const anchorX = isMobileStacked ? 0.94 : 0.5;
            const anchorY = isMobileStacked ? 0.1 : 0.45;

            const dx = (cw - dw) * anchorX;
            const dy = (ch - dh) * anchorY;

            ctx.drawImage(img, dx, dy, dw, dh);
        }

        function updateFromPointer(clientX, clientY) {
            if (performance.now() < rulerLockUntil) return;
            const rect = stage.getBoundingClientRect();
            if (clientY >= rect.top - 40 && clientY <= rect.bottom + 80) {
                userHasInteracted = true;
                lastPointerTime = performance.now();
                const x = clientX - rect.left;
                targetRatio = Math.max(0, Math.min(1, x / rect.width));
            }
        }

        window.addEventListener('mousemove', (e) => {
            updateFromPointer(e.clientX, e.clientY);
        }, { passive: true });

        stage.addEventListener('touchmove', (e) => {
            if (performance.now() < rulerLockUntil) return;
            if (e.touches && e.touches.length > 0) {
                const rect = stage.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                userHasInteracted = true;
                lastPointerTime = performance.now();
                targetRatio = Math.max(0, Math.min(1, x / rect.width));
            }
        }, { passive: true });

        window.addEventListener('scroll', () => {
            if (performance.now() < rulerLockUntil) return;
            if (performance.now() - lastPointerTime < 600) return;
            const rect = stage.getBoundingClientRect();
            if (rect.height <= 0) return;
            const scrolled = Math.max(0, -rect.top);
            const progress = Math.max(0, Math.min(1, scrolled / (rect.height * 0.65)));
            userHasInteracted = true;
            targetRatio = progress;
        }, { passive: true });

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function renderLoop(now) {
            if (welcomeTriggered && !userHasInteracted && welcomeAnimStart > 0) {
                const elapsed = now - welcomeAnimStart;
                const duration = 2200;
                if (elapsed <= duration) {
                    const p = elapsed / duration;
                    targetRatio = p < 0.5
                        ? easeInOutCubic(p * 2) * 0.88
                        : (1 - easeInOutCubic((p - 0.5) * 2)) * 0.88;
                } else {
                    targetRatio = 0;
                    welcomeAnimStart = 0;
                }
            }

            const diff = targetRatio - currentRatio;
            currentRatio += diff * 0.22;

            const targetIndex = Math.min(
                TOTAL_FRAMES - 1,
                Math.max(0, Math.round(currentRatio * (TOTAL_FRAMES - 1)))
            );

            if (targetIndex !== lastDrawnIndex) {
                if (loadedFlags[targetIndex] && images[targetIndex]) {
                    drawCover(images[targetIndex]);
                    lastDrawnIndex = targetIndex;
                } else {
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
