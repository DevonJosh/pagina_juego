/* ============================================================
   AVENTURAS DE BEEBOT — JAVASCRIPT PRINCIPAL
   Versión 5.0 — Jardín Primaveral Profesional
   ------------------------------------------------------------
   Módulos:
     1.  Utilidades
     2.  Año dinámico del footer
     3.  Sistema de audio sintetizado (Web Audio API)
     4.  Música de fondo (cancion19.mp3)
     5.  Botón flotante de sonido
     6.  Header: scroll, progreso y auto-ocultado
     7.  Menú móvil desplegable
     8.  Scroll suave por anclas
     9.  Efectos ripple + hover
     10. Reveal escalonado
     11. Filtros por categoría
     12. Indicador de navegación activa
     13. BeeBot: saludo + reacción al click
     14. Accesibilidad por teclado
     15. VISOR DE JUEGO (misma página, pantalla completa)
     16. API global
   ============================================================ */

'use strict';

/* ============================================================
   1. UTILIDADES
   ============================================================ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const store = {
    get(key, fallback = null) {
        try {
            const val = localStorage.getItem(key);
            return val === null ? fallback : JSON.parse(val);
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ============================================================
   2. AÑO DINÁMICO EN EL FOOTER
   ============================================================ */
(function setYear() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ============================================================
   3. SISTEMA DE AUDIO SINTETIZADO (Web Audio API)
   ============================================================ */
const Sound = (() => {
    let enabled = !store.get('bee_muted_global', false);
    let audioCtx = null;

    function getContext() {
        if (!audioCtx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            audioCtx = new AC();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
        return audioCtx;
    }

    function tone(freq = 440, duration = 0.12, type = 'sine', volume = 0.14) {
        if (!enabled) return;
        const ctx = getContext();
        if (!ctx) return;

        try {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {}
    }

    function click() {
        tone(660, 0.09, 'triangle', 0.18);
        setTimeout(() => tone(990, 0.07, 'sine', 0.11), 45);
    }
    let lastHover = 0;
    function hover() {
        const now = performance.now();
        if (now - lastHover < 220) return;
        lastHover = now;
        tone(880, 0.045, 'sine', 0.055);
    }

    function filterSelect() {
        tone(720, 0.09, 'triangle', 0.18);
        setTimeout(() => tone(880, 0.11, 'triangle', 0.17), 50);
    }

    function openGame() {
        tone(523.25, 0.10, 'triangle', 0.19);
        setTimeout(() => tone(659.25, 0.10, 'triangle', 0.19), 90);
        setTimeout(() => tone(783.99, 0.18, 'triangle', 0.19), 180);
    }

    function beebotGreeting() {
        tone(880, 0.10, 'sine', 0.10);
        setTimeout(() => tone(1100, 0.15, 'sine', 0.10), 100);
    }

    function beebotGiggle() {
        tone(1046, 0.08, 'triangle', 0.16);
        setTimeout(() => tone(1318, 0.08, 'triangle', 0.16), 70);
        setTimeout(() => tone(1568, 0.12, 'triangle', 0.17), 140);
    }

    function comingSoon() {
        tone(500, 0.10, 'triangle', 0.09);
        setTimeout(() => tone(400, 0.14, 'triangle', 0.09), 100);
    }

    return {
        isEnabled: () => enabled,
        setEnabled(value) { enabled = Boolean(value); store.set('bee_muted_global', !enabled); },
        toggle() {
            enabled = !enabled;
            store.set('bee_muted_global', !enabled);
            return enabled;
        },
        click, hover, filterSelect, openGame,
        beebotGreeting, beebotGiggle, comingSoon, tone
    };
})();


/* ============================================================
   4. MÚSICA DE FONDO (cancion19.mp3)
   ------------------------------------------------------------
   Controla el <audio id="bgm">. Pausa automáticamente cuando
   se abre un juego y reanuda al cerrarlo.
   ============================================================ */
const BGM = (() => {
    const audio = $('#bgm');
    let inGame = false;
    function sync() {
        if (!audio) return;
        if (inGame || !Sound.isEnabled()) { audio.pause(); return; }
        audio.volume = .28;
        if (audio.paused) audio.play().catch(() => {});
    }
    return {
        play: sync, resume: sync,
        pause() { audio?.pause(); },
        pauseForGame() { inGame = true; audio?.pause(); },
        resumeFromGame() { inGame = false; sync(); },
        mute() { Sound.setEnabled(false); sync(); },
        unmute() { Sound.setEnabled(true); sync(); },
        isPaused: () => !audio || audio.paused
    };
})();
(function initSoundToggle() {
    const button = $('#soundToggle');
    if (!button) return;
    function render() {
        const on = Sound.isEnabled();
        button.setAttribute('aria-pressed', String(on));
        button.setAttribute('aria-label', on ? 'Silenciar sonido' : 'Activar sonido');
        button.title = on ? 'Silenciar sonido' : 'Activar sonido';
    }
    button.addEventListener('click', () => {
        const on = Sound.toggle(); render(); BGM.resume();
        if (on) Sound.tone(880, .12, 'sine', .12);
    });
    function unlock(event) {
        if (event.target.closest?.('#soundToggle, .game-card-link')) return;
        BGM.resume();
    }
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
    window.addEventListener('pagehide', () => BGM.pause());
    render(); BGM.resume();
})();


/* ============================================================
   6. HEADER: SCROLL, PROGRESO Y AUTO-OCULTADO
   ============================================================ */
(function initHeaderScroll() {
    const header   = $('#siteHeader');
    const progress = $('#scrollProgress');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function update() {
        const y = window.scrollY;

        header.classList.toggle('is-scrolled', y > 40);

        if (progress) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            document.documentElement.style.setProperty('--bee-header-height', header.offsetHeight + 'px');
            const pct  = docH > 0 ? (y / docH) * 100 : 0;
            progress.style.width = pct + '%';
        }

        if (!header.classList.contains('menu-is-open') && y > 400 && y > lastScrollY + 10) {
            header.style.transform = 'translateY(-140%)';
        } else if (y < lastScrollY - 10 || y < 400) {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = y;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    header.style.transition = 'transform .35s cubic-bezier(.22,.61,.36,1), background .35s, box-shadow .35s, border-color .35s';
    update();
})();


/* ============================================================
   7. MENÚ MÓVIL DESPLEGABLE
   ============================================================ */
(function initMobileMenu() {
    const toggleBtn = $('#menuToggle');
    const mainNav   = $('.main-nav');
    if (!toggleBtn || !mainNav) return;

    function close() {
        mainNav.classList.remove('is-open');
        $('#siteHeader')?.classList.remove('menu-is-open');
        toggleBtn.setAttribute('aria-label', 'Abrir menú');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mainNav.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
        $('#siteHeader')?.classList.toggle('menu-is-open', isOpen);
        toggleBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        if (isOpen) $('#siteHeader').style.transform = 'translateY(0)';
        Sound.click();
    });

    matchMedia('(max-width: 1100px)').addEventListener('change', close);
    $$('.nav-btn', mainNav).forEach(link => link.addEventListener('click', close));

    document.addEventListener('click', (e) => {
        if (!mainNav.classList.contains('is-open')) return;
        if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('is-open')) { close(); toggleBtn.focus(); }
    });
})();


/* ============================================================
   8. SCROLL SUAVE POR ANCLAS
   ============================================================ */
(function initSmoothScroll() {
    const header = $('#siteHeader');

    function scrollTo(target) {
        const el = typeof target === 'string' ? $(target) : target;
        if (!el) return;

        const headerH = header ? header.offsetHeight : 80;
        const top = el.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    $$('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Sound.click();
            scrollTo(btn.dataset.scroll);
        });
    });

    $$('a[href^="#"]').forEach(anchor => {
        if (anchor.target === '_blank') return;
        if (anchor.dataset.scroll) return;

        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = $(href);
            if (!target) return;

            e.preventDefault();
            Sound.click();
            scrollTo(target);
        });
    });

    window.AE_scrollTo = scrollTo;
})();


