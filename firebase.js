/* ============================================
   firebase.js — Config + Helpers Firestore
   ============================================ */

(function () {
  'use strict';

  // ⚠️ Substitua pela sua config do Firebase
  const firebaseConfig = {

  apiKey: "AIzaSyAR-2ktvSSJ_S_zkQ9DBiXhUzfjZJ954Lo",

  authDomain: "convite-de-casamento-cd5a3.firebaseapp.com",

  projectId: "convite-de-casamento-cd5a3",

  storageBucket: "convite-de-casamento-cd5a3.firebasestorage.app",

  messagingSenderId: "267776276329",

  appId: "1:267776276329:web:f6ec61ff3d2318e1af2ff8"

};


  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // --- Helpers ---

  // Config
  function getConfig() {
    return db.collection('config').doc('wedding').get();
  }

  // Rifa
  function getRaffleNumbers() {
    return db.collection('raffle').doc('numbers').collection('items').get();
  }

  function updateRaffleNumber(num, data) {
    return db.collection('raffle').doc('numbers').collection('items').doc(String(num)).set(data, { merge: true });
  }

  // Mensagens
  function addMessage(data) {
    return db.collection('messages').add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      approved: false
    });
  }

  function getApprovedMessages() {
    return db.collection('messages').where('approved', '==', true).orderBy('createdAt', 'desc').get();

  }

  function getAllMessages() {
    return db.collection('messages').orderBy('createdAt', 'desc').get();
  }

  function approveMessage(id) {
    return db.collection('messages').doc(id).update({ approved: true });
  }

  function deleteMessage(id) {
    return db.collection('messages').doc(id).delete();
  }

  // Códigos
  function getInviteCodes() {
    return db.collection('inviteCodes').get();
  }

  function validateCode(code) {
    return db.collection('inviteCodes').where('code', '==', code).where('used', '==', false).get();
  }

  function markCodeUsed(codeId, usedBy) {
    return db.collection('inviteCodes').doc(codeId).update({
      used: true,
      usedBy: usedBy,
      usedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  function addInviteCode(data) {
    return db.collection('inviteCodes').add({
      ...data,
      used: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  // Expor globalmente
  window.db = db;
  window.firestoreHelpers = {
    getConfig, getRaffleNumbers, updateRaffleNumber,
    addMessage, getApprovedMessages, getAllMessages, approveMessage, deleteMessage,
    getInviteCodes, validateCode, markCodeUsed, addInviteCode
  };

  window.firebaseReady = true;
  window.dispatchEvent(new Event('firebase-ready'));

})();
