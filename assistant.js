/* ─────────────────────────────────────────────────────────────
   Celeor Agency — Assistant « Trouver mon prestataire »
   Widget autonome : conversation guidée + compréhension du texte libre.
   Dépend de data.js (window.CELEOR_CATS / CELEOR_DATA / celeorSub).
   Aucune API externe : tout tourne dans le navigateur.
   ───────────────────────────────────────────────────────────── */
(function(){
  if (window.__celeorAssistant) return; window.__celeorAssistant = true;
  var CATS = window.CELEOR_CATS || [], DATA = window.CELEOR_DATA || [], SUBS = window.CELEOR_SUBS || [];
  var CITIES = ['Toulouse','Paris','Marseille','Lyon','Bordeaux','Montpellier','Nantes','Nice','Lille','Strasbourg'];
  var EVENTS = ['Mariage','Anniversaire','Soirée privée',"Événement d'entreprise / séminaire",'Lancement de produit','Gala / soirée de prestige','Festival / concert','Autre'];
  var BUDGETS = ['Moins de 500 €','500 – 1 000 €','1 000 – 2 500 €','2 500 – 5 000 €','Plus de 5 000 €','Je ne sais pas encore'];

  /* Synonymes → sous-catégorie (slug) */
  var SYN = {
    'dj':'dj','deejay':'dj','disc jockey':'dj','platine':'dj','sono':'dj',
    'chanteur':'chanteur-chanteuse','chanteuse':'chanteur-chanteuse','chant':'chanteur-chanteuse','voix':'chanteur-chanteuse','gospel':'chanteur-chanteuse','jazz':'chanteur-chanteuse','soul':'chanteur-chanteuse',
    'groupe':'groupe-musique','band':'groupe-musique','fanfare':'groupe-musique','brass':'groupe-musique','musicien':'groupe-musique','musiciens':'groupe-musique','quatuor':'groupe-musique','cordes':'groupe-musique',
    'orchestre':'orchestre-live','pianiste':'pianiste','piano':'pianiste','violon':'violoniste','violoniste':'violoniste','sax':'saxophoniste','saxo':'saxophoniste','saxophoniste':'saxophoniste',
    'guitare':'guitariste','guitariste':'guitariste','percu':'percussionniste','percussion':'percussionniste','batucada':'batucada','samba':'troupe-danse',
    'magicien':'magicien','magie':'magicien','illusion':'magicien','close up':'magicien','close-up':'magicien','mentaliste':'mentaliste','humoriste':'humoriste-standup','stand up':'humoriste-standup','stand-up':'humoriste-standup','comique':'humoriste-standup',
    'danseur':'danseur-danseuse','danseuse':'danseur-danseuse','danse':'troupe-danse','troupe':'troupe-danse','hip hop':'troupe-danse','hip-hop':'troupe-danse','cabaret':'performer-cabaret','burlesque':'show-burlesque',
    'led':'performer-led-lumiere','lumiere':'performer-led-lumiere','feu':'artiste-feu','cracheur':'artiste-feu','pyro':'artiste-feu','jongl':'acrobate-cirque','cirque':'acrobate-cirque','acrobate':'acrobate-cirque','echassier':'echassier','echasse':'echassier','imitateur':'imitateur',
    'animateur':'animateur-evenementiel','animatrice':'animateur-evenementiel','animation':'animateur-evenementiel','mc':'maitre-ceremonie','maitre de ceremonie':'maitre-ceremonie','presentateur':'maitre-ceremonie',
    'enfant':'animateur-enfants','enfants':'animateur-enfants','kids':'animateur-enfants','clown':'clown','mascotte':'mascotte','hypno':'hypnotiseur','quiz':'jeux-interactifs-quiz','jeux':'jeux-interactifs-quiz','karaoke':'karaoke',
    'photographe':'photographe-evenementiel','photo':'photographe-evenementiel','shooting':'photographe-evenementiel','videaste':'videaste-evenementiel','video':'videaste-evenementiel','film':'videaste-evenementiel','clip':'videaste-evenementiel','aftermovie':'videaste-evenementiel',
    'drone':'drone-photo-video','photobooth':'photobooth-borne-photo','borne':'photobooth-borne-photo','createur de contenu':'createur-contenu','contenu':'createur-contenu',
    'peintre':'peintre-live','live painting':'peintre-live','peinture':'peintre-live','tableau':'artiste-peintre','graffiti':'graffiti-artist','graff':'graffiti-artist','caricature':'caricaturiste','caricaturiste':'caricaturiste','body paint':'body-painter','bodypaint':'body-painter','calligraph':'calligraphe','tatou':'tatoueur-ephemere',
    'barman':'barman-mixologue','mixolog':'barman-mixologue','cocktail':'bar-cocktails','bar a cocktail':'bar-cocktails','champagne':'bar-champagne','barista':'barista-cafe','cafe':'barista-cafe','chef':'chef-prive','cuisinier':'chef-prive','traiteur':'traiteur-evenementiel','buffet':'traiteur-evenementiel','repas':'traiteur-evenementiel',
    'influenceur':'influenceur-lifestyle','influenceuse':'influenceur-lifestyle','instagram':'influenceur-lifestyle','tiktok':'influenceur-lifestyle','ugc':'createur-contenu-ugc','streamer':'streamer-live','twitch':'streamer-live','gaming':'influenceur-gaming','mode':'influenceur-mode','beaute':'influenceur-beaute','food':'influenceur-food','fitness':'influenceur-fitness-sport','voyage':'influenceur-voyage','tech':'influenceur-tech'
  };
  var EVT_SYN = {'mariage':'Mariage','marier':'Mariage','noces':'Mariage','anniv':'Anniversaire','anniversaire':'Anniversaire','soiree':'Soirée privée','fete':'Soirée privée','entreprise':"Événement d'entreprise / séminaire",'seminaire':"Événement d'entreprise / séminaire",'corporate':"Événement d'entreprise / séminaire",'team building':"Événement d'entreprise / séminaire",'lancement':'Lancement de produit','gala':'Gala / soirée de prestige','prestige':'Gala / soirée de prestige','festival':'Festival / concert','concert':'Festival / concert','inauguration':'Autre'};

  function norm(t){ return (t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''); }
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  /* ── état ── */
  var S = { step:'start', cat:null, sub:null, event:null, city:null, date:null, budget:null };

  /* ── DOM ── */
  var css = '\
#cel-ast-btn{position:fixed;right:22px;bottom:22px;z-index:9990;display:flex;align-items:center;gap:10px;padding:13px 18px 13px 14px;border-radius:100px;border:1px solid rgba(201,168,76,.45);background:linear-gradient(135deg,#1a1230,#0e0e14);color:#fff;font:600 13px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.3px;cursor:pointer;box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 0 0 rgba(201,168,76,.35);transition:transform .2s,box-shadow .3s;animation:celPulse 2.8s 1.5s infinite}\
#cel-ast-btn:hover{transform:translateY(-2px);box-shadow:0 18px 46px rgba(0,0,0,.6)}\
#cel-ast-btn .ic{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#9B59F5);display:flex;align-items:center;justify-content:center;font-size:15px}\
@keyframes celPulse{0%{box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 0 0 rgba(201,168,76,.35)}70%{box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 0 14px rgba(201,168,76,0)}100%{box-shadow:0 14px 40px rgba(0,0,0,.55),0 0 0 0 rgba(201,168,76,0)}}\
#cel-ast{position:fixed;right:22px;bottom:22px;z-index:9995;width:380px;max-width:calc(100vw - 24px);height:600px;max-height:calc(100vh - 40px);display:none;flex-direction:column;border-radius:18px;overflow:hidden;background:#0E0E14;border:1px solid rgba(255,255,255,.09);box-shadow:0 30px 80px rgba(0,0,0,.7);font-family:"Segoe UI",system-ui,-apple-system,sans-serif;color:#fff}\
#cel-ast.open{display:flex;animation:celIn .25s ease}\
@keyframes celIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}\
#cel-ast .hd{display:flex;align-items:center;gap:11px;padding:14px 16px;background:linear-gradient(135deg,#171126,#0E0E14);border-bottom:1px solid rgba(255,255,255,.07)}\
#cel-ast .hd .av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#9B59F5);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}\
#cel-ast .hd b{display:block;font-size:14px}#cel-ast .hd small{display:block;font-size:11px;color:#9A9AAA;margin-top:1px}\
#cel-ast .hd .x{margin-left:auto;background:none;border:none;color:#9A9AAA;font-size:22px;cursor:pointer;line-height:1;padding:4px 6px}#cel-ast .hd .x:hover{color:#fff}\
#cel-ast .body{flex:1;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}#cel-ast .body>*{flex-shrink:0}\
#cel-ast .m{max-width:86%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.55}\
#cel-ast .m.bot{align-self:flex-start;background:#171720;border:1px solid rgba(255,255,255,.06);border-bottom-left-radius:4px}\
#cel-ast .m.user{align-self:flex-end;background:linear-gradient(135deg,#7C3AED,#5B21B6);border-bottom-right-radius:4px}\
#cel-ast .m a{color:#E4C57A;text-decoration:underline}\
#cel-ast .chips{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;max-width:96%}\
#cel-ast .chip{padding:8px 13px;border-radius:100px;border:1px solid rgba(255,255,255,.14);background:#13131A;color:#ddd;font-size:12.5px;cursor:pointer;transition:all .15s;font-family:inherit}\
#cel-ast .chip:hover{border-color:#C9A84C;color:#E4C57A}#cel-ast .chip.gold{border-color:rgba(201,168,76,.5);color:#E4C57A;font-weight:600}#cel-ast .chip.purple{border-color:rgba(155,89,245,.6);color:#c9a9ff;font-weight:600}\
#cel-ast .card{align-self:flex-start;width:96%;background:#13131A;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:11px 13px;display:flex;gap:11px;align-items:center;text-decoration:none;color:#fff;transition:border-color .2s}\
#cel-ast .card:hover{border-color:rgba(201,168,76,.5)}\
#cel-ast .card .ph{width:48px;height:48px;border-radius:9px;background-size:cover;background-position:center;background-color:#221a33;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:800;color:rgba(255,255,255,.35)}\
#cel-ast .card b{display:block;font-size:13.5px}#cel-ast .card span{display:block;font-size:11.5px;color:#9A9AAA;margin-top:2px}#cel-ast .card .pr{margin-left:auto;font-size:12.5px;font-weight:700;color:#E4C57A;white-space:nowrap}\
#cel-ast .typing{align-self:flex-start;padding:10px 14px;background:#171720;border-radius:14px;font-size:12px;color:#9A9AAA;letter-spacing:2px}\
#cel-ast .ft{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid rgba(255,255,255,.07);background:#0B0B10}\
#cel-ast .ft input{flex:1;background:#13131A;border:1px solid rgba(255,255,255,.1);color:#fff;padding:11px 13px;border-radius:10px;font-size:13.5px;outline:none;font-family:inherit}\
#cel-ast .ft input:focus{border-color:#9B59F5}\
#cel-ast .ft button{width:42px;border:none;border-radius:10px;background:linear-gradient(135deg,#C9A84C,#9A7A2E);color:#0b0b10;font-size:17px;cursor:pointer}\
#cel-ast .disc{font-size:10px;color:#5E5E70;text-align:center;padding:0 12px 8px;background:#0B0B10}\
@media(max-width:480px){#cel-ast{right:12px;bottom:12px;height:calc(100vh - 24px)}#cel-ast-btn{right:12px;bottom:12px;padding:12px 14px}#cel-ast-btn .lb{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement('button'); btn.id = 'cel-ast-btn'; btn.setAttribute('aria-label','Ouvrir l\'assistant');
  btn.innerHTML = '<span class="ic">✦</span><span class="lb">Trouver mon prestataire</span>';
  var box = document.createElement('div'); box.id = 'cel-ast'; box.setAttribute('role','dialog'); box.setAttribute('aria-label','Assistant Celeor');
  box.innerHTML = '<div class="hd"><div class="av">✦</div><div><b>Assistant Celeor</b><small>Je vous aide à trouver le bon prestataire</small></div><button class="x" aria-label="Fermer">×</button></div>'+
    '<div class="body" id="cel-ast-body"></div>'+
    '<div class="ft"><input id="cel-ast-in" type="text" placeholder="Ex. un DJ pour un mariage à Toulouse…" autocomplete="off"><button id="cel-ast-send" aria-label="Envoyer">➤</button></div>'+
    '<div class="disc">Assistant automatique · pour parler à l\'équipe : <a href="contact.html" style="color:#9A7A2E">contact</a></div>';
  document.body.appendChild(btn); document.body.appendChild(box);
  var body = document.getElementById('cel-ast-body'), input = document.getElementById('cel-ast-in');

  function open(){ box.classList.add('open'); btn.style.display = 'none'; if(!body.children.length) start(); setTimeout(function(){ input.focus(); }, 150); }
  function close(){ box.classList.remove('open'); btn.style.display = ''; }
  btn.addEventListener('click', open);
  box.querySelector('.x').addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && box.classList.contains('open')) close(); });
  document.getElementById('cel-ast-send').addEventListener('click', send);
  input.addEventListener('keydown', function(e){ if(e.key==='Enter') send(); });
  window.celeorAssistantOpen = open;
  if (/[?&]assistant=1/.test(location.search)) setTimeout(open, 600);

  /* ── rendu ── */
  function scroll(){ body.scrollTop = body.scrollHeight; }
  function clearChips(){ var c = body.querySelectorAll('.chips'); c.forEach(function(el){ el.remove(); }); }
  function bot(html, cb){
    clearChips();
    var t = document.createElement('div'); t.className = 'typing'; t.textContent = '•••'; body.appendChild(t); scroll();
    setTimeout(function(){ t.remove(); var m = document.createElement('div'); m.className = 'm bot'; m.innerHTML = html; body.appendChild(m); scroll(); if(cb) cb(); }, 420);
  }
  function user(text){ clearChips(); var m = document.createElement('div'); m.className = 'm user'; m.textContent = text; body.appendChild(m); scroll(); }
  function chips(list){
    var w = document.createElement('div'); w.className = 'chips';
    list.forEach(function(c){ var b = document.createElement('button'); b.className = 'chip' + (c.cls ? ' '+c.cls : ''); b.textContent = c.label;
      b.addEventListener('click', function(){ if(c.href){ location.href = c.href; return; } user(c.label); c.on(); }); w.appendChild(b); });
    body.appendChild(w); scroll();
  }
  function card(d){
    var sb = window.celeorSub ? window.celeorSub(d.sub) : null;
    var photo = (window.CELEOR_PHOTOS||{})[d.c];
    var a = document.createElement('a'); a.className = 'card'; a.href = 'fiche.html?id=' + d.id;
    a.innerHTML = '<div class="ph" style="'+(photo?'background-image:url('+photo+')':'')+'">'+(photo?'':esc(d.n.charAt(0)))+'</div><div><b>'+esc(d.n)+'</b><span>'+esc(d.t)+' · '+esc(d.city)+'</span></div><div class="pr">'+esc(d.price)+'</div>';
    body.appendChild(a); scroll();
  }

  /* ── compréhension du texte libre ── */
  function parse(text){
    var t = norm(text), r = { subs:[], cat:null, event:null, city:null, budget:null, intent:null };
    if (/(devenir|inscri|rejoindre|proposer mes|je suis (dj|artiste|photographe|chanteur|prestataire))/.test(t) && /(prestataire|artiste|talent|inscri|rejoindre|proposer)/.test(t)) r.intent = 'join';
    if (/parrain|recommand|commission/.test(t)) r.intent = 'ref';
    if (/(contact|telephone|appeler|parler a quelqu|humain|conseiller)/.test(t)) r.intent = 'contact';
    if (/(appel d.?offre|annonce|devis|plusieurs prestataires|je ne sais pas)/.test(t)) r.intent = 'ao';
    if (/(prix|tarif|combien|cout)/.test(t) && !r.intent) r.intent = 'price';
    if (/(bonjour|salut|hello|bonsoir|coucou)/.test(t) && t.length < 25) r.intent = 'hello';
    /* sous-catégories : synonymes puis libellés officiels */
    var keys = Object.keys(SYN).sort(function(a,b){ return b.length - a.length; });
    keys.forEach(function(k){ if (t.indexOf(k) >= 0 && r.subs.indexOf(SYN[k]) < 0) r.subs.push(SYN[k]); });
    SUBS.forEach(function(s){ var l = norm(s.label).split(' / ')[0]; if (l.length > 3 && t.indexOf(l) >= 0 && r.subs.indexOf(s.slug) < 0) r.subs.push(s.slug); });
    CATS.forEach(function(c){ var l = norm(c.label); if (t.indexOf(l) >= 0) r.cat = c.slug; });
    Object.keys(EVT_SYN).forEach(function(k){ if (t.indexOf(k) >= 0) r.event = EVT_SYN[k]; });
    CITIES.forEach(function(c){ if (t.indexOf(norm(c)) >= 0) r.city = c; });
    var m = t.match(/(\d[\d\s]{2,})\s*(€|euros?|e\b)/); if (m){ var n = parseInt(m[1].replace(/\s/g,''),10);
      r.budget = n < 500 ? BUDGETS[0] : n < 1000 ? BUDGETS[1] : n < 2500 ? BUDGETS[2] : n < 5000 ? BUDGETS[3] : BUDGETS[4]; }
    return r;
  }

  function send(){
    var text = input.value.trim(); if(!text) return; input.value = ''; user(text);
    var r = parse(text);
    if (r.intent === 'hello' && !r.subs.length && !r.cat){ return bot('Bonjour ! Dites-moi ce que vous cherchez — par exemple <i>« un magicien pour un anniversaire à Lyon »</i> — ou choisissez une catégorie.', askCat); }
    if (r.intent === 'join') return bot('Vous voulez rejoindre Celeor en tant qu\'artiste ou prestataire ? Excellente idée : la création de profil se fait en 2 minutes.', function(){ chips([{label:'Créer mon profil prestataire', cls:'gold', href:'contact.html?sujet=prestataire'},{label:'Je cherche plutôt un prestataire', on:askCat}]); });
    if (r.intent === 'ref') return bot('Le programme de parrainage vous reverse <b>5 %</b> de chaque prestation réalisée par les talents que vous faites entrer sur Celeor.', function(){ chips([{label:'Voir le programme de parrainage', cls:'gold', href:'parrainage.html'},{label:'Je cherche un prestataire', on:askCat}]); });
    if (r.intent === 'contact') return bot('Bien sûr. L\'équipe Celeor répond sous 24 h.', function(){ chips([{label:'Contacter l\'équipe', cls:'gold', href:'contact.html'},{label:'Continuer avec l\'assistant', on:askCat}]); });
    if (r.intent === 'price' && !r.subs.length) return bot('Chaque prestataire affiche ses tarifs sur sa fiche (à partir de… ou sur devis). Dites-moi quel type de prestation vous intéresse et je vous montre des exemples avec leurs prix.', askCat);
    /* on retient ce qu'on a compris */
    if (r.event) S.event = r.event; if (r.city) S.city = r.city; if (r.budget) S.budget = r.budget;
    if (r.subs.length){ var sb = window.celeorSub(r.subs[0]); S.sub = sb.slug; S.cat = sb.cat; }
    else if (r.cat){ S.cat = r.cat; S.sub = null; }
    if (r.intent === 'ao' && !r.subs.length && !r.cat) return bot('Pas de souci : décrivez votre événement dans un appel d\'offres et les prestataires adaptés viendront à vous.', function(){ chips([{label:'Publier un appel d\'offres', cls:'gold', href:aoLink()},{label:'Me laisser guider', on:askCat}]); });
    if (!S.cat) return bot('Je n\'ai pas bien saisi la prestation recherchée. Choisissez une catégorie, ou reformulez (ex. <i>« photographe »</i>, <i>« traiteur »</i>, <i>« animation enfants »</i>).', askCat);
    var got = []; if (r.subs.length) got.push(window.celeorSub(S.sub).label.toLowerCase()); else got.push(window.celeorCat(S.cat).label.toLowerCase());
    if (r.event) got.push(r.event.toLowerCase()); if (r.city) got.push('à ' + r.city);
    bot('Compris : <b>' + esc(got.join(' · ')) + '</b>.', next);
  }

  /* ── parcours guidé ── */
  function start(){
    bot('Bonjour 👋 Je suis l\'assistant Celeor. Dites-moi ce que vous cherchez, ou laissez-vous guider : quel type de prestation vous intéresse ?', askCat);
  }
  function askCat(){
    S.step = 'cat';
    chips(CATS.map(function(c){ return { label:(c.icon?c.icon+' ':'')+c.label, on:function(){ S.cat = c.slug; S.sub = null; askSub(); } }; })
      .concat([{ label:'Je ne sais pas encore', cls:'purple', on:function(){ bot('Dans ce cas, le plus efficace est de décrire votre événement : les prestataires adaptés vous répondent directement.', function(){ chips([{label:'Publier un appel d\'offres', cls:'gold', href:aoLink()},{label:'Voir toutes les catégories', on:askCat}]); }); } }]));
  }
  function askSub(){
    var c = window.celeorCat(S.cat); S.step = 'sub';
    bot('<b>' + esc(c.label) + '</b> — plus précisément ?', function(){
      chips(c.subs.map(function(s){ return { label:s.label, on:function(){ S.sub = s.slug; next(); } }; }).concat([{ label:'Peu importe', on:function(){ S.sub = null; next(); } }]));
    });
  }
  function next(){
    if (!S.event) return askEvent();
    if (!S.city) return askCity();
    if (!S.budget) return askBudget();
    results();
  }
  function askEvent(){ S.step = 'event'; bot('Pour quel type d\'événement ?', function(){ chips(EVENTS.map(function(e){ return { label:e, on:function(){ S.event = e; next(); } }; })); }); }
  function askCity(){ S.step = 'city'; bot('Où se déroule l\'événement ? (choisissez une ville ou écrivez-la)', function(){ chips(CITIES.slice(0,6).map(function(c){ return { label:c, on:function(){ S.city = c; next(); } }; }).concat([{ label:'Ailleurs / partout en France', on:function(){ S.city = 'France'; next(); } }])); }); }
  function askBudget(){ S.step = 'budget'; bot('Quel budget envisagez-vous pour cette prestation ?', function(){ chips(BUDGETS.map(function(b){ return { label:b, on:function(){ S.budget = b; next(); } }; })); }); }

  function results(){
    S.step = 'results';
    var rows = DATA.filter(function(d){ return d.c === S.cat && (!S.sub || d.sub === S.sub); });
    var local = (S.city && S.city !== 'France') ? rows.filter(function(d){ return d.city === S.city || /France entière|se déplace/.test(d.zone||''); }) : rows;
    var show = (local.length ? local : rows).slice(0, 3);
    var sbl = S.sub ? window.celeorSub(S.sub).label : window.celeorCat(S.cat).label;
    if (!show.length){
      return bot('Aucun profil <b>' + esc(sbl) + '</b> n\'est encore visible dans le catalogue. Le plus sûr : publiez un appel d\'offres, Celeor le diffuse aux prestataires correspondants et vous recevez leurs propositions sous 48 h.', function(){
        chips([{label:'Publier mon appel d\'offres', cls:'gold', href:aoLink()},{label:'Voir le catalogue', href:catLink()},{label:'Recommencer', on:reset}]); });
    }
    var intro = 'Voici ' + (show.length > 1 ? show.length + ' profils' : 'un profil') + ' <b>' + esc(sbl) + '</b>' + (local.length && S.city && S.city !== 'France' ? (show.length > 1 ? ' disponibles à ' : ' disponible à ') + esc(S.city) : '') + ' :';
    bot(intro, function(){
      show.forEach(card);
      setTimeout(function(){
        var m = document.createElement('div'); m.className = 'm bot';
        m.innerHTML = 'Vous pouvez ouvrir une fiche pour réserver, voir tout le catalogue, ou publier un appel d\'offres pour recevoir plusieurs propositions d\'un coup.';
        body.appendChild(m);
        chips([{label:'Tout le catalogue ' + (S.sub ? '' : sbl), href:catLink()},{label:'Publier un appel d\'offres', cls:'gold', href:aoLink()},{label:'Autre recherche', on:reset}]);
      }, 300);
    });
  }
  function catLink(){ return 'catalogue.html' + (S.city && S.city !== 'France' ? '?ville=' + encodeURIComponent(S.city) : '') + '#' + (S.sub || S.cat || ''); }
  function aoLink(){
    var q = [];
    if (S.sub) q.push('prestations=' + encodeURIComponent(S.sub)); else if (S.cat){ var c = window.celeorCat(S.cat); if (c) q.push('prestations=' + encodeURIComponent(c.subs.slice(0,3).map(function(s){return s.slug;}).join(','))); }
    if (S.event) q.push('type=' + encodeURIComponent(S.event));
    if (S.city && S.city !== 'France') q.push('ville=' + encodeURIComponent(S.city));
    if (S.budget && S.budget !== 'Je ne sais pas encore') q.push('budget=' + encodeURIComponent(S.budget));
    return 'appel-offres.html' + (q.length ? '?' + q.join('&') : '');
  }
  function reset(){ S = { step:'start', cat:null, sub:null, event:null, city:null, date:null, budget:null }; bot('On repart de zéro. Quel type de prestation cherchez-vous ?', askCat); }
})();