/* ============================================================
   9. EFECTOS RIPPLE Y HOVER
   ============================================================ */
(function initButtonEffects() {
    function ripple(button, event) {
        if (prefersReducedMotion) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.3;

        const span = document.createElement('span');
        span.className = 'ripple';
        Object.assign(span.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%) scale(0)',
            transition: 'transform .6s cubic-bezier(0,0,.2,1), opacity .6s ease',
            opacity: '1'
        });

        const x = (event.clientX ?? (rect.left + rect.width / 2)) - rect.left;
        const y = (event.clientY ?? (rect.top + rect.height / 2)) - rect.top;
        span.style.left = x + 'px';
        span.style.top  = y + 'px';

        if (getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        if (!button.classList.contains('menu-toggle')) button.style.overflow = 'hidden';
        button.appendChild(span);

        requestAnimationFrame(() => {
            span.style.transform = 'translate(-50%, -50%) scale(1)';
            span.style.opacity = '0';
        });
        setTimeout(() => span.remove(), 650);
    }

    $$('.filter-btn, .btn-hero-inicial, .btn-show-all, .nav-btn, .btn-cerrar-juego').forEach(btn => {
        btn.addEventListener('click', (e) => ripple(btn, e));

        if (!prefersReducedMotion && !('ontouchstart' in window)) {
            btn.addEventListener('mouseenter', () => Sound.hover());
        }
    });
})();


