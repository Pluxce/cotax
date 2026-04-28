import { NextRequest, NextResponse } from 'next/server'
import { TYPES_ACTIVITES } from '@/lib/activites'
import { callOpenRouter } from '@/lib/openrouter'

export interface ActAiResult {
  activiteId: string
  categorie: string
  compte: string
  regime: string
  tarifApplicable: string
  justification: string
  fiable: boolean
}

function buildPrompt(): string {
  const list = TYPES_ACTIVITES.map(a =>
    `${a.id} | ${a.label} | cat: ${a.categorie} | cpt: ${a.compte} | tarif: ${a.tarifApplicable}`
  ).join('\n')

  return `Tu es un assistant d'enregistrement d'activités économiques à la Mairie de Cocody (Côte d'Ivoire).
À partir de la description libre donnée par un contribuable, tu identifies le type d'activité le plus proche dans le répertoire officiel 2026.

RÉPERTOIRE OFFICIEL (id | libellé | catégorie | compte | tarif):
${list}

RÈGLES:
- Choisis TOUJOURS l'activiteId le plus précis parmi ceux listés ci-dessus
- Si l'activité décrite correspond à plusieurs entrées, prends celle dont le libellé est le plus spécifique
- Si tu n'es pas certain à plus de 70 %, mets "fiable": false et explique dans justification
- Réponds UNIQUEMENT avec du JSON brut, sans markdown, sans backticks, sans texte autour

FORMAT EXACT:
{"activiteId":"ACT-001","categorie":"Commerce & Artisanat","compte":"70262","regime":"Taxe entreprenant — commerce","tarifApplicable":"2 % du CA annuel mensuel","justification":"...2-3 phrases en français...","fiable":true}`
}

export async function POST(req: NextRequest) {
  try {
    const { description, reponses } = await req.json() as {
      description: string
      reponses?: Record<string, string>
    }

    const repStr = reponses
      ? Object.entries(reponses)
          .filter(([, v]) => v)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join('\n')
      : ''

    const userContent = `Activité déclarée :\n${description}${repStr ? `\n\nPrécisions :\n${repStr}` : ''}\n\nIdentifie l'activiteId correspondant dans le répertoire.`

    let raw: string
    try {
      raw = await callOpenRouter({
        messages: [
          { role: 'system', content: buildPrompt() },
          { role: 'user', content: userContent },
        ],
        maxTokens: 350,
      })
    } catch (aiErr) {
      return NextResponse.json({ error: String(aiErr) }, { status: 502 })
    }

    let parsed: ActAiResult
    try {
      const match = raw.match(/\{[\s\S]+\}/)
      parsed = JSON.parse(match ? match[0] : raw)
    } catch {
      return NextResponse.json({ error: 'Réponse IA non analysable', raw }, { status: 500 })
    }

    // Validate that the returned activiteId exists
    const exists = TYPES_ACTIVITES.some(a => a.id === parsed.activiteId)
    if (!exists) {
      parsed.fiable = false
      parsed.justification = `Activité non trouvée (${parsed.activiteId}). ${parsed.justification ?? ''}`
    }

    return NextResponse.json(parsed)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
