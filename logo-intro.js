/* ══════════════════════════════════════════════════════════════════════
   CELEOR AGENCY — Cinématique d'assemblage du logo
   S'enchaîne juste après le compte à rebours 3-2-1 (#intro-loader).
   Zéro dépendance. Zéro modification du script du compte à rebours :
   on observe simplement l'apparition de la classe .intro-out.
   Les 13 morceaux (C-E-L-E-O-R, monogramme, A-G-E-N-C-Y) sont découpés
   à la volée dans l'image du logo déjà présente dans le hero.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var loader = document.getElementById('intro-loader');
  var img = document.querySelector('.hero-logo-img');
  if (!loader || !img) return;                                  // pas d'intro sur cette page

  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (reduced) return;                                          // accessibilité : pas de cinématique

  /* ── Découpe du logo (fractions de l'image source 571×639, même ratio que le webp du hero) ── */
  var W = 571, H = 639;
  // [x0, y0, x1, y1, dirX, dirY, rotation°, échelle départ, délai s, durée s]
  var PIECES = [
    [  0,   0,  78,  92, -1, -1, -200, 0.35, 0.05, 2.1],   // C
    [ 86,   0, 165,  92,  0, -1,  140, 1.90, 0.17, 2.1],   // E
    [181,   0, 260,  92,  1, -1,  -95, 0.50, 0.29, 2.1],   // L
    [273,   0, 353,  92,  1,  0,  160, 2.20, 0.41, 2.1],   // E
    [366,   0, 461,  92, -1,  0, -120, 0.40, 0.53, 2.1],   // O
    [473,   0, 564,  92,  1,  1,  210, 1.60, 0.65, 2.1],   // R
    [  0, 549, 103, 639, -1,  1,  180, 0.45, 0.45, 2.1],   // A
    [106, 549, 189, 639,  0,  1, -150, 2.00, 0.57, 2.1],   // G
    [203, 549, 279, 639,  1, -1,  100, 0.50, 0.69, 2.1],   // E
    [292, 549, 383, 639, -1, -1, -220, 1.80, 0.81, 2.1],   // N
    [398, 549, 477, 639,  1,  1,  130, 0.40, 0.93, 2.1],   // C
    [480, 549, 571, 639, -1,  0, -110, 2.10, 1.05, 2.1],   // Y
    [100, 120, 464, 517,  0,  0,  -30, 3.20, 1.15, 2.25]   // Monogramme (zoom depuis le centre)
  ];
  var T_LAND   = 3.40;   // s — le monogramme se cale (dernier morceau) : éclat doré + onde
  var T_SWAP   = 4.20;   // s — bascule vers la vraie image + révélation du hero
  var T_END    = 5.00;   // s — nettoyage

  /* ── CSS injecté ── */
  var css = ''
    + 'body.logo-intro .hero-logo-img{opacity:0!important;animation:none!important}'
    + 'body.logo-intro-done .hero-logo-img{opacity:1!important;animation:none!important}'
    /* Pendant la cinématique : le reste du hero est masqué (classe logo-intro-hide).
       À la révélation on RETIRE cette classe : chaque élément revient à son style d'origine
       (opacité 1), la transition ci-dessous fait le fondu. Une seule règle par état, pas de
       duel de priorités entre deux !important. */
    + 'body.logo-intro-hide .hero-content>:not(.hero-logo-img){opacity:0!important;transform:translateY(16px)!important;animation:none!important}'
    + 'body.logo-intro .hero-content>:not(.hero-logo-img){animation:none!important;transition:opacity .8s ease,transform .8s cubic-bezier(.2,.9,.25,1)}'
    + 'body.logo-intro .hero-content>:nth-child(2){transition-delay:.05s}'
    + 'body.logo-intro .hero-content>:nth-child(3){transition-delay:.15s}'
    + 'body.logo-intro .hero-content>:nth-child(4){transition-delay:.25s}'
    + 'body.logo-intro .hero-content>:nth-child(5){transition-delay:.35s}'
    + 'body.logo-intro .hero-content>:nth-child(n+6){transition-delay:.45s}'
    + '#logo-intro-stage{position:absolute;z-index:100001;pointer-events:none;will-change:filter;filter:drop-shadow(0 8px 40px rgba(201,168,76,0));transition:filter .6s ease,opacity .25s ease}'
    + '#logo-intro-stage.formed{filter:drop-shadow(0 8px 40px rgba(201,168,76,.25))}'
    + '#logo-intro-stage.out{opacity:0}'
    + '#logo-intro-stage .lp{position:absolute;background-repeat:no-repeat;will-change:transform,opacity,filter;opacity:0;'
    +   'animation:logoPieceIn var(--dur) linear var(--delay) both}'
    + '@keyframes logoPieceIn{'
    +   '0%{opacity:0;transform:translate(var(--tx),var(--ty)) rotate(var(--rot)) scale(var(--sc));filter:blur(12px);animation-timing-function:cubic-bezier(.35,.1,.35,1)}'
    +   '10%{opacity:1}'
    +   '64%{transform:translate(calc(var(--tx) * .13),calc(var(--ty) * .13)) rotate(calc(var(--rot) * .1)) scale(calc(1 + (var(--sc) - 1) * .12));filter:blur(2px);animation-timing-function:cubic-bezier(.3,1.4,.55,1)}'
    +   '100%{opacity:1;transform:none;filter:blur(0)}}'
    + '#logo-intro-stage .shine{position:absolute;inset:0;opacity:0;pointer-events:none;'
    +   '-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;'
    +   'background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,250,225,.95) 47%,rgba(255,255,255,1) 50%,rgba(255,250,225,.95) 53%,rgba(255,255,255,0) 70%);'
    +   'background-size:260% 100%;background-position:120% 0}'
    + '#logo-intro-stage.formed .shine{animation:logoShine .75s cubic-bezier(.4,0,.2,1) both}'
    + '@keyframes logoShine{0%{opacity:0;background-position:120% 0}15%{opacity:1}85%{opacity:1}100%{opacity:0;background-position:-20% 0}}'
    + '#logo-intro-stage .pulse{position:absolute;left:50%;top:50%;width:60%;padding-top:60%;margin:-30% 0 0 -30%;border-radius:50%;opacity:0;pointer-events:none;'
    +   'border:2px solid rgba(228,197,122,.9);box-shadow:0 0 40px rgba(228,197,122,.55),inset 0 0 30px rgba(228,197,122,.35)}'
    + '#logo-intro-stage.formed .pulse{animation:logoPulse .9s ease-out both}'
    + '@keyframes logoPulse{0%{opacity:.9;transform:scale(.35)}100%{opacity:0;transform:scale(2.4)}}'
    + '@media (prefers-reduced-motion:reduce){#logo-intro-stage{display:none}}';
  var style = document.createElement('style');
  style.id = 'logo-intro-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ── État ── */
  var body = document.body;
  body.classList.add('logo-intro');
  body.classList.add('logo-intro-hide');
  var stage = null, started = false, finished = false, timers = [];

  function later(fn, s) { timers.push(setTimeout(fn, s * 1000)); }

  /* Position de la scène = rectangle exact de l'image du hero (coordonnées document) */
  function placeStage() {
    if (!stage) return;
    var r = img.getBoundingClientRect();
    var sx = window.pageXOffset || document.documentElement.scrollLeft || 0;
    var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
    stage.style.left = (r.left + sx) + 'px';
    stage.style.top = (r.top + sy) + 'px';
    stage.style.width = r.width + 'px';
    stage.style.height = r.height + 'px';
    var w = r.width, h = r.height;
    var kids = stage.querySelectorAll('.lp');
    for (var i = 0; i < kids.length; i++) {
      var p = PIECES[i], el = kids[i];
      var x0 = p[0] / W * w, y0 = p[1] / H * h, pw = (p[2] - p[0]) / W * w, ph = (p[3] - p[1]) / H * h;
      el.style.left = x0 + 'px';
      el.style.top = y0 + 'px';
      el.style.width = pw + 'px';
      el.style.height = ph + 'px';
      el.style.backgroundSize = w + 'px ' + h + 'px';
      el.style.backgroundPosition = (-x0) + 'px ' + (-y0) + 'px';
    }
  }

  function build() {
    stage = document.createElement('div');
    stage.id = 'logo-intro-stage';
    stage.setAttribute('aria-hidden', 'true');
    var src = 'url("' + (img.currentSrc || img.src) + '")';
    for (var i = 0; i < PIECES.length; i++) {
      var p = PIECES[i];
      var el = document.createElement('div');
      el.className = 'lp';
      el.style.backgroundImage = src;
      el.style.setProperty('--tx', (p[4] * 68) + 'vw');
      el.style.setProperty('--ty', (p[5] * 68) + 'vh');
      el.style.setProperty('--rot', p[6] + 'deg');
      el.style.setProperty('--sc', p[7]);
      el.style.setProperty('--delay', p[8] + 's');
      el.style.setProperty('--dur', p[9] + 's');
      stage.appendChild(el);
    }
    var pulse = document.createElement('div'); pulse.className = 'pulse'; stage.appendChild(pulse);
    var shine = document.createElement('div'); shine.className = 'shine';
    shine.style.webkitMaskImage = src; shine.style.maskImage = src;
    stage.appendChild(shine);
    body.appendChild(stage);
    placeStage();
  }

  function start() {
    if (started) return;
    started = true;
    build();
    window.addEventListener('resize', placeStage);
    later(function () { if (stage) stage.classList.add('formed'); }, T_LAND);
    later(swap, T_SWAP);
    later(finish, T_END);
    document.addEventListener('click', finish, true);
    document.addEventListener('keydown', finish, true);
    document.addEventListener('touchstart', finish, { capture: true, passive: true });
  }

  function swap() {
    body.classList.add('logo-intro-done');       // la vraie image prend le relais, pixel pour pixel
    body.classList.remove('logo-intro-hide');    // le reste du hero se révèle (transition en cascade)
    if (stage) stage.classList.add('out');
  }

  function finish() {
    if (finished) return;
    finished = true;
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    window.removeEventListener('resize', placeStage);
    document.removeEventListener('click', finish, true);
    document.removeEventListener('keydown', finish, true);
    document.removeEventListener('touchstart', finish, true);
    body.classList.add('logo-intro-done');
    body.classList.remove('logo-intro-hide');
    if (stage && stage.parentNode) stage.parentNode.removeChild(stage);
    stage = null;
    // Les classes d'état restent en place : elles figent le hero dans son état final
    // (opacité 1, pas de transform) et empêchent les animations d'entrée d'origine de rejouer.
  }

  /* ── Déclencheur : la classe .intro-out apparaît sur le loader (fin du 3-2-1) ── */
  var mo = new MutationObserver(function () {
    if (loader.classList.contains('intro-out')) { mo.disconnect(); later(start, 0.15); }
  });
  mo.observe(loader, { attributes: true, attributeFilter: ['class'] });

  /* Sécurités : loader retiré sans .intro-out (déjà vu dans la session) ou temps anormal */
  var bodyMo = new MutationObserver(function () {
    if (!document.getElementById('intro-loader') && !started) { bodyMo.disconnect(); mo.disconnect(); finish(); }
    if (started) bodyMo.disconnect();
  });
  bodyMo.observe(document.body, { childList: true });
  later(function () { if (!started) finish(); }, 15);
})();

