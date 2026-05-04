/* ============================================
   admin.js — Painel Admin (senha hardcoded)
   ============================================ */

(function () {
  'use strict';

  const ADMIN_PASSWORD = 'kauaana2026'; // ⚠️ Alterar em produção

  const panel = document.getElementById('admin-panel');
  const loginDiv = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const loginBtn = document.getElementById('admin-login-btn');
  const logoutBtn = document.getElementById('admin-logout');
  const passwordInput = document.getElementById('admin-password');

  window.initAdmin = function () {
    // Verifica se deve abrir via URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      panel.style.display = 'flex';
    }
  };

  loginBtn.addEventListener('click', () => {
    if (passwordInput.value === ADMIN_PASSWORD) {
      loginDiv.style.display = 'none';
      dashboard.style.display = 'block';
      renderAdminTabs();
    } else {
      alert('Senha incorreta.');
    }
  });

  logoutBtn.addEventListener('click', () => {
    dashboard.style.display = 'none';
    loginDiv.style.display = 'block';
    panel.style.display = 'none';
    passwordInput.value = '';
  });

  // Tabs
  function renderAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tabs button');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Esconde todos
        document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
        // Mostra o selecionado
        const target = document.getElementById(`admin-tab-${tab.dataset.tab}`);
        if (target) target.style.display = 'block';
        // Renderiza conteúdo
        if (tab.dataset.tab === 'raffle' && window.adminRaffle) window.adminRaffle.renderAdmin(target);
        if (tab.dataset.tab === 'messages' && window.adminMessages) window.adminMessages.renderAdmin(target);
        if (tab.dataset.tab === 'codes') renderCodesTab(target);
        if (tab.dataset.tab === 'config') renderConfigTab(target);
      });
    });

    // Abre primeira tab
    const firstTab = document.querySelector('.admin-tabs button');
    if (firstTab) firstTab.click();
  }

  function renderCodesTab(container) {
    container.innerHTML = `
      <h3>Códigos de Convite</h3>
      <button class="btn" onclick="window.adminCodes.generateBatch()">Gerar Lote (10)</button>
      <div id="codes-list" style="margin-top:10px"></div>
    `;
    window.adminCodes = {
      generateBatch: () => {
        const batch = [];
        for (let i = 0; i < 10; i++) {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          batch.push(window.firestoreHelpers.addInviteCode({ code }));
        }
        Promise.all(batch).then(() => {
          alert('Lote gerado!');
          renderCodesTab(container);
        });
      }
    };

    if (window.firestoreHelpers) {
      window.firestoreHelpers.getInviteCodes().then(snapshot => {
        const list = document.getElementById('codes-list');
        list.innerHTML = '';
        snapshot.forEach(doc => {
          const c = doc.data();
          const div = document.createElement('div');
          div.style.cssText = 'border:1px solid var(--border);padding:8px;margin:3px 0;font-size:0.9rem';
          div.textContent = `${c.code} — ${c.used ? 'Usado por ' + (c.usedBy || '?') : 'Disponível'}`;
          list.appendChild(div);
        });
      });
    }
  }

  function renderConfigTab(container) {
    container.innerHTML = `
      <h3>Configurações</h3>
      <input type="text" id="cfg-photo" placeholder="URL da foto do casal">
      <input type="text" id="cfg-date" placeholder="Data (2026-05-16T19:00)">
      <input type="text" id="cfg-whatsapp" placeholder="WhatsApp (5568992812731)">
      <input type="text" id="cfg-havan" placeholder="Link Havan">
      <button class="btn" onclick="window.adminSaveConfig()">Salvar</button>
    `;

    window.adminSaveConfig = () => {
      const photo = document.getElementById('cfg-photo').value;
      const date = document.getElementById('cfg-date').value;
      const whatsapp = document.getElementById('cfg-whatsapp').value;
      const havan = document.getElementById('cfg-havan').value;

      window.db.collection('config').doc('wedding').set({
        couplePhotoUrl: photo,
        weddingDate: date,
        whatsappNumber: whatsapp,
        havanListUrl: havan
      }, { merge: true }).then(() => alert('Config salva!'));
    };

    // Carrega valores atuais
    if (window.firestoreHelpers) {
      window.firestoreHelpers.getConfig().then(doc => {
        if (doc.exists) {
          const d = doc.data();
          if (d.couplePhotoUrl) document.getElementById('cfg-photo').value = d.couplePhotoUrl;
          if (d.weddingDate) document.getElementById('cfg-date').value = d.weddingDate;
          if (d.whatsappNumber) document.getElementById('cfg-whatsapp').value = d.whatsappNumber;
          if (d.havanListUrl) document.getElementById('cfg-havan').value = d.havanListUrl;
        }
      });
    }
  }

})();
