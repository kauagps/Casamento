/* ============================================
   countdown.js — Contagem Regressiva
   ============================================ */
(function () {
  'use strict';

  const targetDate = new Date('2026-05-16T19:00:00');

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');
  const timerEl = document.getElementById('countdown-timer');
  const doneEl = document.getElementById('countdown-done');

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      timerEl.style.display = 'none';
      doneEl.style.display = 'block';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  window.initCountdown = function () {
    update();
    setInterval(update, 1000);
  };

})();
