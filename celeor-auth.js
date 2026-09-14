/* ═══════════════════════════════════════════════════════════════
   CELEOR AGENCY — comptes & session (lot A, 14/09/2026)
   Chargé dynamiquement par assistant.js sur toutes les pages.
   - initialise le client Supabase avec la clé PUBLIQUE (aucun secret ici)
   - lit la session, le profil, le rôle admin
   - injecte « Connexion / Mon espace / Administration » dans le header
   - alimente le catalogue et les fiches depuis la base
   Expose window.celeor : { sb, user, profil, isAdmin, ready, requireAuth, signOut }
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.celeor) return;

  var SUPABASE_URL = 'https://joctwxwwczrhxkbhsnim.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_q9sVpL2BOOAixuLu0MouZA_otgUHs4D';
  var SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/dist/umd/supabase.min.js';

  var resolveReady;
  var C = window.celeor = {
    url: SUPABASE_URL, key: SUPABASE_KEY,
    sb: null, user: null, profil: null, isAdmin: false,
    ready: new Promise(function (r) { resolveReady = r; })
  };

  /* ── SDK ──────────────────────────────────────────────────── */
  function loadSdk(cb) {
    if (window.supabase && window.supabase.createClient) return cb();
    var s = document.createElement('script');
    s.src = SDK_URL; s.async = true;
    s.onload = cb;
    s.onerror = function () { console.warn('[celeor-auth] SDK Supabase indisponible'); resolveReady(C); };
    document.head.appendChild(s);
  }

  /* ── Styles du header ─────────────────────────────────────── */
  function injectCss() {
    if (document.getElementById('celeor-auth-css')) return;
    var st = document.createElement('style');
    st.id = 'celeor-auth-css';
    st.textContent =
      '.btn-compte{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:6px;' +
      'border:1px solid rgba(255,255,255,0.15);color:var(--gray,#9A9AAA);font-size:12px;font-weight:600;' +
      'letter-spacing:1px;text-transform:uppercase;white-space:nowrap;transition:all .25s;text-decoration:none}' +
      '.btn-compte:hover{border-color:var(--gold3,#9A7A2E);color:var(--gold2,#E4C57A)}' +
      '.btn-compte.btn-admin{border-color:var(--gold3,#9A7A2E);color:var(--gold2,#E4C57A)}' +
      'html[data-theme="light"] .btn-compte{border-color:rgba(13,21,32,0.18)}' +
      '@media(max-width:640px){.btn-compte{padding:9px 10px;font-size:11px;letter-spacing:.5px}.btn-compte.btn-admin{display:none}}' +
      '.menu-col a.menu-admin{color:var(--gold2,#E4C57A)}';
    document.head.appendChild(st);
  }

  /* ── Header : Connexion / Mon espace / Administration ─────── */
  function injectHeader() {
    injectCss();
    var nr = document.querySelector('nav .nav-right');
    if (nr) {
      nr.querySelectorAll('.btn-compte').forEach(function (e) { e.remove(); });
      var menuBtn = nr.querySelector('.btn-menu');
      var a = document.createElement('a');
      a.className = 'btn-compte';
      if (C.user) { a.href = 'espace.html'; a.textContent = 'Mon espace'; }
      else { a.href = 'connexion.html'; a.textContent = 'Connexion'; }
      nr.insertBefore(a, menuBtn || null);
      if (C.isAdmin) {
        var b = document.createElement('a');
        b.className = 'btn-compte btn-admin'; b.href = 'admin.html'; b.textContent = 'Administration';
        nr.insertBefore(b, a);
      }
    }
    // Page d'accueil : boutons Connexion / S'inscrire déjà présents dans le header
    var cta = document.querySelector('nav .nav-cta');
    if (cta) {
      var btns = cta.querySelectorAll('.nav-account');
      if (btns.length >= 2) {
        if (C.user) {
          btns[0].textContent = 'Mon espace'; btns[0].onclick = function () { location.href = 'espace.html'; };
          if (C.isAdmin) { btns[1].textContent = 'Administration'; btns[1].onclick = function () { location.href = 'admin.html'; }; }
          else { btns[1].textContent = 'Déconnexion'; btns[1].onclick = function () { C.signOut(); }; }
        } else {
          btns[0].textContent = 'Connexion'; btns[0].onclick = function () { location.href = 'connexion.html'; };
          btns[1].textContent = 'S\'inscrire'; btns[1].onclick = function () { location.href = 'connexion.html#inscription'; };
        }
      }
    }
    // Bloc compte du menu (présent sur la page d'accueil)
    var ma = document.querySelector('.menu-account');
    if (ma) {
      ma.innerHTML = C.user
        ? '<button class="btn-outline" type="button" onclick="location.href=\'espace.html\'">Mon espace</button>' +
          '<button class="btn-primary" type="button" onclick="window.celeor.signOut()">Déconnexion</button>'
        : '<button class="btn-outline" type="button" onclick="location.href=\'connexion.html\'">Connexion</button>' +
          '<button class="btn-primary" type="button" onclick="location.href=\'connexion.html#inscription\'">S\'inscrire</button>';
    }
    // Entrées dans la dernière colonne du menu
    var cols = document.querySelectorAll('#menu-panel .menu-col');
    if (cols.length) {
      var col = cols[cols.length - 1];
      col.querySelectorAll('a.menu-compte').forEach(function (e) { e.remove(); });
      var l = document.createElement('a');
      l.className = 'menu-compte';
      if (C.user) { l.href = 'espace.html'; l.innerHTML = 'Mon espace<span>Profil, dossier, réglages</span>'; }
      else { l.href = 'connexion.html'; l.innerHTML = 'Connexion / Inscription<span>Prestataires et organisateurs</span>'; }
      l.addEventListener('click', function () { if (typeof closeMenu === 'function') closeMenu(); });
      col.appendChild(l);
      if (C.isAdmin) {
        var la = document.createElement('a');
        la.className = 'menu-compte menu-admin'; la.href = 'admin.html';
        la.innerHTML = 'Administration<span>Validation des dossiers</span>';
        col.appendChild(la);
      }
    }
  }

  /* ── Catalogue & fiches : lecture de la base ──────────────── */
  function nettoyerTarif(t) {
    if (!t) return '';
    var s = String(t).replace(/€/g, '').replace(/\s+/g, ' ').trim();
    return s ? s.replace(/[\s.,]*(ht|ttc)?$/i, '').trim() : '';
  }
  function mapProfil(r) {
    var sb = (window.celeorSub && r.sous_categorie) ? window.celeorSub(r.sous_categorie) : null;
    var cat = (window.celeorCat && r.categorie) ? window.celeorCat(r.categorie) : null;
    var tarif = nettoyerTarif(r.tarif_a_partir);
    return {
      id: r.slug, uid: r.user_id,
      n: r.nom_scene || 'Prestataire',
      t: sb ? sb.label : (cat ? cat.label : 'Prestataire'),
      c: r.categorie || '', sub: r.sous_categorie || '',
      city: r.ville || '', zone: r.zone || r.departement || '',
      price: tarif ? ('À partir de ' + tarif + ' €') : 'Sur devis',
      badge: 'Profil vérifié', r: 5, rev: 0,
      bio: r.bio || '',
      services: Array.isArray(r.services) ? r.services : [],
      availWeekdays: [0, 1, 2, 3, 4, 5, 6], booked: [],
      photo: r.photo_principale || '', galerie: Array.isArray(r.galerie) ? r.galerie : [], liens: r.liens || {}
    };
  }
  function hydraterCatalogue() {
    var p = location.pathname;
    var estCatalogue = /catalogue\.html$/.test(p), estFiche = /fiche\.html$/.test(p);
    if (!estCatalogue && !estFiche || !C.sb) return;
    C.sb.from('catalogue_public').select('*').order('updated_at', { ascending: false }).then(function (res) {
      if (res.error || !res.data) return;
      var rows = res.data.map(mapProfil);
      if (!Array.isArray(window.CELEOR_DATA)) window.CELEOR_DATA = [];
      var arr = window.CELEOR_DATA;
      rows.forEach(function (r) { if (!arr.some(function (x) { return x.id === r.id; })) arr.push(r); });
      try {
        if (estCatalogue && typeof render === 'function') render();
        if (estFiche) {
          var id = new URLSearchParams(location.search).get('id');
          var prof = rows.find(function (r) { return r.id === id; });
          if (prof) { P = prof; if (typeof render === 'function') render(); }
        }
      } catch (e) { /* la page n'expose pas encore P/render : sans effet */ }
    });
  }

  /* ── Session ──────────────────────────────────────────────── */
  function setUser(u) {
    C.user = u; C.isAdmin = false; C.profil = null;
    if (!u) return Promise.resolve();
    return Promise.all([
      C.sb.rpc('is_admin'),
      C.sb.from('profils').select('*').eq('user_id', u.id).maybeSingle()
    ]).then(function (rs) {
      C.isAdmin = rs[0].data === true;
      C.profil = rs[1].data || null;
    }).catch(function () {});
  }

  C.requireAuth = function () {
    return C.ready.then(function () {
      if (!C.user) {
        var next = location.pathname.split('/').pop() + location.search;
        location.replace('connexion.html?next=' + encodeURIComponent(next));
        return new Promise(function () {}); // on ne rend jamais la main
      }
      return C;
    });
  };
  C.requireAdmin = function () {
    return C.requireAuth().then(function () {
      if (!C.isAdmin) { location.replace('espace.html'); return new Promise(function () {}); }
      return C;
    });
  };
  C.signOut = function () {
    if (!C.sb) return;
    C.sb.auth.signOut().then(function () { location.href = 'index.html'; });
  };
  C.refreshProfil = function () { return setUser(C.user).then(function () { injectHeader(); return C.profil; }); };

  function init() {
    C.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' }
    });
    C.sb.auth.getSession()
      .then(function (r) { return setUser(r.data && r.data.session ? r.data.session.user : null); })
      .then(function () {
        injectHeader(); hydraterCatalogue(); resolveReady(C);
        document.dispatchEvent(new CustomEvent('celeor:ready'));
      });
    C.sb.auth.onAuthStateChange(function (ev, session) {
      var u = session ? session.user : null;
      if ((u && u.id) !== (C.user && C.user.id)) setUser(u).then(injectHeader);
    });
  }

  function start() { loadSdk(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