/* Respuestas sonoras de navegación y controles del visor. */
(function initExtraButtonSounds() {
    $$('.nav-btn, .footer-nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) link.addEventListener('click', () => Sound.click());
    });
    $$('#visorContinue, #visorFullscreen, #visorConfirmExit').forEach(button => {
        button.addEventListener('click', () => Sound.click());
    });
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        $$('.game-card:not(.is-coming-soon) .game-card-link').forEach(link => {
            link.addEventListener('mouseenter', () => Sound.hover());
        });
    }
})();

/* ============================================================
   10. REVEAL ESCALONADO AL HACER SCROLL
   ============================================================ */
(function initRevealOnScroll() {
    const elements = $$('.reveal-child');
    if (!elements.length) return;

    if (prefersReducedMotion) {
        elements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
})();




/* ============================================================
   PORTADAS DINÁMICAS SILENCIOSAS
   ------------------------------------------------------------
   Cada miniatura conserva el HTML real del juego y su renderizado.
   La política del iframe bloquea autoplay y los elementos de audio
   y video se silencian como protección adicional.
   ============================================================ */
(function initSilentDynamicPreviews() {
    const PREVIEW_W = 1920;
    const PREVIEW_H = 1080;

    function fitPreview(frame) {
        const box = frame.closest('.game-card-thumb');
        if (!box) return;
        const scale = Math.min(box.clientWidth / PREVIEW_W, box.clientHeight / PREVIEW_H);
        frame.style.setProperty('--preview-scale', String(scale));
    }

    $$('.dynamic-thumb').forEach(frame => {
        fitPreview(frame);
        if ('ResizeObserver' in window) {
            const box = frame.closest('.game-card-thumb');
            if (box) new ResizeObserver(() => fitPreview(frame)).observe(box);
        }
        const silencePreview = () => {
            try {
                const doc = frame.contentDocument;
                if (!doc) return;

                doc.querySelectorAll('audio, video').forEach(media => {
                    media.muted = true;
                    media.volume = 0;
                    try { media.pause(); } catch {}
                    media.removeAttribute('autoplay');
                });
            } catch {}
        };

        frame.addEventListener('load', () => {
            silencePreview();
            setTimeout(silencePreview, 100);
            setTimeout(silencePreview, 500);
        });
    });
})();


/* ============================================================
   11. FILTROS POR CATEGORÍA
   ------------------------------------------------------------
   • Muestra/oculta secciones según el filtro
   • Recalcula contadores automáticamente
   • Muestra mensaje vacío si no hay nada
   ============================================================ */
(function initFilters() {
    const filterBtns  = $$('.filter-btn');
    const sections    = $$('.games-section');
    const gamesEmpty  = $('#gamesEmpty');
    const showAllBtn  = $('.btn-show-all');

    if (!filterBtns.length || !sections.length) return;

    const cards = $$('.game-card');
    const keys = card => (card.dataset.courses || card.dataset.category || '').split(/\s+/).filter(Boolean);
    function updateCounters() {
        const counts = { all: cards.length };
        cards.forEach(card => new Set(keys(card)).forEach(key => { counts[key] = (counts[key] || 0) + 1; }));
        $$('[data-count]').forEach(el => el.textContent = counts[el.dataset.count] || 0);
    }
    function applyFilter(filter) {
        cards.forEach(card => { card.hidden = filter !== 'all' && !keys(card).includes(filter); });
        let found = 0;
        sections.forEach(section => {
            const visible = $$('.game-card', section).filter(card => !card.hidden).length;
            section.classList.toggle('is-hidden', visible === 0);
            const counter = $('.games-section-count-num', section);
            if (counter) counter.textContent = visible;
            if (visible) found++;
        });
        if (gamesEmpty) gamesEmpty.hidden = found > 0;
        filterBtns.forEach(button => {
            const active = button.dataset.filter === filter;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter || 'all';
            Sound.filterSelect();
            applyFilter(filter);

            // Scroll suave al inicio de la lista si estamos muy abajo
            const target = $('#juegos');
            if (target && window.scrollY > target.offsetTop + 200) {
                const headerH = $('#siteHeader')?.offsetHeight || 80;
                window.scrollTo({
                    top: target.offsetTop - headerH - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            Sound.filterSelect();
            applyFilter('all');
        });
    }

    updateCounters();
    applyFilter('all');
})();


/* ============================================================
   12. INDICADOR DE NAVEGACIÓN ACTIVA
   ============================================================ */
(function initActiveNav() {
    const mainNav   = $('.main-nav');
    const indicator = $('.nav-indicator');
    if (!mainNav || !indicator) return;

    const navMap = {
        'hero':   'inicio',
        'juegos': 'juegos',
        'ayuda':  'ayuda'
    };

    const sections = Object.keys(navMap)
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (!sections.length) return;

    const navLinks = $$('.nav-btn[data-nav]');
    if (!navLinks.length) return;

    function moveIndicator(link) {
        if (window.matchMedia('(max-width: 1024px)').matches) return;
        const navRect  = mainNav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        indicator.style.transform = `translateX(${linkRect.left - navRect.left - 6}px)`;
        indicator.style.width     = linkRect.width + 'px';
    }

    function setActive(navKey) {
        let matched = null;
        navLinks.forEach(link => {
            const isActive = link.dataset.nav === navKey;
            link.classList.toggle('is-active', isActive);
            if (isActive) matched = link;
        });

        if (matched) {
            indicator.classList.add('is-active');
            moveIndicator(matched);
        } else {
            indicator.classList.remove('is-active');
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const navKey = navMap[entry.target.id];
                if (navKey) setActive(navKey);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -40% 0px'
    });

    sections.forEach(sec => observer.observe(sec));

    window.addEventListener('resize', () => {
        const active = $('.nav-btn.is-active');
        if (active) moveIndicator(active);
    });

    setActive('juegos');
})();


/* ============================================================
   13. BEEBOT: SALUDO + REACCIÓN AL CLICK
   ============================================================ */
(function initBeeBotInteraction() {
    const robot = $('.hero-character .robot-img');
    if (!robot) return;

    /* Saludo sonoro la primera vez que entra al viewport */
    let greeted = false;
    const greetingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !greeted) {
                greeted = true;
                setTimeout(() => Sound.beebotGreeting(), 600);
                greetingObserver.disconnect();
            }
        });
    }, { threshold: 0.4 });

    greetingObserver.observe(robot);

    /* Click en la abeja → risita + wiggle temporal */
    const display = $('.hero-character .robot-display');
    if (display) display.style.cursor = 'pointer';

    robot.style.cursor = 'pointer';
    robot.style.pointerEvents = 'auto';
    robot.setAttribute('role', 'button');
    robot.setAttribute('tabindex', '0');
    robot.setAttribute('aria-label', '¡Saluda a BeeBot!');

    let isReacting = false;

    function react() {
        if (isReacting) return;
        Sound.beebotGiggle();
        if (prefersReducedMotion) return;
        isReacting = true;

        if (display) {
            display.classList.add('is-reacting');
            setTimeout(() => {
                display.classList.remove('is-reacting');
                isReacting = false;
            }, 700);
        } else {
            robot.animate([
                { transform: 'translateY(0) scale(1)' },
                { transform: 'translateY(-20px) scale(1.08)' },
                { transform: 'translateY(0) scale(1)' }
            ], {
                duration: 600,
                easing: 'cubic-bezier(.22,.61,.36,1)'
            }).onfinish = () => { isReacting = false; };
        }
    }

    robot.addEventListener('click', react);
    robot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            react();
        }
    });
})();


