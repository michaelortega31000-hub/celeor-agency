/* ============================================================
   CELEOR AGENCY — celeor-db.js (lot 1, 14/09/2026)
   Enregistre les formulaires du site dans Supabase, en double
   canal avec FormSubmit (l'email continue de partir quoi qu'il arrive).
   Usage : window.CeleorDB.saveDemande(data,'booking'|'contact')
           window.CeleorDB.saveAppelOffres(data)
           window.CeleorDB.saveCandidature(data)
   Chaque fonction renvoie une Promise qui ne rejette JAMAIS
   (échec silencieux : le formulaire ne doit pas casser).
   ============================================================ */
(function () {
  const SUPABASE_URL = 'https://joctwxwwczrhxkbhsnim.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_q9sVpL2BOOAixuLu0MouZA_otgUHs4D'; // clé publique "anon" (Settings > API Keys)

  const clean = (v) => (v === undefined || v === null || v === '' ? null : String(v).trim());
  const cleanDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : null);

  async function insert(table, row) {
    try {
      if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.startsWith('__')) return { ok: false, err: 'clé manquante' };
      const r = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(row)
      });
      if (!r.ok) { console.warn('[CeleorDB]', table, r.status, await r.text()); return { ok: false, err: r.status }; }
      return { ok: true };
    } catch (e) { console.warn('[CeleorDB]', table, e); return { ok: false, err: String(e) }; }
  }

  // Formulaire réservation (index) ou contact organisateur (contact.html)
  function saveDemande(d, origine) {
    const extras = [];
    if (d.talent) extras.push('Talent recherché : ' + d.talent);
    if (d.code_parrain) extras.push('Code parrain : ' + d.code_parrain);
    return insert('demandes', {
      origine: origine === 'booking' ? 'booking' : 'contact',
      nom: clean(d.nom) || 'Sans nom',
      email: clean(d.email) || 'inconnu@celeor-agency.com',
      telephone: clean(d.telephone),
      sujet: clean(d._subject),
      type_evenement: clean(d.type_evenement),
      date_evenement: cleanDate(d.date_evenement),
      lieu: clean(d.ville),
      budget: clean(d.budget),
      message: [clean(d.message), extras.join('\n')].filter(Boolean).join('\n\n') || null,
      source: 'site'
    });
  }

  // Formulaire appel d'offres (appel-offres.html)
  function saveAppelOffres(d) {
    return insert('appels_offres', {
      organisateur: clean(d.nom) || 'Sans nom',
      email: clean(d.email) || 'inconnu@celeor-agency.com',
      telephone: clean(d.telephone),
      societe: [clean(d.profil_organisateur), clean(d.organisation)].filter(Boolean).join(' — ') || null,
      type_evenement: clean(d.type_evenement),
      date_evenement: cleanDate(d.date_evenement),
      lieu: clean(d.ville),
      nb_invites: clean(d.invites),
      budget: clean(d.budget),
      prestations: clean(d.prestations),
      description: clean(d.description),
      source: 'site'
    });
  }

  // Candidature talent / prestataire (contact.html, switch "Je suis prestataire")
  function saveCandidature(d) {
    const extras = [];
    if (d.liens) extras.push('Liens : ' + d.liens);
    if (d.code_parrain) extras.push('Code parrain : ' + d.code_parrain);
    return insert('candidatures', {
      type: 'prestataire',
      nom: clean(d.nom) || 'Sans nom',
      email: clean(d.email) || 'inconnu@celeor-agency.com',
      telephone: clean(d.telephone),
      sous_categorie: clean(d.discipline),
      message: [clean(d.message), extras.join('\n')].filter(Boolean).join('\n\n') || null,
      source: 'site'
    });
  }

  window.CeleorDB = { saveDemande, saveAppelOffres, saveCandidature };
})();
