/* ============================================
   messages.js — Envio + Carrossel
   ============================================ */

(function () {
  'use strict';

  const form = document.getElementById('message-form');
  const carouselTrack = document.querySelector('.carousel-track');
  let messages = [];
  let currentSlide = 0;
  let autoPlayInterval;

  window.initMessages = function () {
    form.addEventListener('submit', onSubmit);
    loadMessages();
  };

  function onSubmit(e) {
    e.preventDefault();
    const code = document.getElementById('msg-code').value.trim();
    const name = document.getElementById('msg-name').value.trim();
    const text = document.getElementById('msg-text').value.trim();

    if (!code || !name || !text) return;

    // Valida código
    if (!window.firestoreHelpers) return;
    window.firestoreHelpers.validateCode(code).then(snapshot => {
      if (snapshot.empty) {
        alert('Código de convite inválido ou já utilizado.');
        return;
      }

      const codeDoc = snapshot.docs[0];
      // Salva mensagem
      window.firestoreHelpers.addMessage({ guestName: name, text, inviteCode: code }).then(() => {
        // Marca código usado
        window.firestoreHelpers.markCodeUsed(codeDoc.id, name);
        form.reset();
        alert('Mensagem enviada! Ela aparecerá no carrossel após aprovação.');
      });
    }).catch(() => {
      alert('Erro ao validar código. Tente novamente.');
    });
  }

  function loadMessages() {
    if (!window.firestoreHelpers) return;
    window.firestoreHelpers.getApprovedMessages().then(snapshot => {
      messages = [];
      snapshot.forEach(doc => messages.push(doc.data()));
      currentSlide = 0;
      renderCarousel();
      startAutoPlay();
    }).catch(() => {});
  }

  function renderCarousel() {
    carouselTrack.innerHTML = '';
    if (messages.length === 0) {
      carouselTrack.innerHTML = '<div class="message-card"><p class="msg-text">Nenhuma mensagem ainda. Seja o primeiro!</p></div>';
      return;
    }

    messages.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'message-card';
      card.innerHTML = `<p class="msg-author">${escapeHtml(msg.guestName)}</p><p class="msg-text">"${escapeHtml(msg.text)}"</p>`;
      carouselTrack.appendChild(card);
    });

    updateCarouselPosition();
  }

  function updateCarouselPosition() {
    const isMobile = window.innerWidth < 768;
    const slideWidth = isMobile ? 100 : 50;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
  }

  function startAutoPlay() {
    clearInterval(autoPlayInterval);
    if (messages.length <= 1) return;
    autoPlayInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % messages.length;
      updateCarouselPosition();
    }, 4000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Admin
  window.adminMessages = {
    renderAdmin: (container) => {
      window.firestoreHelpers.getAllMessages().then(snapshot => {
        container.innerHTML = '<h3>Mensagens</h3>';
        snapshot.forEach(doc => {
          const msg = doc.data();
          const div = document.createElement('div');
          div.style.cssText = 'border:1px solid var(--border);padding:10px;margin:5px 0;text-align:left';
          div.innerHTML = `
            <p><strong>${escapeHtml(msg.guestName)}</strong> ${msg.approved ? '✅' : '⏳'}</p>
            <p style="font-style:italic">"${escapeHtml(msg.text)}"</p>
            <p style="font-size:0.8rem;color:var(--text-muted)">Código: ${escapeHtml(msg.inviteCode)}</p>
            <button onclick="window.firestoreHelpers.approveMessage('${doc.id}').then(()=>location.reload())" style="margin-right:5px">Aprovar</button>
            <button onclick="window.firestoreHelpers.deleteMessage('${doc.id}').then(()=>location.reload())">Excluir</button>
          `;
          container.appendChild(div);
        });
      });
    }
  };

})();
