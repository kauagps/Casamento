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
  let sharedCode = '';

  window.initMessages = function () {
    // Lê o código compartilhado do Firestore
    if (window.firestoreHelpers) {
      window.firestoreHelpers.getConfig().then(doc => {
        if (doc.exists) {
          sharedCode = doc.data().sharedCode || '';
        }
      });
    }
    form.addEventListener('submit', onSubmit);
    loadMessages();
  };

  function onSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('msg-name').value.trim();
    const text = document.getElementById('msg-text').value.trim();

    if (!name || !text) return;
    if (!sharedCode) {
      alert('Erro: código de convite não configurado. Tente recarregar a página.');
      return;
    }

    if (!window.firestoreHelpers) return;

    window.firestoreHelpers.addMessage({ guestName: name, text, inviteCode: sharedCode }).then(() => {
      form.reset();
      alert('Mensagem enviada! Ela aparecerá no carrossel após aprovação.');
    }).catch(() => {
      alert('Erro ao enviar mensagem. Tente novamente.');
    });
  }

  function loadMessages() {
    if (!window.firestoreHelpers) return;
    window.firestoreHelpers.getApprovedMessages().then(snapshot => {
      messages = [];
      snapshot.forEach(doc => messages.push(doc.data()));
      // Ordena por data de criação (mais recentes primeiro)
      messages.sort((a, b) => {
        const ta = a.createdAt?.toDate?.() || 0;
        const tb = b.createdAt?.toDate?.() || 0;
        return tb - ta;
      });
      currentSlide = 0;
      renderCarousel();
      startAutoPlay();
    }).catch(err => {
      carouselTrack.innerHTML = '<div class="message-card"><p class="msg-text">Erro ao carregar mensagens. Verifique o console.</p></div>';
      console.error('Erro ao carregar mensagens:', err);
    });
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
        const msgs = [];
        snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
        msgs.sort((a, b) => {
          const ta = a.createdAt?.toDate?.() || 0;
          const tb = b.createdAt?.toDate?.() || 0;
          return tb - ta; // mais recentes primeiro
        });
        container.innerHTML = '<h3>Mensagens</h3>';
        msgs.forEach(msg => {
          const div = document.createElement('div');
          div.style.cssText = 'border:1px solid var(--border);padding:10px;margin:5px 0;text-align:left';
          div.innerHTML = `
            <p><strong>${escapeHtml(msg.guestName)}</strong> ${msg.approved ? '✅' : '⏳'}</p>
            <p style="font-style:italic">"${escapeHtml(msg.text)}"</p>
            <p style="font-size:0.8rem;color:var(--text-muted)">Código: ${escapeHtml(msg.inviteCode)}</p>
            <button onclick="window.firestoreHelpers.approveMessage('${msg.id}').then(()=>location.reload())" style="margin-right:5px">Aprovar</button>
            <button onclick="window.firestoreHelpers.deleteMessage('${msg.id}').then(()=>location.reload())">Excluir</button>
          `;
          container.appendChild(div);
        });
      }).catch(err => {
        container.innerHTML = '<p style="color:red">Erro ao carregar mensagens: ' + err.message + '</p>';
      });
    }
  };

})();