/* ============================================================
   14. ACCESIBILIDAD POR TECLADO
   ============================================================ */
(function initKeyboardA11y() {
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const el = document.activeElement;
        if (!el) return;
        if (el.tagName === 'BUTTON' || el.tagName === 'A') return;

        if (el.classList.contains('btn-hero-inicial') ||
            el.classList.contains('filter-btn') ||
            el.classList.contains('sound-toggle')) {
            e.preventDefault();
            el.click();
        }
    });
})();


/* ============================================================
   15. VISOR DE JUEGO (misma página, pantalla completa)
   ------------------------------------------------------------
   • Abre el juego en un iframe a pantalla completa
   • Pausa la música de fondo mientras el juego está activo
   • El botón "Salir" aparece al hacer hover arriba
   • ESC o salir del fullscreen nativo cierra el visor
   ============================================================ */
(function initGameViewer() {
    const visor = $('#visor-juego');
    const frame = $('#frame-juego');
    if (!visor || !frame) return;

    let juegoActivo = false;
    let launchLink = null;
    const tab = $('#visorExitTab');
    const panel = $('#visorExitPanel');
    const continuar = $('#visorContinue');
    const confirmar = $('#visorConfirmExit');
    const ampliar = $('#visorFullscreen');
    let dragging = false;
    let moved = false;
    let startY = 0;
    let startTop = 0;

    function showExitPanel(show) {
        if (!panel || !tab) return;
        panel.hidden = !show;
        tab.setAttribute('aria-expanded', String(show));
        if (show) continuar?.focus();
        else tab.focus();
    }

    // La pestaña solo ocupa 24 × 52 px. Se puede desplazar si tapa un control.
    if (tab) {
        tab.addEventListener('pointerdown', e => {
            dragging = true; moved = false; startY = e.clientY;
            startTop = tab.getBoundingClientRect().top - visor.getBoundingClientRect().top;
            tab.setPointerCapture(e.pointerId);
        });
        tab.addEventListener('pointermove', e => {
            if (!dragging) return;
            const dy = e.clientY - startY;
            if (Math.abs(dy) > 7) moved = true;
            if (moved) {
                const max = Math.max(0, visor.clientHeight - tab.offsetHeight);
                tab.style.top = Math.max(0, Math.min(max, startTop + dy)) + 'px';
            }
        });
        tab.addEventListener('pointerup', () => { dragging = false; });
        tab.addEventListener('pointercancel', () => { dragging = false; });
        tab.addEventListener('click', e => {
            if (moved) { e.preventDefault(); moved = false; return; }
            showExitPanel(panel.hidden);
        });
    }
    continuar?.addEventListener('click', () => showExitPanel(false));
    confirmar?.addEventListener('click', () => window.cerrarJuego());
    ampliar?.addEventListener('click', () => {
        showExitPanel(false);
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (visor.requestFullscreen) visor.requestFullscreen().catch(() => {});
            else if (visor.webkitRequestFullscreen) visor.webkitRequestFullscreen();
        }
    });

    /* ---- Abrir juego ---- */
    function abrirJuego(url) {
        if (!url) return;

        BGM.pauseForGame();
        document.body.classList.add('bee-game-open');
        Sound.openGame();

        frame.src = url;
        visor.classList.add('activo');
        juegoActivo = true;
        if (panel) panel.hidden = true;
        if (tab) tab.setAttribute('aria-expanded', 'false');

        // Intentar fullscreen nativo (silencioso si el navegador lo bloquea)
        if (visor.requestFullscreen) {
            visor.requestFullscreen().catch(() => {});
        } else if (visor.webkitRequestFullscreen) {
            visor.webkitRequestFullscreen();
        }
    }

    /* ---- Cerrar juego (expuesta globalmente) ---- */
    window.cerrarJuego = function() {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        }

        visor.classList.remove('activo', 'mostrar-controles');
        if (panel) panel.hidden = true;
        if (tab) tab.setAttribute('aria-expanded', 'false');
        frame.src = '';
        juegoActivo = false;
        launchLink?.focus({ preventScroll: true });

        document.body.classList.remove('bee-game-open');
        BGM.resumeFromGame();
    };

    /* ---- Listeners de cada tarjeta de juego ---- */
    $$('.game-card').forEach(card => {
        const link = card.querySelector('.game-card-link');
        if (!link) return;

        /* Tarjetas "PRÓXIMAMENTE" → solo suena aviso, no se abren */
        if (card.classList.contains('is-coming-soon')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                Sound.comingSoon();
            });
            return;
        }

        /* Tarjetas activas → abrir en el visor */
        if (link.tagName === 'A') {
            link.addEventListener('click', (e) => {
                const url = link.getAttribute('href');
                if (!url) return;
                e.preventDefault();
                launchLink = link;
                abrirJuego(url);
            });
        }
    });

    /* Escape: el navegador sale del fullscreen nativo y cierra el visor.
       Sin fullscreen nativo, Escape abre/cierra la confirmación. */
    document.addEventListener('keydown', e => {
        if (!juegoActivo || e.key !== 'Escape') return;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            e.preventDefault();
            showExitPanel(panel?.hidden ?? true);
        }
    });

    /* Al abrir el selector de archivos, algunos navegadores abandonan fullscreen.
       El juego debe seguir abierto: solo se restaura con el botón del panel. */
    document.addEventListener('fullscreenchange', () => {
        if (juegoActivo && !document.fullscreenElement && panel) panel.hidden = true;
    });

})();


