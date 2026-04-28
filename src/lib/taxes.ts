// Délibération N°2025-172/CC/CM/SG du 04 novembre 2025
// Instituant les taxes municipales de l'exercice 2026 — Commune de Cocody
// Conseil Municipal sous la présidence de JEAN-MARC YACE — 56 voix pour, 0 contre

export interface TarifLine {
  label: string
  montant: number | string  // string pour les taux en %
  unite: string
  condition?: string
}

export interface TaxeSection {
  compte: string
  label: string
  description?: string
  lignes: TarifLine[]
}

export interface ChapitreBareme {
  chapitre: string
  titre: string
  sections: TaxeSection[]
}

// ══════════════════════════════════════════════════════
// SECTION 70 — RECETTES FISCALES
// ══════════════════════════════════════════════════════
export const SECTION_70: ChapitreBareme[] = [
  {
    chapitre: '702',
    titre: 'TAXES COMMUNALES PERÇUES PAR VOIE DE RÔLE',
    sections: [
      {
        compte: '70262',
        label: "Taxe communale de l'entreprenant",
        description: "Taxe forfaitaire des petits commerçants et artisans. Applicable à toute personne physique exerçant une activité économique sur le territoire communal sans être assujettie à la patente.",
        lignes: [
          { label: 'Commerce ou négoce',                                          montant: '2 %',   unite: 'du CA annuel réel ou prévisionnel, par fraction de douzième payable par mois' },
          { label: 'Autres activités y compris les prestations de services',      montant: '2,5 %', unite: 'du CA annuel réel ou prévisionnel, par fraction de douzième payable par mois' },
          { label: 'Commerçants, artisans et façonniers en étalage, marché ou ambulance (CA annuel < 1 200 000 FCFA)', montant: 100, unite: 'F par jour' },
        ],
      },
      {
        compte: '7027',
        label: 'Taxe sur les locaux loués en garnis',
        description: "Applicable aux établissements hôteliers, résidences meublées et tout local loué à usage d'hébergement temporaire.",
        lignes: [
          { label: 'Locaux loués en garnis — taux de remplissage ≤ 20 %',        montant: '1 %',   unite: 'sur la valeur locative réelle par mois' },
          { label: 'Locaux loués en garnis — taux de remplissage 20 % – 40 %',   montant: '2 %',   unite: 'sur la valeur locative réelle par mois' },
          { label: 'Locaux loués en garnis — taux de remplissage 40 % – 60 %',   montant: '3 %',   unite: 'sur la valeur locative réelle par mois' },
          { label: 'Locaux loués en garnis — taux de remplissage 60 % – 80 %',   montant: '4 %',   unite: 'sur la valeur locative réelle par mois' },
          { label: 'Locaux loués en garnis — taux de remplissage > 80 %',        montant: '5 %',   unite: 'sur la valeur locative réelle par mois' },
          { label: 'Taxe de nuitée — Hôtels sans étoiles / 1 étoile',           montant: 500,     unite: 'F par client et par nuitée' },
          { label: 'Taxe de nuitée — Hôtels 2 étoiles',                         montant: 1_000,   unite: 'F par client et par nuitée' },
          { label: 'Taxe de nuitée — Hôtels 3 étoiles et plus',                 montant: 1_500,   unite: 'F par client et par nuitée' },
          { label: 'Taxe de nuitée — Résidences meublées',                       montant: 2_000,   unite: 'F par client et par nuitée' },
        ],
      },
    ],
  },
  {
    chapitre: '703',
    titre: 'TAXES COMMUNALES PERÇUES SUR TITRES DE RECETTES PROPRES AUX COMMUNES',
    sections: [
      {
        compte: '7030',
        label: 'Taxe sur les pompes distributrices de carburant',
        description: 'Compte inscrit à la nomenclature budgétaire. Aucun tarif n\'a été voté par le Conseil Municipal pour l\'exercice 2026.',
        lignes: [
          { label: 'Pompes distributrices de carburant', montant: '—', unite: 'Tarif non fixé pour l\'exercice 2026' },
        ],
      },
      {
        compte: '7031',
        label: 'Taxe sur les charrettes',
        lignes: [
          { label: 'Charrettes à bras et pousse-pousse', montant: 1_000, unite: 'F par charrette et par mois' },
          { label: 'Charrettes à moteur',                montant: 2_000, unite: 'F par charrette à moteur et par mois' },
        ],
      },
      {
        compte: '7033',
        label: 'Taxe sur les embarcations de plaisance',
        lignes: [
          { label: 'Embarcation à voile — longueur < 4 m',         montant: 10_000, unite: 'F par bouche et par mois' },
          { label: 'Embarcation à voile — longueur 4 à 6 m',       montant: 3_000,  unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à voile — longueur 6 à 8 m',       montant: 6_000,  unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à voile — longueur > 12 m',        montant: 12_000, unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à voile — grande taille',          montant: 25_000, unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à moteur — puissance < 55 CV',     montant: 3_000,  unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à moteur — 56 à 75 CV',            montant: 6_000,  unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à moteur — 76 à 120 CV',           montant: 12_000, unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à moteur — 121 à 240 CV',          montant: 18_000, unite: 'F par embarcation et par trimestre' },
          { label: 'Embarcation à moteur — > 240 CV',              montant: 25_000, unite: 'F par embarcation et par trimestre' },
        ],
      },
      {
        compte: '7034',
        label: 'Taxe sur les entrées payantes aux manifestations sportives',
        lignes: [
          { label: 'Manifestations sportives payantes', montant: '5 %', unite: 'sur les recettes brutes de chaque manifestation' },
        ],
      },
      {
        compte: '7035',
        label: "Taxe sur la location et l'exploitation de terrains et installations de sport",
        lignes: [
          { label: 'Location ou exploitation terrain / installation sportive', montant: '5 %', unite: 'du produit brut de la location ou de l\'exploitation' },
        ],
      },
      {
        compte: '7036',
        label: 'Taxe sur les spectacles et galas',
        lignes: [
          { label: 'Spectacles, galas et événements culturels', montant: '10 %', unite: 'de la recette brute' },
        ],
      },
      {
        compte: '7038',
        label: 'Taxe sur les établissements de nuit',
        lignes: [
          { label: 'Établissements dont l\'exploitant est assujetti à la taxe entreprenant',                                         montant: 3_000,  unite: 'F par établissement et par mois' },
          { label: 'Établissements dont l\'activité principale est de servir des boissons (exploitant assujetti à la patente)',       montant: 52_500, unite: 'F par établissement et par mois' },
          { label: 'Discothèques ou cabarets (assujettis à la patente, à l\'exclusion des restaurants et maquis de restauration)',   montant: 60_000, unite: 'F par établissement et par mois' },
        ],
      },
    ],
  },
  {
    chapitre: '704',
    titre: 'TAXES COMMUNALES PERÇUES SUR TITRES DE RECETTES PAR LES COMMUNES',
    sections: [
      {
        compte: '7041',
        label: 'Taxe sur les taxis et stationnement',
        lignes: [
          { label: 'Taxis communaux',                                                      montant: 20_000, unite: 'F par taxi et par trimestre' },
          { label: 'Taxe stationnement — véhicules transport public 2 roues',              montant: 20_000, unite: 'F par véhicule et par an' },
          { label: 'Taxe stationnement — véhicules transport public 3 roues',              montant: 25_000, unite: 'F par véhicule et par an' },
        ],
      },
      {
        compte: '7042',
        label: 'Taxe sur la publicité',
        description: 'Applicable à toute forme d\'affichage publicitaire visible depuis le domaine public communal.',
        lignes: [
          { label: 'Affiches sur papier ordinaire',                      montant: 200,   unite: 'F par m² ou fraction de m² et par mois' },
          { label: 'Affiches peintes ou protégées par une vitre',        montant: 1_000, unite: 'F par m² ou fraction de m² et par mois' },
          { label: 'Annonces lumineuses et affiches éclairées la nuit',  montant: 3_000, unite: 'F par m² ou fraction de m² et par mois' },
        ],
      },
    ],
  },
]

// ══════════════════════════════════════════════════════
// SECTION 71 — RECETTES DES PRESTATIONS ET SERVICES
// ══════════════════════════════════════════════════════
export const SECTION_71: ChapitreBareme[] = [
  {
    chapitre: '710',
    titre: 'RECETTES DES SERVICES GÉNÉRAUX — ADMINISTRATION',
    sections: [
      {
        compte: '71000',
        label: 'Légalisation de signatures et certifications',
        description: 'Compte inscrit à la nomenclature budgétaire. Aucun tarif n\'a été voté par le Conseil Municipal pour l\'exercice 2026.',
        lignes: [
          { label: 'Légalisation de signatures et certifications', montant: '—', unite: 'Tarif non fixé pour l\'exercice 2026' },
        ],
      },
      {
        compte: '71001',
        label: 'Délivrance de documents d\'état civil',
        lignes: [
          { label: 'Acte d\'état civil',        montant: 500,   unite: 'F par acte et par signature' },
          { label: 'Duplicata livret de famille',montant: 500,   unite: 'F par acte et par signature' },
          { label: 'Certificat de résidence',   montant: 5_000, unite: 'F par duplicata' },
          { label: 'Attestation de célibat',    montant: 2_000, unite: 'F par acte et par signature' },
          { label: 'Attestation d\'hébergement',montant: 2_500, unite: 'F par acte et par signature' },
          { label: 'Attestation de concubinage',montant: 2_500, unite: 'F par acte et par signature' },
        ],
      },
      {
        compte: '71006',
        label: 'Location des salles et espaces de l\'Hôtel Communal',
        lignes: [
          { label: 'Grande salle de mariage',        montant: 2_000_000, unite: 'F par manifestation et par jour' },
          { label: 'Petite salle de mariage',        montant: 1_000_000, unite: 'F par manifestation et par jour' },
          { label: 'Pagode de l\'Hôtel Communal',   montant: 500_000,   unite: 'F par manifestation et par jour' },
          { label: 'Cour de l\'Hôtel Communal',     montant: 350_000,   unite: 'F par manifestation et par jour' },
          { label: 'Dossier d\'appel d\'offre',     montant: 50_000,    unite: 'F par dossier' },
        ],
      },
      {
        compte: '71030',
        label: 'Taxe de séquestre — fourrière',
        lignes: [
          { label: 'Véhicules légers et camionnettes',            montant: 22_500, unite: 'F par véhicule et par jour' },
          { label: 'Camions, tracteurs et remorques',             montant: 50_000, unite: 'F par véhicule et par jour' },
          { label: 'Vélomoteurs et motocyclettes',                montant: 8_000,  unite: 'F par engin et par jour' },
          { label: 'Matériaux de construction (dépôt temporaire)',montant: 25_000, unite: 'F par m³ et par jour' },
          { label: 'Mobiliers et articles non périssables',       montant: 5_000,  unite: 'F par article et par jour' },
        ],
      },
    ],
  },
  {
    chapitre: '711',
    titre: 'RECETTES DES SERVICES DE COLLECTIVITÉ',
    sections: [
      {
        compte: '71101',
        label: 'Droit de stationnement — parking',
        lignes: [
          { label: 'Parking insuffisamment aménagé sur domaine public', montant: 150, unite: 'F par véhicule et par heure' },
          { label: 'Parking public aménagé',                           montant: 500, unite: 'F par véhicule et par heure' },
        ],
      },
      {
        compte: '71126',
        label: 'Urbanisme et environnement',
        lignes: [
          { label: 'Enquête de Commodo et Incommodo',          montant: 500_000, unite: 'F par dossier (sans frais de publicité)' },
          { label: 'Enquêtes en matière d\'urbanisme',         montant: 49_500,  unite: 'F par prestation de service' },
          { label: 'Ristournes sur permis de construire (R+0 à R+3)', montant: '60 %', unite: 'du coût du permis' },
        ],
      },
      {
        compte: '71130',
        label: 'Enlèvement des ordures et déchets',
        lignes: [
          { label: 'Enlèvement ordures autres que ménagères', montant: 30_000, unite: 'F par benne de 5 tonnes et par voyage' },
        ],
      },
      {
        compte: '71136',
        label: 'Inspection et attestation de salubrité',
        lignes: [
          { label: 'Hôtels',                         montant: 5_000, unite: 'F par hôtel et par semestre' },
          { label: 'Boutiques',                      montant: 2_500, unite: 'F par boutique et par trimestre' },
          { label: 'Restaurants, maquis et kiosques',montant: 2_000, unite: 'F par établissement et par trimestre' },
        ],
      },
    ],
  },
  {
    chapitre: '712',
    titre: 'RECETTES DES SERVICES SOCIAUX, CULTURELS ET DE PROMOTION HUMAINE',
    sections: [
      {
        compte: '71212',
        label: 'Santé — Dispensaire et consultations',
        lignes: [
          { label: 'Consultation médecine générale — jours ouvrables',           montant: 1_500, unite: 'F par patient (valable 15 jours)' },
          { label: 'Consultation médecine générale — jours non ouvrables/garde', montant: 2_000, unite: 'F par patient (valable 15 jours)' },
          { label: 'Mise en observation 1ère catégorie — dispensaire ventilée',  montant: 1_500, unite: 'F par patient et par séjour de 24h' },
          { label: 'Mise en observation 2ème catégorie — VIP climatisée',        montant: 2_000, unite: 'F par patient et par séjour de 24h' },
          { label: 'Consultation ophtalmologie',                                 montant: 2_000, unite: 'F par patient (valable 15 jours)' },
          { label: 'Consultation cardiologie',                                   montant: 2_000, unite: 'F par patient (valable 1 semaine)' },
          { label: 'Consultation gynécologie',                                   montant: 2_000, unite: 'F par patient (valable 15 jours)' },
          { label: 'Consultation cabinet dentaire',                              montant: 2_000, unite: 'F par patient (valable 1 mois)' },
          { label: 'Extraction incisives (bas et haut)',                         montant: 6_000, unite: 'F par patient selon position' },
          { label: 'Extraction canines',                                         montant: 8_000, unite: 'F par patient' },
          { label: 'Extraction prémolaires et molaires',                         montant: 10_000,unite: 'F par patient' },
          { label: 'Extraction dent de sagesse — bas',                          montant: 12_000,unite: 'F par patient' },
          { label: 'Extraction dent de sagesse — haut',                         montant: 11_000,unite: 'F par patient' },
          { label: 'Amalgame',                                                   montant: 6_000, unite: 'F par patient et par dent' },
          { label: 'Obturation prémolaires (pulpectomie)',                       montant: 10_000,unite: 'F par patient selon nombre de racines' },
          { label: 'Obturation molaires (pulpectomie)',                          montant: 12_000,unite: 'F par patient' },
        ],
      },
      {
        compte: '71241',
        label: 'Club municipal — piscine',
        lignes: [
          { label: 'Location de l\'espace autour de la piscine au Club municipal', montant: 500_000, unite: 'F par manifestation et par tranche de 6h' },
          { label: 'Droit d\'accès à la piscine pour enfant au Club municipal',    montant: 2_500,   unite: 'F par séance et par tranche de 6h' },
          { label: 'Droit d\'accès à la piscine pour adulte au Club municipal',    montant: 5_000,   unite: 'F par séance et par tranche de 6h' },
        ],
      },
      {
        compte: '71246',
        label: 'Club municipal — autres recettes sports et loisirs',
        lignes: [
          { label: 'Location de centre de loisirs',      montant: 10_000,  unite: 'F par manifestation et par tranche de 6h' },
          { label: 'Location de la petite salle de sports', montant: 100_000, unite: 'F par manifestation et par tranche de 6h' },
          { label: 'Location de la grande salle climatisée', montant: 500_000, unite: 'F par manifestation et par tranche de 6h' },
        ],
      },
      {
        compte: '71250',
        label: 'Activités culturelles',
        lignes: [
          { label: 'Enquête préalable à l\'autorisation de manifestations publiques', montant: 2_000, unite: 'F par autorisation et par manifestation' },
        ],
      },
      {
        compte: '7126',
        label: 'Location de matériel communal',
        lignes: [
          { label: 'Chaises', montant: 50,    unite: 'F par chaise et par jour' },
          { label: 'Bâches',  montant: 5_000, unite: 'F par bâche et par jour' },
        ],
      },
    ],
  },
  {
    chapitre: '713',
    titre: 'RECETTES DES SERVICES ÉCONOMIQUES',
    sections: [
      {
        compte: '71330',
        label: 'Transports — Administration et autorisations',
        lignes: [
          { label: 'Enquête préalable à l\'autorisation de circulation taxi',   montant: 20_000, unite: 'F par autorisation, par taxi et par trimestre' },
          { label: 'Renouvellement annuel autorisation de circulation taxi',    montant: 13_000, unite: 'F par taxi et par an' },
          { label: 'Duplicata autorisation de circulation taxi',                montant: 3_000,  unite: 'F par duplicata' },
          { label: 'Enquête préalable à la mutation d\'autorisation',           montant: 13_000, unite: 'F par enquête' },
        ],
      },
      {
        compte: '71331',
        label: 'Transport par routes — gares routières — stations de taxis',
        lignes: [
          { label: 'Stationnement taxis communaux',                          montant: 4_500,  unite: 'F par taxi et par mois' },
          { label: 'Stationnement camions',                                  montant: 9_000,  unite: 'F par camion et par mois' },
          { label: 'Stationnement véhicules de location',                    montant: 10_000, unite: 'F par véhicule et par mois' },
          { label: 'Stationnement camion transport matériaux/vidange',       montant: 10_000, unite: 'F par camion et par mois' },
          { label: 'Stationnement camion remorque < 60 tonnes',              montant: 20_000, unite: 'F par véhicule et par mois' },
          { label: 'Parking public aménagé véhicules transport en commun',   montant: 500,    unite: 'F par camion et par mois' },
        ],
      },
      {
        compte: '71336',
        label: 'Plaques et macarons d\'identification',
        lignes: [
          { label: 'Plaque d\'identification charrettes',             montant: 2_000,  unite: 'F par plaque et par an' },
          { label: 'Macarons de taxis communaux',                     montant: 4_000,  unite: 'F par paire de macaron et par an' },
          { label: 'Antenne taxis communaux',                         montant: 32_000, unite: 'F par antenne et par 2 ans' },
          { label: 'Enquête préalable travaux de passage de réseaux', montant: 100_000,unite: 'F par 100 m linéaires et par 2 heures' },
        ],
      },
      {
        compte: '71344',
        label: 'Marchés — Places et emplacements',
        description: 'Droits d\'occupation des places dans les marchés communaux de Cocody.',
        lignes: [
          { label: 'Places en dehors des auvents',     montant: 3_000,  unite: 'F par m² ou fraction de m² et par mois' },
          { label: 'Places sous auvents',              montant: 6_000,  unite: 'F par m² ou fraction de m² et par mois' },
          { label: 'Cage à volailles',                 montant: 10_000, unite: 'F par place et par mois' },
          { label: 'Place à la poissonnerie sur étale',montant: 10_000, unite: 'F par place et par mois' },
        ],
      },
      {
        compte: '71345',
        label: 'Foires et expositions',
        lignes: [
          { label: 'Enquête préalable d\'organisation de foire/expo',    montant: 30_000, unite: 'F par autorisation' },
          { label: 'Sites de parcs d\'expositions concessionnaires',     montant: 4_000,  unite: 'F par m² et par mois' },
        ],
      },
      {
        compte: '71346',
        label: 'Plaques d\'identification et autorisations commerciales',
        lignes: [
          { label: 'Plaque identification petits commerçants et artisans',       montant: 2_500,   unite: 'F par plaque et par an' },
          { label: 'Plaque identification magasins',                             montant: 2_000,   unite: 'F par plaque et par an' },
          { label: 'Enquête préalable à l\'installation de pylônes/antennes',   montant: 500_000, unite: 'F par autorisation et par pylône ou antenne' },
          { label: 'Inspection annuelle zones d\'implantation pylônes/antennes',montant: 150_000, unite: 'F par pylône ou antenne et par an' },
        ],
      },
      {
        compte: '71356',
        label: 'Taxe de développement touristique',
        lignes: [
          { label: 'Taxe de développement touristique', montant: 50, unite: 'F par client et par facture' },
        ],
      },
    ],
  },
]

// ══════════════════════════════════════════════════════
// SECTION 72 — REVENUS DU PATRIMOINE
// ══════════════════════════════════════════════════════
export const SECTION_72: ChapitreBareme[] = [
  {
    chapitre: '720',
    titre: 'REVENUS DU PATRIMOINE IMMOBILIER — BAUX ET LOCATIONS',
    sections: [
      {
        compte: '72000',
        label: 'Appartements et locaux communaux',
        lignes: [
          { label: 'Appartements 2 pièces',                                          montant: 60_000,    unite: 'F par appartement et par mois' },
        ],
      },
      {
        compte: '72000',
        label: 'Centre commercial des Deux Plateaux Vallons',
        lignes: [
          { label: 'Boutique (magasin 1)',                  montant: 80_000,    unite: 'F par boutique et par mois' },
          { label: 'Boutique de 55 m²',                    montant: 62_500,    unite: 'F par boutique et par mois' },
          { label: 'Box',                                   montant: 55_500,    unite: 'F par box et par mois' },
          { label: 'Espace de rafraîchissement',            montant: 50_000,    unite: 'F par espace et par mois' },
        ],
      },
      {
        compte: '72000',
        label: 'Centre commercial du 12ème arrondissement',
        lignes: [
          { label: 'Magasin type 1 (12 m²)',  montant: 75_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin type 2 (10 m²)',  montant: 55_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin type 3 (9 m²)',   montant: 40_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin type 4 (6 m²)',   montant: 25_000, unite: 'F par magasin et par mois' },
        ],
      },
      {
        compte: '72000',
        label: 'Galerie Marchande Booker Washington (Marché Adjégon)',
        lignes: [
          { label: 'Magasin 1 (15 m²)', montant: 70_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin 2 (12 m²)', montant: 60_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin 3 (10 m²)', montant: 50_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin 4 (9 m²)',  montant: 40_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin 5 (8 m²)',  montant: 35_000, unite: 'F par magasin et par mois' },
          { label: 'Magasin 6 (8 m²)',  montant: 30_000, unite: 'F par magasin et par mois' },
          { label: 'Box 1 (8 m²)',      montant: 30_000, unite: 'F par box et par mois' },
          { label: 'Box 2 (6 m²)',      montant: 25_000, unite: 'F par box et par mois' },
          { label: 'Box 3 (7 m²)',      montant: 20_000, unite: 'F par box et par mois' },
          { label: 'Box 4 (4 m²)',      montant: 15_000, unite: 'F par box et par mois' },
          { label: 'Salle d\'eau (WC)', montant: 40_000, unite: 'F par WC et par mois' },
          { label: 'Étales',            montant: 10_000, unite: 'F par étale et par mois' },
        ],
      },
      {
        compte: '72000',
        label: 'Concessions de marchés — redevances annuelles',
        lignes: [
          { label: 'Marché Saint Jean (nouveau)',  montant: 8_000_000, unite: 'F par an' },
          { label: 'Parking marché de Saint Jean', montant: 1_500_000, unite: 'F par an' },
          { label: 'Marché de COCOVICO',           montant: 3_600_000, unite: 'F par an' },
          { label: 'Marché de DOKUI DJOMI',        montant: 600_000,   unite: 'F par an' },
          { label: 'Marché de PALMERAIE',          montant: 600_000,   unite: 'F par an' },
          { label: 'Marché de BESSIKOI',           montant: 1_200_000, unite: 'F par an' },
          { label: 'Marché de DJOROGOBITE',        montant: 2_000_000, unite: 'F par an' },
        ],
      },
      {
        compte: '72030',
        label: 'Occupations temporaires du domaine public communal',
        lignes: [
          { label: 'Vente promotionnelle, solde, expo, foire (domaine public)',   montant: 5_000, unite: 'F par fraction de 4 m² et par jour' },
          { label: 'Occupation avec fermeture temporaire de voie',                montant: 2_500, unite: 'F par fraction de 2 m² et par jour' },
          { label: 'Supports publicitaires sur domaine public',                   montant: 5_000, unite: 'F par fraction de 4 m² et par jour' },
          { label: 'Clôture de chantier sur domaine public',                      montant: 5_000, unite: 'F par fraction de 2 m² et par jour' },
          { label: 'Activités culturelles, sportives, prises de vue',             montant: 6_000, unite: 'F par fraction de 200 m linéaires et par jour' },
          { label: 'Activités promotionnelles mobiles',                           montant: 50_000,unite: 'F par fraction de 200 m linéaires et par jour' },
        ],
      },
      {
        compte: '72031',
        label: 'Concessions sur accord conventionnel',
        lignes: [
          { label: 'Kiosques privés, stations essence, devantures sur domaine public',         montant: 4_000, unite: 'F par m² et par mois' },
          { label: 'Sites de vente de véhicules d\'occasion',                                  montant: 4_000, unite: 'F par m² et par mois' },
          { label: 'Terrasse à café, podium, kiosques < 3 m², box commerciaux, fleuristes',   montant: 6_000, unite: 'F par m² et par mois' },
          { label: 'Aire de parking de stationnement sur domaine public',                      montant: 4_000, unite: 'F par m² et par mois' },
        ],
      },
      {
        compte: '72032',
        label: 'Dépôts temporaires sur domaine public',
        lignes: [
          { label: 'Camion toupie pour coulage de béton préfabriqué',                      montant: 100_000, unite: 'F par fraction de 15 m³ par coulage' },
          { label: 'Matériaux de construction, bétonneuse, engins de chantier',            montant: 200_000, unite: 'F par fraction de 30 m² pour 15 jours' },
          { label: 'Véhicule de transport de personnes (dépôt temporaire)',                montant: 10_000,  unite: 'F par véhicule et par jour' },
        ],
      },
    ],
  },
]

// Toutes sections réunies
export const BAREME_COMPLET = [
  { id: 'S70', label: 'Section 70 — Recettes fiscales',                      chapitres: SECTION_70 },
  { id: 'S71', label: 'Section 71 — Recettes des prestations et services',   chapitres: SECTION_71 },
  { id: 'S72', label: 'Section 72 — Revenus du patrimoine et du portefeuille', chapitres: SECTION_72 },
]

// ── Helpers pour la déclaration ──
export const TAUX_ENTREPRENANT = {
  commerce: { taux: 2, label: 'Commerce / négoce' },
  services: { taux: 2.5, label: 'Prestations de services' },
  ambulant: { taux: 0, tarif_journalier: 100, label: 'Étalage / ambulant (CA < 1 200 000 FCFA/an)' },
}

export function calculerTaxeEntreprenant(type: 'commerce' | 'services' | 'ambulant', caAnnuel: number): number {
  if (type === 'ambulant') return 100
  return Math.round(caAnnuel * TAUX_ENTREPRENANT[type].taux / 100 / 12)
}
