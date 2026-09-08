/* CELEOR AGENCY — Dark / Light theme switcher
   Chargé dans le <head> : applique le thème mémorisé avant le rendu (pas de flash). */
(function () {
  var KEY = 'celeor-theme';
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');

  function setTheme(theme) {
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair');
      btns[i].setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
    setTimeout(function () { root.classList.remove('theme-switching'); }, 400);
  }

  function buildToggle() {
    if (document.querySelector('.theme-toggle')) return;
    var menuBtn = document.querySelector('.btn-menu');
    if (!menuBtn || !menuBtn.parentNode) return;
    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    var light = root.getAttribute('data-theme') === 'light';
    btn.setAttribute('aria-label', light ? 'Passer en mode sombre' : 'Passer en mode clair');
    btn.setAttribute('aria-pressed', light ? 'true' : 'false');
    btn.innerHTML =
      '<span class="tt-knob">' +
        '<svg class="tt-moon" viewBox="0 0 24 24" fill="none" stroke="#0D1520" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
        '<svg class="tt-sun" viewBox="0 0 24 24" fill="none" stroke="#0D1520" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '</span>';
    btn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
    menuBtn.parentNode.insertBefore(btn, menuBtn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToggle);
  } else {
    buildToggle();
  }
})();

/* Visuels des cartes categories : reutilise les images deja presentes dans data.js
   (evite de les dupliquer dans le HTML de la page d'accueil). */
(function () {
  function applyCategoryPhotos() {
    var photos = window.CELEOR_PHOTOS;
    if (!photos) return;
    var cards = document.querySelectorAll('.cat-card');
    for (var i = 0; i < cards.length; i++) {
      var ph = cards[i].querySelector('.cat-photo');
      if (!ph || ph.style.backgroundImage) continue;
      var href = cards[i].getAttribute('href') || '';
      var slug = href.split('#')[1];
      if (slug && photos[slug]) ph.style.backgroundImage = 'url(' + photos[slug] + ')';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCategoryPhotos);
  } else {
    applyCategoryPhotos();
  }
})();

/* --- Indicateur d'envoi partagé par tous les formulaires (08/09/2026) -----
   Affiche immédiatement « Envoi en cours… » au clic, avant même que le
   serveur réponde, puis rassure si l'attente dépasse 4 s.
   Renvoie une fonction à appeler dès que la réponse arrive.            */
window.celeorPending = function (msg, btn, texte) {
  var libelle = btn ? btn.textContent : '';
  var base = '<span class="cl-spin" aria-hidden="true"></span>' + (texte || 'Envoi en cours…');
  if (btn) btn.textContent = 'Envoi en cours…';
  msg.setAttribute('role', 'status');
  msg.className = 'form-msg pending';
  msg.innerHTML = base;
  var relance = setTimeout(function () {
    msg.innerHTML = base + ' <span style="opacity:.8">Encore quelques secondes, ne fermez pas la page.</span>';
  }, 4000);
  return function () {
    clearTimeout(relance);
    msg.removeAttribute('role');
    if (btn) btn.textContent = libelle;
  };
};
