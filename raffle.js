/* ============================================
   raffle.js — Grade de Rifas + Estado
   ============================================ */

(function () {
  'use strict';

  const TOTAL = 100;
  const WHATSAPP = '5568992812731';
  const grid = document.getElementById('raffle-grid');
  const waLink = document.getElementById('raffle-whatsapp');
  let raffleState = {};

  window.initRaffle = function () {
    renderGrid();
    loadRaffleState();
    setupWhatsAppLink();
  };

  function renderGrid() {
    grid.innerHTML = '';
    for (let i = 1; i <= TOTAL; i++) {
      const el = document.createElement('div');
      el.className = 'raffle-number available';
      el.dataset.num = i;
      el.textContent = i;
      el.title = `Comprar número ${i}`;
      el.addEventListener('click', () => onNumberClick(i));
      grid.appendChild(el);
    }
  }

  function loadRaffleState() {
    if (!window.firestoreHelpers) return;
    window.firestoreHelpers.getRaffleNumbers().then(snapshot => {
      snapshot.forEach(doc => {
        raffleState[doc.id] = doc.data();
      });
      updateGridVisual();
    }).catch(() => {
      // Firestore pode não ter dados ainda
    });
  }

  function updateGridVisual() {
    document.querySelectorAll('.raffle-number').forEach(el => {
      const num = el.dataset.num;
      const data = raffleState[num];
      if (data && data.sold) {
        el.className = 'raffle-number sold';
        el.title = `Vendido: ${data.buyerName || ''}`;
      } else {
        el.className = 'raffle-number available';
        el.title = `Comprar número ${num}`;
      }
    });
  }

  function onNumberClick(num) {
    if (raffleState[num] && raffleState[num].sold) return;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Gostaria de comprar o número ${num} da rifa do casamento de Kauã & Ana.`)}`;
    window.open(url, '_blank');
  }

  function setupWhatsAppLink() {
    waLink.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de participar da rifa do casamento de Kauã & Ana.')}`;
  }

  // Admin: marcar/desmarcar
  window.adminRaffle = {
    getState: () => raffleState,
    markSold: (num, buyerName) => {
      const data = { sold: true, buyerName: buyerName || '', soldAt: new Date() };
      raffleState[num] = data;
      return window.firestoreHelpers.updateRaffleNumber(num, data).then(updateGridVisual);
    },
    markAvailable: (num) => {
      const data = { sold: false, buyerName: '', soldAt: null };
      raffleState[num] = data;
      return window.firestoreHelpers.updateRaffleNumber(num, data).then(updateGridVisual);
    },
    renderAdmin: (container) => {
      container.innerHTML = '<h3>Rifa — 1 a 100</h3>';
      const adminGrid = document.createElement('div');
      adminGrid.className = 'raffle-grid';
      adminGrid.style.maxWidth = '100%';

      for (let i = 1; i <= TOTAL; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        const isSold = raffleState[i] && raffleState[i].sold;
        btn.style.cssText = isSold
          ? 'background:var(--primary);color:#fff;border:1px solid var(--primary);padding:4px;cursor:pointer'
          : 'background:#fff;color:var(--primary);border:1px solid var(--primary);padding:4px;cursor:pointer';
        btn.onclick = (function(num) {
          return function() {
            const currentData = raffleState[num] || {};
            if (currentData.sold) {
              if (confirm('Deseja marcar como disponível novamente?')) {
                window.adminRaffle.markAvailable(num);
              }
            } else {
              const name = prompt('Nome do comprador:');
              if (name !== null && name.trim()) {
                window.adminRaffle.markSold(num, name.trim());
              }
            }
          };
        })(i);
        adminGrid.appendChild(btn);
      }
      container.appendChild(adminGrid);
    }
  };

})();
