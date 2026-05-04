/* ============================================
   main.js — Full Page Scroll + Inicialização
   ============================================ */

(function () {
  'use strict';

  const sections = document.querySelectorAll('.section');
  const nav = document.getElementById('section-nav');
  const dots = document.querySelectorAll('.nav-dot');
  let current = 0;
  let isTransitioning = false;

  // Inicializa primeira seção
  sections[current].classList.add('active');

  // Mostra navegação lateral ao carregar e ao rolar
  function showNav() {
    nav.classList.add('visible');
  }

  // Mostra nav após pequeno delay no carregamento
  setTimeout(showNav, 800);

  // Atualiza dots ativos
  function updateNav() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  // Clique nos dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (idx !== current) goToSection(idx);
    });
  });

  // GSAP Full Page Scroll
  function goToSection(index) {
    if (index < 0 || index >= sections.length || isTransitioning) return;
    isTransitioning = true;

    const outgoing = sections[current];
    const incoming = sections[index];

    gsap.to(outgoing, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        outgoing.classList.remove('active');
        outgoing.style.pointerEvents = 'none';
      }
    });

    incoming.classList.add('active');
    incoming.style.pointerEvents = 'auto';

    gsap.fromTo(incoming,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          isTransitioning = false;
          current = index;
          updateNav();
          // Anima elementos filhos com stagger
          animateSectionElements(incoming);
        }
      }
    );
  }

  function animateSectionElements(section) {
    const els = section.querySelectorAll('.section-title, .divider, .couple-names, .hero-invite, .countdown-grid, .location-block, .gifts-text, .raffle-info, .raffle-grid, .message-form, .message-carousel');
    gsap.fromTo(els,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }

  // Wheel / touch
  let wheelAccum = 0;
  const WHEEL_THRESHOLD = 50;

  window.addEventListener('wheel', (e) => {
    showNav();
    e.preventDefault();
    wheelAccum += e.deltaY;
    if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
      if (wheelAccum > 0) goToSection(current + 1);
      else goToSection(current - 1);
      wheelAccum = 0;
    }
  }, { passive: false });

  // Touch
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; showNav(); });
  window.addEventListener('touchend', (e) => {
    showNav();
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSection(current + 1);
      else goToSection(current - 1);
    }
  });

  // Teclado
  window.addEventListener('keydown', (e) => {
    showNav();
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goToSection(current + 1); }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goToSection(current - 1); }
  });

  // Inicializa módulos após Firebase estar pronto
  window.addEventListener('firebase-ready', () => {
    if (window.initRaffle) window.initRaffle();
    if (window.initMessages) window.initMessages();
    if (window.initCountdown) window.initCountdown();
    if (window.initAdmin) window.initAdmin();
  });

  // Se Firebase já carregou antes do listener
  if (window.firebaseReady) {
    window.dispatchEvent(new Event('firebase-ready'));
  }

})();
