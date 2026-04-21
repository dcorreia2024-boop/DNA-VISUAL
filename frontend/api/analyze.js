// Vercel Serverless — analise de documento via OpenRouter

const ANALYZE_PROMPT = `Voce e o assistente de onboarding visual da V4 Ruston & Co. Analise o conteudo do documento enviado e identifique quais informacoes do formulario de onboarding estao presentes e quais estao faltando.

Responda APENAS com JSON valido, sem markdown, sem texto adicional, no formato:
{
  "clientCompany": { "found": true, "content": "texto extraido ou vazio" },
  "clientNiche": { "found": false, "content": "" },
  ...
}

OS CAMPOS SAO:

DADOS BASE:
- clientCompany: Nome da empresa ou marca
- clientNiche: Nicho ou segmento de atuacao
- clientCity: Cidade e estado de atuacao
- clientWebsite: Site do cliente (URL)
- clientInstagram: Instagram do cliente (@)
- clientOtherSocial: Outras redes sociais
- competitor1: Concorrente 1
- competitor2: Concorrente 2
- competitor3: Concorrente 3

REUNIAO COM O CLIENTE:
- businessDescription: O que a empresa faz, pra quem vende e qual problema resolve
- idealClient: Cliente ideal — idade, perfil, renda, o que valoriza
- motivation: O que motivou buscar esse trabalho agora
- brandPersonality: 3 palavras que definem a personalidade da marca + como fala
- brandFeeling: O que quer que as pessoas sintam + o que NAO quer ser associado
- missionValues: Missao, visao, valores ou slogan
- futureVision: Onde quer estar em 2-3 anos
- existingIdentity: O que ja tem de identidade visual (logo, cores HEX, fontes, manual)
- visualStyle: Estilo visual desejado + marcas que admira
- visualHate: O que detesta visualmente
- existingMaterials: Fotos e videos que ja tem + onde estao
- missingMaterials: O que nao tem e precisa ser criado
- pastResults: Campanhas que funcionaram bem + que falharam
- voiceTone: Tom de comunicacao (formal/informal, humor, girias, emojis, palavras)
- freeNotes: Observacoes livres

REGRAS:
- So marque found:true se o documento realmente contem informacao relevante para aquele campo
- Extraia o trecho mais relevante como content
- Nao invente informacoes que nao estao no documento
- SEMPRE retorne TODOS os campos listados acima, mesmo que com found:false
- Responda APENAS com JSON valido, sem markdown, sem texto antes ou depois`;

async function callOpenRouter(userContent, systemPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';
  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';

  if (!apiKey) throw new Error('OPENROUTER_API_KEY nao configurada');

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://dna-visual-three.vercel.app',
      'X-Title': 'DNA Visual - V4 Ruston & Co.'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter ${response.status}: ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Resposta invalida do OpenRouter');
  }
  return data.choices[0].message.content;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body || {};
  if (!content) {
    return res.status(400).json({ error: 'content is required' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(200).json({ mode: 'local', content });
  }

  // Truncate very long documents to avoid hitting token limits (keep first ~40k chars)
  const trimmed = content.length > 40000 ? content.slice(0, 40000) + '\n\n[... documento truncado ...]' : content;

  try {
    const raw = await callOpenRouter(trimmed, ANALYZE_PROMPT);
    // Extract JSON from response (IA sometimes wraps in markdown code blocks)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ mode: 'api', analysis: parsed });
      } catch (parseErr) {
        return res.status(200).json({ mode: 'fallback', error: 'JSON invalido da IA', raw, content });
      }
    }
    return res.status(200).json({ mode: 'fallback', raw, content });
  } catch (err) {
    console.error('OpenRouter analyze error:', err.message);
    return res.status(200).json({ mode: 'fallback', error: err.message, content });
  }
}