/* ============================================================
   16. API GLOBAL
   ============================================================ */
window.BeeBotPortal = {
    sound: Sound,
    bgm: BGM,

    filterBy(category) {
        const btn = $(`.filter-btn[data-filter="${category}"]`);
        if (btn) btn.click();
    },

    scrollTo(selector) {
        const el = typeof selector === 'string' ? $(selector) : selector;
        if (!el) return;
        const headerH = $('#siteHeader')?.offsetHeight || 0;
        window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY - headerH - 20,
            behavior: 'smooth'
        });
    },

    isSoundEnabled() { return Sound.isEnabled(); },

    salute() {
        const robot = $('.hero-character .robot-img');
        if (robot) robot.click();
    },

    closeGame() { window.cerrarJuego && window.cerrarJuego(); }
};


/* ============================================================
   17. LOG DE BIENVENIDA
   ============================================================ */
console.log(
    '%c 🐝 AVENTURAS DE BEEBOT %c 28 juegos enlazados · 7 cursos y retos integrados · Música de fondo activa',
    'background: linear-gradient(90deg, #ffd93d, #ffb800, #7ed957); color: #3d1f00; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-family: sans-serif;',
    'color: #7ed957; font-weight: 700; padding: 4px 8px; font-family: sans-serif;'
);

