// Répertoire des activités économiques — Commune de Cocody 2026
// Référence : Délibération N°2025-172/CC/CM/SG du 04 novembre 2025
// Chaque activité est rattachée à un compte SYSCOHADA présent dans la délibération.

export interface TypeActivite {
  id: string
  label: string
  categorie: string
  regimeFiscal: string
  compte: string
  tarifApplicable: string
  pieceRequises: string[]
  delaiTraitement: string
  note?: string
}

// Catégories alignées sur les chapitres de la délibération
export const CATEGORIES_ACTIVITES = [
  'Commerce & négoce',
  'Services & artisanat',
  'Restauration',
  'Étalage & marché',
  'Hébergement & locaux loués',
  'Établissements de nuit',
  'Transport',
  'Spectacles, sport & événements',
  'Publicité & enseignes',
  'Charrettes & embarcations',
]

export const TYPES_ACTIVITES: TypeActivite[] = [

  // ── Commerce & négoce — compte 70262 (taux 2 % du CA) ──────────────────────
  {
    id: 'ACT-001', label: 'Épicerie / commerce général',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Justificatif de domicile', 'Photo du local commercial'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-002', label: 'Boutique alimentaire / superette',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Justificatif de domicile', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-003', label: 'Commerce de tissus / pagnes / vêtements',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local / vitrine'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-004', label: 'Commerce de chaussures / maroquinerie',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local / vitrine'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-005', label: 'Quincaillerie / ferronnerie',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM ou registre artisan', 'Photo du local'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-006', label: 'Cosmétiques / parfumerie',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-007', label: 'Librairie / papeterie',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-008', label: 'Téléphonie / accessoires électroniques',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local', 'Inventaire du stock'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-009', label: 'Commerce de matériaux de construction',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Photo du dépôt / local'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-010', label: 'Commerce de véhicules d\'occasion',
    categorie: 'Commerce & négoce', regimeFiscal: 'Taxe entreprenant — commerce',
    compte: '70262', tarifApplicable: '2 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Photo du parc de vente'],
    delaiTraitement: '7 jours ouvrés',
    note: 'Le site de vente sur domaine public est soumis en plus au compte 72031 (4 000 F/m²/mois).',
  },

  // ── Services & artisanat — compte 70262 (taux 2,5 % du CA) ─────────────────
  {
    id: 'ACT-011', label: 'Salon de coiffure — dames',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Diplôme ou attestation de compétence coiffure', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-012', label: 'Salon de coiffure — hommes / barbier',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation de compétence', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-013', label: 'Institut de beauté / esthétique',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Diplôme esthétique', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-014', label: 'Pressing / laverie / blanchisserie',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local et des équipements'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-015', label: 'Atelier de couture / tailleur',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo de l\'atelier'],
    delaiTraitement: '3 jours ouvrés',
  },
  {
    id: 'ACT-016', label: 'Menuiserie (bois)',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation de compétence artisan', 'Photo de l\'atelier'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-017', label: 'Soudure / métallerie / ferronnerie d\'art',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo de l\'atelier'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-018', label: 'Électricité bâtiment',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Habilitation électrique ou attestation compétence'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-019', label: 'Plomberie / climatisation / froid',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation de compétence'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-020', label: 'Cybercafé / télécentre / impression',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local', 'Inventaire du matériel'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-021', label: 'Studio photo / vidéo / graphisme',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local/matériel'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-022', label: 'Réparation GSM / électronique',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local'],
    delaiTraitement: '3 jours ouvrés',
  },
  {
    id: 'ACT-023', label: 'Salle de sport / fitness / gym',
    categorie: 'Services & artisanat', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Photo des locaux et équipements'],
    delaiTraitement: '7 jours ouvrés',
    note: "L'exploitation d'un terrain sportif en propre est en plus soumise à la taxe compte 7035 (5 % du produit brut).",
  },

  // ── Restauration — compte 70262 (taux 2,5 %, activité de services) ──────────
  {
    id: 'ACT-024', label: 'Restaurant',
    categorie: 'Restauration', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation d\'inspection de salubrité (compte 71136)', 'Photo du local'],
    delaiTraitement: '7 jours ouvrés',
    note: "L'attestation de salubrité communale est requise à l'ouverture (2 000 F/trimestre, compte 71136).",
  },
  {
    id: 'ACT-025', label: 'Maquis',
    categorie: 'Restauration', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation salubrité', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
    note: "L'attestation de salubrité communale est requise à l'ouverture (2 000 F/trimestre, compte 71136).",
  },
  {
    id: 'ACT-026', label: 'Fast-food / snack / kiosque alimentation',
    categorie: 'Restauration', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation salubrité', 'Photo du local'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-027', label: 'Boulangerie / pâtisserie',
    categorie: 'Restauration', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation sanitaire et salubrité', 'Autorisation Ministère Commerce', 'Photo du four et local'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-028', label: 'Traiteur / cuisine à emporter',
    categorie: 'Restauration', regimeFiscal: 'Taxe entreprenant — services',
    compte: '70262', tarifApplicable: '2,5 % du CA annuel, payable par douzième mensuel',
    pieceRequises: ['CNI recto-verso ou passeport', 'Attestation salubrité'],
    delaiTraitement: '5 jours ouvrés',
  },

  // ── Étalage & marché — compte 70262 ambulant + 71344 places ─────────────────
  {
    id: 'ACT-029', label: 'Vendeur ambulant (CA annuel < 1 200 000 FCFA)',
    categorie: 'Étalage & marché', regimeFiscal: 'Taxe entreprenant — ambulant / étalage',
    compte: '70262', tarifApplicable: '100 F par jour de vente',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo d\'identité'],
    delaiTraitement: '2 jours ouvrés',
  },
  {
    id: 'ACT-030', label: 'Étal en dehors des auvents (marché communal)',
    categorie: 'Étalage & marché', regimeFiscal: 'Taxe entreprenant + droit de place marché',
    compte: '70262 + 71344', tarifApplicable: '100 F/j (entreprenant) + 3 000 F/m²/mois (place marché)',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo de l\'étal'],
    delaiTraitement: '3 jours ouvrés',
  },
  {
    id: 'ACT-031', label: 'Étal sous auvents (marché communal)',
    categorie: 'Étalage & marché', regimeFiscal: 'Taxe entreprenant + droit de place marché',
    compte: '70262 + 71344', tarifApplicable: '100 F/j (entreprenant) + 6 000 F/m²/mois (place sous auvent)',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo de l\'étal'],
    delaiTraitement: '3 jours ouvrés',
  },
  {
    id: 'ACT-032', label: 'Cage à volailles (marché communal)',
    categorie: 'Étalage & marché', regimeFiscal: 'Droit de place — cage volailles',
    compte: '71344', tarifApplicable: '10 000 F par place et par mois',
    pieceRequises: ['CNI recto-verso ou passeport'],
    delaiTraitement: '2 jours ouvrés',
  },
  {
    id: 'ACT-033', label: 'Place à la poissonnerie sur étale',
    categorie: 'Étalage & marché', regimeFiscal: 'Droit de place — poissonnerie',
    compte: '71344', tarifApplicable: '10 000 F par place et par mois',
    pieceRequises: ['CNI recto-verso ou passeport'],
    delaiTraitement: '2 jours ouvrés',
  },

  // ── Hébergement & locaux loués — compte 7027 ─────────────────────────────────
  {
    id: 'ACT-034', label: 'Hôtel sans étoile / 1 étoile',
    categorie: 'Hébergement & locaux loués', regimeFiscal: 'Taxe locaux loués en garnis',
    compte: '7027', tarifApplicable: '1 %–5 % valeur locative/mois selon taux remplissage + 500 F/nuitée/client',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Autorisation d\'ouverture hôtel (Ministère Tourisme)', 'Plan des locaux', 'Attestation salubrité (compte 71136 — 5 000 F/semestre)'],
    delaiTraitement: '15 jours ouvrés',
  },
  {
    id: 'ACT-035', label: 'Hôtel 2 étoiles',
    categorie: 'Hébergement & locaux loués', regimeFiscal: 'Taxe locaux loués en garnis',
    compte: '7027', tarifApplicable: '1 %–5 % valeur locative/mois selon taux remplissage + 1 000 F/nuitée/client',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Classement hôtelier officiel', 'Autorisation Ministère Tourisme', 'Plan des locaux'],
    delaiTraitement: '15 jours ouvrés',
  },
  {
    id: 'ACT-036', label: 'Hôtel 3 étoiles et plus',
    categorie: 'Hébergement & locaux loués', regimeFiscal: 'Taxe locaux loués en garnis',
    compte: '7027', tarifApplicable: '1 %–5 % valeur locative/mois selon taux remplissage + 1 500 F/nuitée/client',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Classement hôtelier officiel', 'Autorisation Ministère Tourisme', 'Plan des locaux'],
    delaiTraitement: '21 jours ouvrés',
  },
  {
    id: 'ACT-037', label: 'Résidence meublée',
    categorie: 'Hébergement & locaux loués', regimeFiscal: 'Taxe locaux loués en garnis',
    compte: '7027', tarifApplicable: '1 %–5 % valeur locative/mois selon taux remplissage + 2 000 F/nuitée/client',
    pieceRequises: ['CNI recto-verso ou passeport', 'Titre foncier ou bail notarié', 'Photo des locaux meublés'],
    delaiTraitement: '10 jours ouvrés',
  },
  {
    id: 'ACT-038', label: 'Location de chambre meublée',
    categorie: 'Hébergement & locaux loués', regimeFiscal: 'Taxe locaux loués en garnis',
    compte: '7027', tarifApplicable: '1 % à 5 % de la valeur locative réelle par mois (selon taux de remplissage)',
    pieceRequises: ['CNI recto-verso ou passeport', 'Justificatif de propriété ou bail', 'Photo des chambres'],
    delaiTraitement: '7 jours ouvrés',
  },

  // ── Établissements de nuit — compte 7038 ─────────────────────────────────────
  {
    id: 'ACT-039', label: 'Bar / buvette (exploitant assujetti taxe entreprenant)',
    categorie: 'Établissements de nuit', regimeFiscal: 'Taxe établissements de nuit — forfait entreprenant',
    compte: '7038', tarifApplicable: '3 000 F par établissement et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo du local', 'Attestation salubrité'],
    delaiTraitement: '5 jours ouvrés',
    note: "Pour les bars dont l'activité principale est de servir des boissons et dont l'exploitant est assujetti à la patente : 52 500 F/mois (voir ACT-040).",
  },
  {
    id: 'ACT-040', label: 'Bar / club — activité principale boissons (assujetti patente)',
    categorie: 'Établissements de nuit', regimeFiscal: 'Taxe établissements de nuit — boissons patente',
    compte: '7038', tarifApplicable: '52 500 F par établissement et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Patente DGI', 'Autorisation d\'ouverture débit de boissons', 'Photo du local'],
    delaiTraitement: '10 jours ouvrés',
  },
  {
    id: 'ACT-041', label: 'Discothèque / cabaret',
    categorie: 'Établissements de nuit', regimeFiscal: 'Taxe établissements de nuit — discothèque',
    compte: '7038', tarifApplicable: '60 000 F par établissement et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Extrait RCCM', 'Patente DGI', 'Autorisation d\'ouverture', 'Plan des locaux', 'Attestation acoustique'],
    delaiTraitement: '15 jours ouvrés',
    note: 'Exclut les restaurants et maquis de restauration, même s\'ils servent des boissons.',
  },

  // ── Transport — compte 7041 + 71330 ──────────────────────────────────────────
  {
    id: 'ACT-042', label: 'Taxi communal (wôrô-wôrô)',
    categorie: 'Transport', regimeFiscal: 'Taxe taxis communaux',
    compte: '7041', tarifApplicable: '20 000 F par taxi et par trimestre',
    pieceRequises: ['CNI recto-verso ou passeport', 'Permis de conduire en cours de validité', 'Carte grise du véhicule', 'Assurance responsabilité civile', 'Visite technique'],
    delaiTraitement: '5 jours ouvrés',
    note: "L'enquête préalable à l'autorisation de circulation est de 20 000 F (compte 71330). Macarons : 4 000 F/paire/an (compte 71336).",
  },
  {
    id: 'ACT-043', label: 'Transport 2 roues (stationnement)',
    categorie: 'Transport', regimeFiscal: 'Taxe stationnement — 2 roues',
    compte: '7041', tarifApplicable: '20 000 F par véhicule et par an',
    pieceRequises: ['CNI recto-verso ou passeport', 'Permis 2 roues', 'Carte grise', 'Assurance RC'],
    delaiTraitement: '3 jours ouvrés',
  },
  {
    id: 'ACT-044', label: 'Transport 3 roues (stationnement)',
    categorie: 'Transport', regimeFiscal: 'Taxe stationnement — 3 roues',
    compte: '7041', tarifApplicable: '25 000 F par véhicule et par an',
    pieceRequises: ['CNI recto-verso ou passeport', 'Permis conduite', 'Carte grise', 'Assurance RC'],
    delaiTraitement: '3 jours ouvrés',
  },

  // ── Spectacles, sport & événements — comptes 7034 / 7035 / 7036 / 71345 ──────
  {
    id: 'ACT-045', label: 'Organisation de spectacles / galas / concerts',
    categorie: 'Spectacles, sport & événements', regimeFiscal: 'Taxe sur les spectacles et galas',
    compte: '7036', tarifApplicable: '10 % de la recette brute de chaque manifestation',
    pieceRequises: ['CNI recto-verso ou passeport', 'Programme de l\'événement', 'Autorisation activités culturelles (2 000 F — compte 71250)'],
    delaiTraitement: '5 jours ouvrés',
    note: "Autorisation préalable à toute manifestation culturelle publique : 2 000 F (compte 71250).",
  },
  {
    id: 'ACT-046', label: 'Organisation de manifestations sportives payantes',
    categorie: 'Spectacles, sport & événements', regimeFiscal: 'Taxe sur les manifestations sportives',
    compte: '7034', tarifApplicable: '5 % des recettes brutes de chaque manifestation',
    pieceRequises: ['CNI recto-verso ou passeport', 'Programme de la manifestation', 'Autorisation fédération sportive'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-047', label: 'Location / exploitation de terrain ou installation sportive',
    categorie: 'Spectacles, sport & événements', regimeFiscal: 'Taxe location terrains de sport',
    compte: '7035', tarifApplicable: '5 % du produit brut de la location ou de l\'exploitation',
    pieceRequises: ['CNI recto-verso ou passeport', 'Titre d\'occupation ou convention', 'Photo du terrain / installation'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-048', label: 'Organisation de foire / exposition commerciale',
    categorie: 'Spectacles, sport & événements', regimeFiscal: 'Autorisation foire / exposition',
    compte: '71345', tarifApplicable: 'Enquête préalable 30 000 F + 4 000 F/m²/mois (site)',
    pieceRequises: ['CNI recto-verso ou passeport', 'Plan du site d\'exposition', 'Programme de la foire'],
    delaiTraitement: '10 jours ouvrés',
  },

  // ── Publicité & enseignes — compte 7042 ──────────────────────────────────────
  {
    id: 'ACT-049', label: 'Affiche publicitaire sur papier ordinaire',
    categorie: 'Publicité & enseignes', regimeFiscal: 'Taxe sur la publicité',
    compte: '7042', tarifApplicable: '200 F par m² ou fraction de m² et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Maquette / visuel de l\'affiche', 'Plan d\'emplacement'],
    delaiTraitement: '3 jours ouvrés',
  },
  {
    id: 'ACT-050', label: 'Enseigne peinte ou protégée par une vitre',
    categorie: 'Publicité & enseignes', regimeFiscal: 'Taxe sur la publicité',
    compte: '7042', tarifApplicable: '1 000 F par m² ou fraction de m² et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Maquette de l\'enseigne', 'Mesures (largeur × hauteur)'],
    delaiTraitement: '5 jours ouvrés',
    note: "Inclut aussi la plaque d'identification commerçant : 2 500 F/an (compte 71346).",
  },
  {
    id: 'ACT-051', label: 'Enseigne lumineuse / panneau éclairé la nuit',
    categorie: 'Publicité & enseignes', regimeFiscal: 'Taxe sur la publicité',
    compte: '7042', tarifApplicable: '3 000 F par m² ou fraction de m² et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Maquette et dimensionnement', 'Devis de pose'],
    delaiTraitement: '5 jours ouvrés',
  },
  {
    id: 'ACT-052', label: 'Pylône ou antenne de télécommunications',
    categorie: 'Publicité & enseignes', regimeFiscal: 'Autorisation pylône / antenne',
    compte: '71346', tarifApplicable: "Enquête préalable 500 000 F + inspection annuelle 150 000 F/an",
    pieceRequises: ['Extrait RCCM société', 'Plan du site', 'Étude d\'impact radiofréquences', 'Autorisation ARTCI'],
    delaiTraitement: '21 jours ouvrés',
  },

  // ── Charrettes & embarcations — comptes 7031 / 7033 + 71336 ──────────────────
  {
    id: 'ACT-053', label: 'Charrette à bras / pousse-pousse',
    categorie: 'Charrettes & embarcations', regimeFiscal: 'Taxe sur les charrettes',
    compte: '7031', tarifApplicable: '1 000 F par charrette et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Photo de la charrette'],
    delaiTraitement: '2 jours ouvrés',
    note: "Plaque d'identification charrette : 2 000 F/an (compte 71336).",
  },
  {
    id: 'ACT-054', label: 'Charrette à moteur',
    categorie: 'Charrettes & embarcations', regimeFiscal: 'Taxe sur les charrettes à moteur',
    compte: '7031', tarifApplicable: '2 000 F par charrette à moteur et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Carte grise (si immatriculée)', 'Photo de la charrette'],
    delaiTraitement: '3 jours ouvrés',
    note: "Plaque d'identification charrette : 2 000 F/an (compte 71336).",
  },
  {
    id: 'ACT-055', label: 'Embarcation à voile (longueur < 4 m)',
    categorie: 'Charrettes & embarcations', regimeFiscal: 'Taxe sur les embarcations de plaisance',
    compte: '7033', tarifApplicable: '10 000 F par bouche et par mois',
    pieceRequises: ['CNI recto-verso ou passeport', 'Certificat de jauge', 'Photo de l\'embarcation'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-056', label: 'Embarcation à voile (longueur 4 à 12 m)',
    categorie: 'Charrettes & embarcations', regimeFiscal: 'Taxe sur les embarcations de plaisance',
    compte: '7033', tarifApplicable: '3 000 – 12 000 F par embarcation et par trimestre (selon taille)',
    pieceRequises: ['CNI recto-verso ou passeport', 'Certificat de jauge', 'Photo de l\'embarcation', 'Attestation d\'assurance'],
    delaiTraitement: '7 jours ouvrés',
  },
  {
    id: 'ACT-057', label: 'Embarcation à moteur',
    categorie: 'Charrettes & embarcations', regimeFiscal: 'Taxe sur les embarcations de plaisance',
    compte: '7033', tarifApplicable: '3 000 – 25 000 F par embarcation et par trimestre (selon puissance)',
    pieceRequises: ['CNI recto-verso ou passeport', 'Carte de circulation', 'Attestation d\'assurance', 'Photo de l\'embarcation'],
    delaiTraitement: '7 jours ouvrés',
  },
]

export const PIECES_COMMUNES = [
  "Copie CNI recto-verso ou passeport en cours de validité",
  "Photo d'identité récente (fond blanc)",
  "Justificatif de domicile (facture CIE/SODECI de moins de 3 mois)",
  "Photo du local ou de l'enseigne (extérieur + intérieur)",
]
