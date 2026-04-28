import { NextRequest, NextResponse } from 'next/server'
import { callOpenRouter } from '@/lib/openrouter'

// Barème condensé — utilisé comme contexte système pour le modèle
const SYSTEM_PROMPT = `Tu es un assistant fiscal expert de la Mairie de Cocody (Côte d'Ivoire).
Tu analyses l'activité d'un contribuable et retournes le régime fiscal applicable selon la Délibération N°2025-172/CC/CM/SG du 04/11/2025.

BARÈME FISCAL COCODY 2026:

COMPTE 70262 — Taxe communale de l'entreprenant (personne physique NON assujettie à la patente):
• Commerce, négoce, vente en boutique → 2 % du CA annuel ÷ 12 = mensualité
• Prestations de services, artisanat, coiffure, couture, mécanique, informatique → 2,5 % du CA annuel ÷ 12
• Vendeur ambulant / étalage en marché (CA annuel < 1 200 000 FCFA) → 100 F par jour de vente

COMPTE 7027 — Taxe sur locaux loués en garnis (hôtels, résidences meublées, auberges, chambres louées):
• 1 % à 5 % de la valeur locative mensuelle selon taux d'occupation
• Taxe de nuitée: 500 F (sans étoile/1★), 1 000 F (2★), 1 500 F (3★+), 2 000 F (résidence meublée) — par client par nuit

COMPTE 7031 — Taxe sur charrettes: 1 000 F/mois (à bras), 2 000 F/mois (à moteur)

COMPTE 7034 — Manifestations sportives payantes: 5 % des recettes brutes par événement

COMPTE 7036 — Spectacles, galas, concerts: 10 % des recettes brutes par événement

COMPTE 7038 — Établissements de nuit:
• Exploitant entreprenant (bar/buvette, non-patente): 3 000 F par mois
• Exploitant patente (bar à boissons): 52 500 F par mois
• Discothèque/cabaret (patente): 60 000 F par mois

COMPTE 7041 — Taxi communal (wôrô-wôrô): 20 000 F par taxi par trimestre

COMPTE 7042 — Publicité visible depuis voie publique:
• Affiche papier: 200 F/m²/mois | Affiche peinte/vitrée: 1 000 F/m²/mois | Annonce lumineuse: 3 000 F/m²/mois

RÈGLE PRINCIPALE — Entreprenant vs Patente:
• "Entreprenant" = personne physique exerçant une activité économique sans être assujettie à la patente (petits commerçants, artisans, prestataires informels).
• "Patente" = entreprise formelle enregistrée au RCCM sous forme juridique (SARL, SA, EI au BIC/BNC), généralement avec un CA annuel ≥ 50 millions FCFA.

VALEURS taxType POSSIBLES (choisir exactement une):
"commerce"     → boutique, épicerie, quincaillerie, pharmacie, vente de marchandises avec local fixe (entreprenant)
"services"     → coiffure, couture, réparation, informatique, plomberie, menuiserie, restauration légère, prestataire (entreprenant)
"ambulant"     → vente sans local fixe, en marché ou en déplacement, CA annuel < 1 200 000 FCFA
"loue"         → hôtel, auberge, résidence meublée, chambre meublée louée à court terme
"nuit_ent"     → bar, buvette, maquis (exploitant non-patente / entreprenant)
"nuit_pat"     → bar à boissons, boîte de nuit, cabaret (exploitant assujetti à la patente)
"taxi"         → taxi communal wôrô-wôrô
"spectacle"    → concert, gala, spectacle culturel payant
"sport"        → tournoi sportif payant, match avec billetterie
"charrette"    → charrette à bras ou à moteur
"pub_papier"   → affichage papier, bannière, kakémono
"pub_enseigne" → enseigne peinte sur mur, panneau vitré

INSTRUCTIONS:
- Si l'activité est clairement identifiable, mets "fiable": true ; sinon "fiable": false
- montantEstime = estimation du montant mensuel en FCFA (si CA fourni, calcule ; sinon mets 0)
- Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte autour, sans markdown, sans backticks

FORMAT EXACT (JSON brut):
{"taxType":"commerce","compte":"70262","regime":"Taxe entreprenant — commerce","assiette":"2 % du CA annuel","montantEstime":3000,"periodeCalcul":"par mois","justification":"2-3 phrases en français expliquant pourquoi ce régime s'applique.","fiable":true}`

export interface AiAssietteResult {
  taxType: string
  compte: string
  regime: string
  assiette: string
  montantEstime: number
  periodeCalcul: string
  justification: string
  fiable: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { description, reponses } = await req.json() as {
      description: string
      reponses: Record<string, string>
    }

    const repStr = Object.entries(reponses)
      .filter(([, v]) => v && v !== '— Choisir —')
      .map(([k, v]) => `• ${k}: ${v}`)
      .join('\n')

    const userContent = `Activité déclarée :\n${description}${repStr ? `\n\nInformations complémentaires :\n${repStr}` : ''}\n\nRetourne l'objet JSON correspondant à ce profil fiscal.`

    let raw: string
    try {
      raw = await callOpenRouter({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        maxTokens: 400,
      })
    } catch (aiErr) {
      return NextResponse.json({ error: String(aiErr) }, { status: 502 })
    }

    let parsed: AiAssietteResult
    try {
      const match = raw.match(/\{[\s\S]+\}/)
      parsed = JSON.parse(match ? match[0] : raw)
    } catch {
      return NextResponse.json(
        { error: 'Réponse IA non analysable', raw },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
