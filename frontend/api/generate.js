// Vercel Serverless — geracao de dossie JSON via OpenRouter

const DOSSIER_PROMPT = `Voce e o assistente de onboarding visual da V4 Ruston & Co. Analise as respostas do formulario e gere um dossie profissional de identidade visual.

REGRAS CRITICAS:
- Responda APENAS com JSON valido. Sem markdown, sem texto antes ou depois, sem backticks.
- Linguagem pratica e acionavel
- Se informacao nao foi fornecida, use null ou string vazia / array vazio
- Sugira cores com codigos HEX reais e nomes descritivos
- Sugira tipografia com nomes de fontes reais do Google Fonts
- Diferencie o que o cliente TEM do que PRECISA SER CRIADO
- Gere 3-4 exemplos concretos de copy ON-BRAND e OFF-BRAND
- Liste acoes imediatas praticas no checklist

RETORNE ESTE JSON EXATO (todos os campos obrigatorios):
{
  "clientName": "nome do cliente",
  "segment": "segmento",
  "city": "cidade, estado",
  "status": "contexto atual (rebranding, lancamento, expansao)",
  "positioning": "1 frase de posicionamento da marca",
  "mission": "missao em 1-2 frases",
  "vision": "visao de 2-3 anos",
  "values": "valores separados por quebra de linha",
  "slogan": "slogan se tiver, null se nao",
  "personality": ["palavra1", "palavra2", "palavra3"],
  "targetAge": "faixa etaria",
  "targetGender": "genero",
  "targetClass": "classe social",
  "targetLocation": "localizacao",
  "targetBehavior": "comportamento e o que valorizam",
  "targetPain": "dor principal",
  "valueProposition": "proposta de valor em 2-3 frases",
  "wantAssociations": ["assoc1", "assoc2", "assoc3", "assoc4", "assoc5"],
  "avoidAssociations": ["evitar1", "evitar2", "evitar3", "evitar4", "evitar5"],
  "colors": [
    {"name": "Nome", "hex": "#XXXXXX", "role": "primaria", "usage": "uso"},
    {"name": "Nome", "hex": "#XXXXXX", "role": "secundaria", "usage": "uso"},
    {"name": "Nome", "hex": "#XXXXXX", "role": "neutra", "usage": "uso"}
  ],
  "typography": [
    {"family": "Nome da Fonte", "weight": "Bold (700)", "usage": "Headlines", "status": "recomendada"},
    {"family": "Nome da Fonte", "weight": "Regular (400)", "usage": "Corpo", "status": "recomendada"}
  ],
  "visualStyle": [
    {"adjective": "Adj1", "description": "descricao pratica"},
    {"adjective": "Adj2", "description": "descricao"},
    {"adjective": "Adj3", "description": "descricao"}
  ],
  "graphicElements": ["elem1", "elem2", "elem3"],
  "visualDontDo": ["restr1", "restr2", "restr3", "restr4"],
  "voiceAdjectives": [
    {"word": "Adj1", "description": "como se manifesta"},
    {"word": "Adj2", "description": "como se manifesta"},
    {"word": "Adj3", "description": "como se manifesta"}
  ],
  "communicationPersona": "persona em 2-3 frases",
  "copyOnBrand": ["ex1", "ex2", "ex3", "ex4"],
  "copyOffBrand": ["ex1", "ex2", "ex3", "ex4"],
  "alwaysUseWords": ["p1", "p2", "p3", "p4", "p5"],
  "neverUseWords": ["p1", "p2", "p3", "p4", "p5"],
  "platformGuidelines": [
    {"platform": "Instagram", "guideline": "direcionamento"},
    {"platform": "WhatsApp", "guideline": "direcionamento"},
    {"platform": "Site", "guideline": "direcionamento"}
  ],
  "competitors": [
    {"name": "Nome", "handle": "@handle", "location": "cidade", "doWell": "bem", "doBad": "mal", "differentiation": "diferencial"}
  ],
  "visualReferences": [
    {"name": "Marca", "description": "por que"}
  ],
  "existingAssets": [
    {"name": "Ativo", "details": "detalhes"}
  ],
  "assetsToCreate": [
    {"name": "Ativo", "priority": "alta", "details": "detalhes"}
  ],
  "whatWorked": {"description": "o que funcionou", "why": "por que"},
  "whatFailed": {"description": "o que falhou", "why": "por que"},
  "currentMotivation": "motivacao atual",
  "strategicNotes": "observacoes ou null",
  "deliveryGuidelines": [
    {"type": "LP (Landing Page)", "objective": "obj", "visualDirection": "direcao", "avoid": "evitar"},
    {"type": "Ads (Meta)", "objective": "obj", "visualDirection": "direcao", "avoid": "evitar"},
    {"type": "Carrossel (Instagram)", "objective": "obj", "visualDirection": "direcao", "avoid": "evitar"},
    {"type": "Stories", "objective": "obj", "visualDirection": "direcao", "avoid": "evitar"}
  ],
  "immediateActions": ["a1", "a2", "a3", "a4", "a5"],
  "pendingItems": [
    {"item": "item", "details": "detalhes e impacto"}
  ],
  "pendingQuestions": ["q1", "q2", "q3"],
  "designerSummary": "resumo em 2-3 frases"
}`;

