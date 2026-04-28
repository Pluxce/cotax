// Modèles free OpenRouter — essayés dans l'ordre, passe au suivant si 429
const FREE_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'google/gemini-2.5-pro-exp-03-25:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
]

export async function callOpenRouter({
  messages,
  maxTokens = 400,
}: {
  messages: { role: string; content: string }[]
  maxTokens?: number
}): Promise<string> {
  const key = process.env.OPENROUTER_KEY
  if (!key) throw new Error('OPENROUTER_KEY manquante dans .env.local')

  let lastError = ''

  for (const model of FREE_MODELS) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cotax.cocody.ci',
        'X-Title': 'CoTax Cocody',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
        max_tokens: maxTokens,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      return data.choices?.[0]?.message?.content ?? ''
    }

    const text = await res.text()

    if (res.status === 429) {
      console.warn(`[openrouter] ${model} rate-limited, essai suivant...`)
      lastError = `429 rate-limit (${model})`
      continue
    }

    // autre erreur — on tente quand même le modèle suivant
    console.error(`[openrouter] ${model} erreur ${res.status}:`, text)
    lastError = `${res.status} (${model}): ${text.slice(0, 200)}`
  }

  throw new Error(`Tous les modèles indisponibles. Dernière erreur : ${lastError}`)
}
