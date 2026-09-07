/* ============================================
   CELEOR AGENCY — CHATBOT WIDGET v1.0
   Script autonome : ajouter <script src="chatbot.js"></script> avant </body>
   ============================================ */
(function(){
var LOGO='data:image/jpeg;base64,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';

/* ── Injection CSS ── */
var css=document.createElement('style');
css.textContent=`
#celeor-chat-btn{position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;border:3px solid #c8a84e;box-shadow:0 4px 20px rgba(200,168,78,.4),0 2px 8px rgba(0,0,0,.3);cursor:pointer;z-index:99999;overflow:hidden;transition:transform .2s,box-shadow .2s;background:#111;display:flex;align-items:center;justify-content:center}
#celeor-chat-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(200,168,78,.6),0 2px 8px rgba(0,0,0,.4)}
#celeor-chat-btn img{width:56px;height:56px;border-radius:50%;object-fit:cover}
#celeor-chat-window{position:fixed;bottom:100px;right:24px;width:380px;max-width:calc(100vw - 48px);height:520px;max-height:calc(100vh - 140px);background:#1a1a1a;border:1px solid #c8a84e;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.5),0 0 20px rgba(200,168,78,.15);z-index:99998;display:none;flex-direction:column;overflow:hidden;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,sans-serif}
#celeor-chat-window.open{display:flex}
#celeor-chat-header{background:linear-gradient(135deg,#1a1a1a,#2a2218);border-bottom:1px solid #c8a84e;padding:14px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0}
#celeor-chat-header img{width:36px;height:36px;border-radius:50%;border:2px solid #c8a84e}
#celeor-chat-header-text h3{margin:0;font-size:14px;font-weight:600;color:#c8a84e}
#celeor-chat-header-text p{margin:2px 0 0;font-size:11px;color:#999}
#celeor-chat-close{margin-left:auto;background:0 0;border:none;color:#999;font-size:20px;cursor:pointer;padding:4px 8px;line-height:1;transition:color .2s}
#celeor-chat-close:hover{color:#c8a84e}
#celeor-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
#celeor-chat-messages::-webkit-scrollbar{width:4px}
#celeor-chat-messages::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
.celeor-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;animation:celeorFadeIn .3s ease}
@keyframes celeorFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.celeor-msg.bot{background:#252525;color:#e8e8e8;align-self:flex-start;border-bottom-left-radius:4px}
.celeor-msg.user{background:linear-gradient(135deg,#c8a84e,#a08030);color:#111;align-self:flex-end;border-bottom-right-radius:4px;font-weight:500}
.celeor-choices{display:flex;flex-wrap:wrap;gap:8px;animation:celeorFadeIn .3s ease}
.celeor-choice-btn{background:0 0;border:1px solid #c8a84e;color:#c8a84e;padding:8px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all .2s;font-family:inherit}
.celeor-choice-btn:hover{background:#c8a84e;color:#111}
#celeor-chat-input-area{border-top:1px solid #333;padding:12px;display:flex;gap:8px;background:#151515;flex-shrink:0}
#celeor-chat-input{flex:1;background:#252525;border:1px solid #444;border-radius:20px;padding:8px 14px;color:#e8e8e8;font-size:13px;outline:0;font-family:inherit;transition:border-color .2s}
#celeor-chat-input:focus{border-color:#c8a84e}
#celeor-chat-input::placeholder{color:#666}
#celeor-chat-send{background:#c8a84e;border:none;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;flex-shrink:0}
#celeor-chat-send:hover{background:#dab95e}
#celeor-chat-send svg{fill:#111;width:16px;height:16px}
.celeor-typing{display:flex;gap:4px;padding:10px 14px;align-self:flex-start}
.celeor-typing span{width:6px;height:6px;background:#666;border-radius:50%;animation:celeorBounce 1.2s infinite}
.celeor-typing span:nth-child(2){animation-delay:.2s}
.celeor-typing span:nth-child(3){animation-delay:.4s}
@keyframes celeorBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
@media(max-width:480px){#celeor-chat-window{bottom:0;right:0;left:0;width:100%;max-width:100%;height:100vh;max-height:100vh;border-radius:0;border:none}#celeor-chat-btn{bottom:16px;right:16px;width:56px;height:56px}#celeor-chat-btn img{width:48px;height:48px}}
`;
document.head.appendChild(css);

/* ── Injection HTML ── */
var wrap=document.createElement('div');
wrap.innerHTML='<div id="celeor-chat-btn" onclick="celeorToggleChat()"><img src="'+LOGO+'" alt="Celeor"/></div><div id="celeor-chat-window"><div id="celeor-chat-header"><img src="'+LOGO+'" alt="Celeor"/><div id="celeor-chat-header-text"><h3>Celeor Agency</h3><p>Assistant virtuel • En ligne</p></div><button id="celeor-chat-close" onclick="celeorToggleChat()">✕</button></div><div id="celeor-chat-messages"></div><div id="celeor-chat-input-area"><input type="text" id="celeor-chat-input" placeholder="Écrivez votre message..." onkeydown="if(event.key===\'Enter\')celeorSendUserMsg()"/><button id="celeor-chat-send" onclick="celeorSendUserMsg()"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button></div></div>';
document.body.appendChild(wrap);

/* ── État ── */
var MSG=document.getElementById('celeor-chat-messages');
var state='welcome';
var contactData={};
var orgData={};

/* ── FAQ ── */
var FAQ={
"Comment fonctionne Celeor ?":"Celeor est une marketplace qui connecte les organisateurs d’événements avec des talents vérifiés. Vous parcourez le catalogue, contactez les artistes, recevez un devis sous 24h et réservez en toute sécurité.",
"Quelles catégories de talents ?":"Nous couvrons 7 catégories : Musique & DJ, Spectacle & Performance (magie, danse, feu, cirque), Animation événementielle, Photo/Vidéo/Drone, Art & Création (live painting, caricature), Expériences & Services (bar, chef privé, traiteur), et Influenceurs.",
"Types d’événements ?":"Mariages, événements corporate, soirées privées, festivals, et tout autre événement sur mesure.",
"Comment se passe la réservation ?":"En 4 étapes : 1) Découverte — parcourez les talents. 2) Contact — échangez avec l’artiste. 3) Réservation — validez le devis, Celeor sécurise tout. 4) Excellence — vivez l’événement !",
"Délai de réponse ?":"Nous nous engageons à répondre sous 24 heures à toute demande.",
"C’est gratuit pour les organisateurs ?":"La recherche et la prise de contact sont gratuites. Les tarifs dépendent du talent choisi — vous recevez un devis clair avant toute réservation.",
"Programme de parrainage ?":"En recommandant Celeor, vous gagnez des commissions sur les réservations générées. Contactez-nous pour en savoir plus !",
"Formules visibilité artistes ?":"Nous proposons : Essentiel (150€/mois), Signature (400€/mois), Prestige (770€/mois), et Sur mesure. Engagement 12 mois + 360€ de mise en service.",
"Comment vous contacter ?":"Par email à contact@celeor-agency.com, via le formulaire sur notre site, ou sur nos réseaux sociaux. Réponse sous 24h !"
};

/* ── Helpers ── */
function addBot(text,delay){
delay=delay||600;
var typing=document.createElement('div');typing.className='celeor-typing';typing.innerHTML='<span></span><span></span><span></span>';MSG.appendChild(typing);MSG.scrollTop=MSG.scrollHeight;
setTimeout(function(){typing.remove();var d=document.createElement('div');d.className='celeor-msg bot';d.innerHTML=text;MSG.appendChild(d);MSG.scrollTop=MSG.scrollHeight},delay);
}
function addUser(text){var d=document.createElement('div');d.className='celeor-msg user';d.textContent=text;MSG.appendChild(d);MSG.scrollTop=MSG.scrollHeight}
function addChoices(opts,cb){
setTimeout(function(){var w=document.createElement('div');w.className='celeor-choices';opts.forEach(function(o){var b=document.createElement('button');b.className='celeor-choice-btn';b.textContent=o;b.onclick=function(){addUser(o);w.remove();cb(o)};w.appendChild(b)});MSG.appendChild(w);MSG.scrollTop=MSG.scrollHeight},800);
}

/* ── Flux ── */
function showWelcome(){state='main_menu';addBot("✨ Bienvenue chez <strong>Celeor Agency</strong> !<br><br>Je peux vous aider à :");addChoices(["🎭 Trouver un talent","🎤 Rejoindre le catalogue","❓ Questions fréquentes","📩 Contacter l'équipe"],handleMainMenu)}
function handleMainMenu(c){if(c.indexOf("Trouver")>-1)startOrgFlow();else if(c.indexOf("Rejoindre")>-1)startArtisteFlow();else if(c.indexOf("Questions")>-1)startFAQ();else if(c.indexOf("Contacter")>-1)startContact()}

/* ── ORGANISATEUR ── */
function startOrgFlow(){state='org_type';orgData={};addBot("Parfait ! Pour quel type d'événement cherchez-vous un talent ?");addChoices(["Mariage","Corporate","Soirée privée","Festival","Autre"],function(c){orgData.type=c;askOrgCat()})}
function askOrgCat(){state='org_cat';addBot("Quelle catégorie de talent vous intéresse ?");addChoices(["Musique & DJ","Spectacle","Animation","Photo / Vidéo","Art & Création","Expériences","Influenceurs"],function(c){orgData.cat=c;askOrgDate()})}
function askOrgDate(){state='org_date';addBot("Quelle est la date approximative de votre événement ? (Tapez votre réponse)")}
function askOrgLieu(){state='org_lieu';addBot("Dans quelle ville ou région ?")}
function showOrgRecap(){state='org_recap';addBot("Voici le récapitulatif :<br>• Événement : <strong>"+orgData.type+"</strong><br>• Talent : <strong>"+orgData.cat+"</strong><br>• Date : <strong>"+orgData.date+"</strong><br>• Lieu : <strong>"+orgData.lieu+"</strong><br><br>Que souhaitez-vous faire ?");addChoices(["📋 Voir le catalogue","📩 Demander un devis","🔄 Recommencer"],function(c){if(c.indexOf("catalogue")>-1){addBot("Rendez-vous sur notre <a href='/catalogue' style='color:#c8a84e'>catalogue de talents</a> pour découvrir nos artistes ! ✨");showBackToMenu()}else if(c.indexOf("devis")>-1){addBot("Super ! Je vais collecter vos coordonnées pour transmettre votre demande à notre équipe.");startContact()}else showWelcome()})}

/* ── ARTISTE ── */
function startArtisteFlow(){state='artiste';addBot("Super que vous souhaitiez nous rejoindre ! 🎶<br><br>Celeor est une marketplace premium qui met en relation artistes vérifiés et organisateurs d'événements. Vous pourrez :<br>• Créer votre profil de talent<br>• Gérer vos disponibilités<br>• Recevoir des demandes de booking<br>• Participer au programme de parrainage<br><br>Pour candidater, envoyez-nous votre <strong>nom, spécialité et un lien vers votre travail</strong> (Instagram, YouTube, portfolio).");addChoices(["📩 Envoyer ma candidature","💰 Formules visibilité","🔄 Menu principal"],function(c){if(c.indexOf("candidature")>-1){addBot("Envoyez votre candidature à <a href='mailto:contact@celeor-agency.com' style='color:#c8a84e'>contact@celeor-agency.com</a> ou via notre <a href='/contact' style='color:#c8a84e'>formulaire de contact</a>. Nous vous recontactons sous 24h ! ✨");showBackToMenu()}else if(c.indexOf("Formules")>-1){addBot("Nos formules de mise en avant :<br><br>• <strong>Essentiel</strong> : 150€/mois — 2 réels/mois<br>• <strong>Signature</strong> : 400€/mois — 2 réels + accompagnement éditorial<br>• <strong>Prestige</strong> : 770€/mois — 2 réels + stratégie prioritaire<br>• <strong>Sur mesure</strong> : sur devis<br><br>Engagement 12 mois + 360€ de mise en service.");showBackToMenu()}else showWelcome()})}

/* ── FAQ ── */
function startFAQ(){state='faq_menu';addBot("Voici les questions les plus fréquentes. Choisissez un sujet :");var k=Object.keys(FAQ);addChoices(k.slice(0,4),function(c){addBot(FAQ[c]);showMoreFAQ(k.slice(4))})}
function showMoreFAQ(r){if(!r.length){showBackToMenu();return}addChoices(r.slice(0,4).concat(["🔄 Menu principal"]),function(c){if(c.indexOf("Menu")>-1){showWelcome();return}if(FAQ[c])addBot(FAQ[c]);showMoreFAQ(r.slice(4))})}

/* ── CONTACT ── */
function startContact(){state='contact_nom';contactData={};addBot("Je vais transmettre votre demande à notre équipe. D'abord, quel est votre nom ?")}

/* ── Retour menu ── */
function showBackToMenu(){addChoices(["🔄 Retour au menu","👋 Merci, c'est tout !"],function(c){if(c.indexOf("Retour")>-1)showWelcome();else addBot("Merci pour votre visite ! N'hésitez pas à revenir. À bientôt chez Celeor Agency ✨")})}

/* ── Texte libre ── */
window.celeorHandleInput=function(text){
if(!text.trim())return;addUser(text);
switch(state){
case 'org_date':orgData.date=text;askOrgLieu();break;
case 'org_lieu':orgData.lieu=text;showOrgRecap();break;
case 'contact_nom':contactData.nom=text;state='contact_email';addBot("Merci "+text+" ! Quel est votre email ?");break;
case 'contact_email':if(text.indexOf('@')<0){addBot("Hmm, cet email ne semble pas valide. Pouvez-vous réessayer ?");return}contactData.email=text;state='contact_tel';addBot("Un numéro de téléphone ? (Tapez \"passer\" pour ignorer)");break;
case 'contact_tel':contactData.tel=text.toLowerCase()==='passer'?'':text;state='contact_desc';addBot("Décrivez brièvement votre besoin :");break;
case 'contact_desc':
contactData.desc=text;state='done';
var subj=encodeURIComponent("Demande via chatbot — "+contactData.nom);
var body=encodeURIComponent("Nom : "+contactData.nom+"\nEmail : "+contactData.email+"\nTéléphone : "+(contactData.tel||"Non renseigné")+"\n"+(orgData.type?"Evénement : "+orgData.type+"\nTalent : "+orgData.cat+"\nDate : "+orgData.date+"\nLieu : "+orgData.lieu+"\n":"")+"Message : "+contactData.desc);
addBot("Merci "+contactData.nom+" ! ✨ Votre demande a bien été prise en compte.<br><br>Notre équipe vous recontacte sous 24h à <strong>"+contactData.email+"</strong>.<br><br><a href='mailto:contact@celeor-agency.com?subject="+subj+"&body="+body+"' style='color:#c8a84e;text-decoration:underline'>📩 Envoyer directement par email</a>");
showBackToMenu();break;
default:
var lo=text.toLowerCase();
if(lo.indexOf('talent')>-1||lo.indexOf('artiste')>-1||lo.indexOf('dj')>-1||lo.indexOf('musicien')>-1||lo.indexOf('photographe')>-1||lo.indexOf('mariage')>-1||lo.indexOf('événement')>-1){addBot("Il semble que vous cherchiez un talent ! Laissez-moi vous guider.");startOrgFlow()}
else if(lo.indexOf('rejoindre')>-1||lo.indexOf('inscription')>-1||lo.indexOf('profil')>-1){startArtisteFlow()}
else if(lo.indexOf('prix')>-1||lo.indexOf('tarif')>-1||lo.indexOf('coût')>-1||lo.indexOf('combien')>-1){addBot(FAQ["C'est gratuit pour les organisateurs ?"]);showBackToMenu()}
else if(lo.indexOf('contact')>-1||lo.indexOf('email')>-1||lo.indexOf('parler')>-1){addBot("Vous pouvez nous écrire à <a href='mailto:contact@celeor-agency.com' style='color:#c8a84e'>contact@celeor-agency.com</a> ou je peux collecter vos coordonnées.");addChoices(["📩 Laisser mes coordonnées","🔄 Menu principal"],function(c){if(c.indexOf("coordonnées")>-1)startContact();else showWelcome()})}
else{addBot("Je ne suis pas sûr de comprendre. Laissez-moi vous orienter :");addChoices(["🎭 Trouver un talent","🎤 Rejoindre le catalogue","❓ FAQ","📩 Contacter l'équipe"],handleMainMenu)}
}};

/* ── Contrôles ── */
window.celeorToggleChat=function(){var w=document.getElementById('celeor-chat-window');w.classList.toggle('open');if(w.classList.contains('open')&&MSG.children.length===0)showWelcome()};
window.celeorSendUserMsg=function(){var i=document.getElementById('celeor-chat-input');var t=i.value.trim();if(!t)return;i.value='';window.celeorHandleInput(t)};
})();