const BASE_KEYS = new Set([
  'clientCompany', 'clientNiche', 'clientCity', 'clientWebsite',
  'clientInstagram', 'clientOtherSocial', 'competitor1', 'competitor2', 'competitor3',
  'clientName', 'designerName'
]);

const QUESTIONS = {
  businessDescription: 'O que a empresa faz, pra quem vende e qual problema resolve',
  idealClient: 'Cliente ideal (perfil detalhado)',
  motivation: 'Motivacao para buscar o trabalho agora',
  brandPersonality: 'Personalidade da marca (3 palavras + como fala)',
  brandFeeling: 'O que quer que as pessoas SINTAM (e o que NAO)',
  missionValues: 'Missao, visao, valores, slogan',
  futureVision: 'Visao de futuro (2-3 anos)',
  existingIdentity: 'Identidade visual existente (logo, cores, fontes, manual)',
  visualStyle: 'Estilo visual desejado + referencias',
  visualHate: 'O que detesta visualmente',
  existingMaterials: 'Fotos e videos que ja tem',
  missingMaterials: 'O que precisa ser criado do zero',
  pastResults: 'Campanhas passadas (sucessos e fracassos)',
  voiceTone: 'Tom de voz (formal/informal, humor, girias)',
  freeNotes: 'Observacoes livres'
};

function formatFormDataForAI(formData) {
  let text = '';
  text += '=== DADOS BASE DO CLIENTE ===\n\n';
  const baseFields = [
    ['Empresa', formData.clientCompany],
    ['Nicho', formData.clientNiche],
    ['Cidade', formData.clientCity],
    ['Site', formData.clientWebsite],
    ['Instagram', formData.clientInstagram],
    ['Outras redes', formData.clientOtherSocial],
    ['Concorrente 1', formData.competitor1],
    ['Concorrente 2', formData.competitor2],
    ['Concorrente 3', formData.competitor3],
  ];
  baseFields.forEach(([label, value]) => {
    if (value && String(value).trim()) text += `${label}: ${String(value).trim()}\n`;
  });

  text += '\n=== RESPOSTAS DA REUNIAO ===\n\n';
  Object.entries(formData).forEach(([key, value]) => {
    if (!BASE_KEYS.has(key) && value && String(value).trim()) {
      const label = QUESTIONS[key] || key;
      text += `**${label}**\n${String(value).trim()}\n\n`;
    }
  });

  return text;
}

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
      temperature: 0.5,
      max_tokens: 10000
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

function parseDossierJson(raw) {
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // Tenta parser direto
  try { return JSON.parse(cleaned); } catch {}

  // Extrai o bloco JSON que comeca com {
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }

  // Tenta reparar JSON truncado: pega do primeiro { ate onde puder parsear
  const start = cleaned.indexOf('{');
  if (start === -1) return null;
  const text = cleaned.slice(start);

  // Conta chaves/colchetes abertos e fecha-os
  let depth = { brace: 0, bracket: 0 };
  let inString = false;
  let escape = false;
  let lastValidPos = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth.brace++;
    else if (ch === '}') { depth.brace--; if (depth.brace === 0 && depth.bracket === 0) lastValidPos = i; }
    else if (ch === '[') depth.bracket++;
    else if (ch === ']') depth.bracket--;
  }

  // Se parou em string aberta, corta antes da ultima virgula valida
  if (inString) {
    // Encontra a ultima virgula fora de string
    let cut = -1;
    let inStr = false;
    let esc = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (ch === '"') inStr = !inStr;
      if (!inStr && ch === ',') cut = i;
    }
    if (cut > 0) {
      let repaired = text.slice(0, cut);
      // Conta de novo para fechar
      let b = 0, k = 0, s = false, e = false;
      for (let i = 0; i < repaired.length; i++) {
        const ch = repaired[i];
        if (e) { e = false; continue; }
        if (ch === '\\') { e = true; continue; }
        if (ch === '"') s = !s;
        if (!s) { if (ch === '{') b++; else if (ch === '}') b--; else if (ch === '[') k++; else if (ch === ']') k--; }
      }
      repaired += ']'.repeat(Math.max(0, k)) + '}'.repeat(Math.max(0, b));
      try { return JSON.parse(repaired); } catch {}
    }
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { formData } = req.body || {};
  if (!formData) return res.status(400).json({ error: 'formData is required' });

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(200).json({ mode: 'local' });
  }

  try {
    const userContent = formatFormDataForAI(formData);
    const raw = await callOpenRouter(userContent, DOSSIER_PROMPT);
    const json = parseDossierJson(raw);

    if (json) {
      return res.status(200).json({ mode: 'api', format: 'json', dossie: json });
    }
    // Fallback: retorna texto puro se JSON invalido
    return res.status(200).json({ mode: 'api', format: 'text', dossie: raw });
  } catch (err) {
    console.error('OpenRouter error:', err.message);
    return res.status(200).json({ mode: 'fallback', error: err.message });
  }
}
