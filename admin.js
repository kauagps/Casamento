/* ============================================
   admin.js — Painel Admin (senha via Firestore)
   ============================================ */

(function () {
  'use strict';

  const ADMIN_PASSWORD_FALLBACK = 'kauaana2026'; // usado se não houver no Firestore
  let adminPassword = ADMIN_PASSWORD_FALLBACK;

  const panel = document.getElementById('admin-panel');
  const loginDiv = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const loginBtn = document.getElementById('admin-login-btn');
  const logoutBtn = document.getElementById('admin-logout');
  const passwordInput = document.getElementById('admin-password');

  window.initAdmin = function () {
    // Carrega senha do Firestore
    if (window.firestoreHelpers) {
      window.firestoreHelpers.getConfig().then(doc => {
        if (doc.exists && doc.data().adminPassword) {
          adminPassword = doc.data().adminPassword;
        }
      }).catch(() => {});
    }
    // Verifica se deve abrir via URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      panel.style.display = 'flex';
    }
  };

  loginBtn.addEventListener('click', () => {
    if (passwordInput.value === adminPassword) {
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
        if (tab.dataset.tab === 'config') renderConfigTab(target);
      });
    });

    // Abre primeira tab
    const firstTab = document.querySelector('.admin-tabs button');
    if (firstTab) firstTab.click();
  }

  function renderConfigTab(container) {
    container.innerHTML = `
      <h3>Configurações</h3>
      <input type="text" id="cfg-photo" placeholder="URL da foto do casal">
      <input type="text" id="cfg-date" placeholder="Data (2026-05-16T19:00)">
      <input type="text" id="cfg-whatsapp" placeholder="WhatsApp (5568992812731)">
      <input type="text" id="cfg-havan" placeholder="Link Havan">
      <input type="text" id="cfg-sharedcode" placeholder="Código compartilhado (CASAMENTO2026)">
      <input type="password" id="cfg-password" placeholder="Nova senha admin (deixe em branco para manter)">
      <button class="btn" onclick="window.adminSaveConfig()">Salvar</button>
    `;

    window.adminSaveConfig = () => {
      const photo = document.getElementById('cfg-photo').value;
      const date = document.getElementById('cfg-date').value;
      const whatsapp = document.getElementById('cfg-whatsapp').value;
      const havan = document.getElementById('cfg-havan').value;
      const password = document.getElementById('cfg-password').value;
      const sharedCode = document.getElementById('cfg-sharedcode').value;

      const data = {
        couplePhotoUrl: photo,
        weddingDate: date,
        whatsappNumber: whatsapp,
        havanListUrl: havan
      };
      if (password) data.adminPassword = password;
      if (sharedCode) data.sharedCode = sharedCode;

      window.db.collection('config').doc('wedding').set(data, { merge: true }).then(() => {
        if (password) adminPassword = password;
        alert('Config salva!');
      });
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
          if (d.sharedCode) document.getElementById('cfg-sharedcode').value = d.sharedCode;
        }
      });
    }
  }

})();
