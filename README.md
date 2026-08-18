# Celeor Agency

Site vitrine de Celeor Agency — mise en relation entre artistes / prestataires événementiels et organisateurs d'événements.

## Technique
- Site statique (HTML / CSS / JS), toutes les images intégrées en base64 (aucune dépendance externe).
- Formulaires (réservation, contact organisateur, candidature prestataire) connectés à Supabase (Postgres + API REST, RLS activé) + notification email.
- Taxonomie : 7 catégories, 59 sous-catégories.

## Pages
- `index.html` — page d'accueil
- `catalogue.html` — recherche de talents
- `fiche.html` — fiche prestataire
- `contact.html` — formulaire de contact / candidature
- `legal.html` — mentions légales
- `data.js` — données (catégories, prestataires)

## Déploiement
Hébergement statique (Netlify / équivalent) : servir le dossier à la racine, aucune étape de build.
Domaine cible : celeor-agency.com