/* ============================================================
   18. MINIATURAS DINÁMICAS SILENCIOSAS
   Mantiene el HTML real de cada juego como portada, pero evita
   que audio/video de las miniaturas se escuche en el portal.
   ============================================================ */
(function initSilentDynamicThumbs() {
    const previews = document.querySelectorAll('iframe.dynamic-thumb');

    function silence(frame) {
        try {
            const doc = frame.contentDocument;
            const win = frame.contentWindow;
            if (!doc || !win) return;

            const silenceMedia = () => {
                doc.querySelectorAll('audio, video').forEach(media => {
                    media.muted = true;
                    media.volume = 0;
                    try { media.pause(); } catch (_) {}
                });
            };
            silenceMedia();

            const observer = new MutationObserver(silenceMedia);
            if (doc.documentElement) observer.observe(doc.documentElement, { childList: true, subtree: true });

            try {
                if (win.Howler && typeof win.Howler.mute === 'function') win.Howler.mute(true);
            } catch (_) {}
        } catch (_) {}
    }

    previews.forEach(frame => {
        frame.setAttribute('allow', "autoplay 'none'");
        frame.addEventListener('load', () => {
            silence(frame);
            setTimeout(() => silence(frame), 150);
            setTimeout(() => silence(frame), 700);
        });
    });
})();

