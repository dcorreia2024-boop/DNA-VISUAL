// Vercel Serverless — geracao de dossie JSON via OpenRouter

const DOSSIER_PROMPT = `Voce e o assistente de onboarding visual da V4 Ruston & Co. Analise as respostas do cliente e gere um dossie profissional de identidade visual.

CONTEXTO DO TEMPLATE:
O dossie sera renderizado num template editorial 'Brand Book Premium v2' com 8 capitulos organizados, capa, sumario e sintese final. Voce DEVE retornar JSON valido seguindo EXATAMENTE o schema abaixo.

REGRAS CRITICAS:
- Responda APENAS com JSON valido. Sem markdown, sem texto antes/depois, sem backticks.
- Linguagem pratica e acionavel — pense num designer abrindo Figma amanha.
- Sugira cores com HEX reais e nomes EVOCATIVOS (ex: Rosa Antigo, Verde Sage, Azul Confianca).
- Sugira fontes do Google Fonts (Cormorant Garamond, Playfair Display, DM Sans, Inter, Montserrat).
- Diferencie o que TEM do que PRECISA SER CRIADO.
- Para concorrentes desconhecidos, diga "Pesquisar antes de produzir" em vez de inventar.

RETORNE ESTE JSON EXATO:

{
  "clientName": "Nome do cliente. Use <em>palavra</em> pra italicizar parte do nome se fizer sentido (ex: 'Bloom <em>Studio</em>').",
  "designerName": "Nome do designer",
  "edition": "VOL. 01",
  "issue": "NO. 0042",
  "segment": "Segmento (ex: Design floral - Estudio autoral)",
  "location": "Cidade ou Brasil",
  "tagline": "1-2 frases descritivas pra capa, sem cliche",

  "brandEssence": {
    "purpose": "Frase forte de proposito (vai como quote no Cap 01)",
    "mission": "Missao em 1-2 frases praticas",
    "vision": "Visao de 2-3 anos com meta concreta",
    "values": ["Valor1", "Valor2", "Valor3", "Valor4"],
    "personality": ["Palavra1", "Palavra2", "Palavra3", "Palavra4"],
    "personalityMeanings": ["descricao curta de palavra1", "descricao 2", "descricao 3", "descricao 4"]
  },

  "targetAudience": {
    "primary": {
      "profile": "Publico primario em 2-3 linhas. Use <strong>palavras</strong> pra destacar.",
      "painPoints": ["dor1", "dor2", "dor3"],
      "desires": ["tag1", "tag2", "tag3", "tag4"]
    },
    "secondary": {
      "profile": "Publico secundario (B2B). Use <strong>destaque</strong>.",
      "painPoints": ["dor1", "dor2"],
      "desires": ["tag1", "tag2", "tag3"]
    }
  },

  "colorPalette": {
    "primary": {"name": "Rosa Antigo", "hex": "#C9856C", "usage": "CTAs, destaques, elementos principais", "proportion": 40},
    "secondary": {"name": "Verde Sage", "hex": "#8A9E7B", "usage": "Fundos secundarios, suporte", "proportion": 25},
    "neutral": {"name": "Creme Marfim", "hex": "#F5EFE6", "usage": "Fundos, espacos em branco", "proportion": 25},
    "dark": {"name": "Terracota Escuro", "hex": "#3D2B1F", "usage": "Textos, contrastes", "proportion": 10},
    "accent": {"name": "Dourado Suave", "hex": "#D4AF7A", "usage": "Detalhes premium", "proportion": 0}
  },

  "typography": [
    {"role": "display", "family": "Cormorant Garamond", "weights": ["300", "400", "500", "600"], "usage": "Headlines, titulos, logo"},
    {"role": "text", "family": "DM Sans", "weights": ["400", "500", "600"], "usage": "Texto corrido, UI, legendas"}
  ],

  "toneOfVoice": {
    "quote": "1 frase resumindo a voz da marca (vai como pullquote)",
    "adjectives": ["adj1", "adj2", "adj3", "adj4"],
    "doSay": ["copy1", "copy2", "copy3", "copy4"],
    "dontSay": ["off-brand 1", "off-brand 2", "off-brand 3", "off-brand 4"],
    "wordsToUse": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6"],
    "wordsToAvoid": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6"]
  },

  "competitors": [
    {"name": "Nome", "positioning": "Categoria - Cidade", "type": "incumbent", "strength": "o que fazem bem", "weakness": "o que fazem mal", "differentiator": "como nos diferenciamos"},
    {"name": "Nome", "positioning": "Categoria - Cidade", "type": "nicho", "strength": "...", "weakness": "...", "differentiator": "..."},
    {"name": "Nome", "positioning": "Categoria - Cidade", "type": "global", "strength": "...", "weakness": "...", "differentiator": "..."}
  ],

  "visualReferences": {
    "principles": [
      {"name": "Editorial", "description": "como aplicar"},
      {"name": "Organico", "description": "como aplicar"},
      {"name": "Refinado", "description": "como aplicar"}
    ],
    "avoid": ["restricao1", "restricao2", "restricao3", "restricao4", "restricao5"]
  },

  "materials": {
    "existing": [
      {"title": "Nome do ativo", "description": "detalhes (formato, localizacao)"}
    ],
    "toCreate": [
      {"title": "Nome do ativo", "description": "contexto", "priority": "alta"},
      {"title": "Nome", "description": "...", "priority": "media"},
      {"title": "Nome", "description": "...", "priority": "baixa"}
    ]
  },

  "history": {
    "worked": {"quote": "frase entre aspas descrevendo o que funcionou", "explanation": "por que funcionou e como replicar"},
    "failed": {"quote": "frase entre aspas descrevendo o que falhou", "explanation": "por que falhou e o que aprender"},
    "benchmarks": "Observacoes estrategicas com <strong>destaques</strong>. Benchmarks aspiracionais e anti-benchmarks."
  },

  "deliveries": [
    {"name": "Templates Instagram", "priority": "Prioridade Alta", "objective": "objetivo", "direction": "direcao visual", "avoid": "o que evitar"},
    {"name": "Embalagem", "priority": "Estrategico", "objective": "...", "direction": "...", "avoid": "..."},
    {"name": "Site Institucional", "priority": "Volume Alto", "objective": "...", "direction": "...", "avoid": "..."}
  ],

  "designerChecklist": {
    "immediate": ["acao1", "acao2", "acao3", "acao4", "acao5"],
    "pending": "nota sobre pendencias operacionais (CRM, equipe, etc) ou null",
    "questions": ["pergunta1", "pergunta2", "pergunta3", "pergunta4"]
  },

  "finalSummary": {
    "main": "Sintese principal com <em>frase em italico</em>. 1-2 linhas que resumem o dossie inteiro.",
    "startHere": ["item1", "item2", "item3", "item4"],
    "defend": ["item1", "item2", "item3", "item4"],
    "avoid": ["item1", "item2", "item3", "item4"]
  },

  "typographyMockups": {
    "instagram": {"handle": "@brand", "title": "Frase exemplo com <em>italico</em>.", "meta": "Colecao 2026"},
    "tag": {"number": "Numero 042", "name": "Brand <em>Studio</em>", "message": "Mensagem manuscrita"},
    "hero": {"eyebrow": "Colecao Permanente", "title": "Titulo do hero <em>com italico</em>", "cta": "CTA do botao"}
  }
}

REGRA PARA CONCORRENTES:
- type: 'incumbent' (lider tradicional), 'nicho' (regional/especializado), 'global' (referencia internacional)
- Use as informacoes do cliente. Se nao tem dados, diga "Pesquisar antes de produzir".
- NAO invente analises genericas.

REGRA PARA CORES:
- 5 cores no colorPalette: primary, secondary, neutral, dark, accent (todas obrigatorias)
- Nomes evocativos (NUNCA so "Azul" ou "Roxo" — sempre "Azul Confianca", "Verde Sage")
- proportion soma 100% (use 0 no accent se nao for usado)
- HEX reais e acessiveis (contraste WCAG)

REGRA PARA TIPOGRAFIA:
- typography[0] = display (serif normalmente, role: "display")
- typography[1] = body (sans normalmente, role: "text")
- Fontes do Google Fonts (Cormorant Garamond, Playfair Display, DM Sans, Inter, etc)

REGRA PARA MATERIALS.toCreate:
- priority: "alta", "media", "baixa" (lowercase, sem acento)

REGRA PARA finalSummary:
- main: pode ter <em> pra italicizar trechos
- startHere: o que designer faz primeiro (4 items)
- defend: principios visuais a manter sempre (4 items)
- avoid: o que NAO fazer nunca (4 items)`;

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

// FALLBACK CHAIN: tenta o modelo principal, se falhar tenta os proximos
const MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-4-31b-it:free',
  'openai/gpt-oss-120b:free',
];

async function callOpenRouter(userContent, systemPrompt) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';

  if (!apiKey) throw new Error('OPENROUTER_API_KEY nao configurada');

  let lastError = null;

  for (const model of MODEL_CHAIN) {
    try {
      console.log(`[DNA] Tentando modelo: ${model}`);

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
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Resposta vazia do modelo');
      }

      console.log(`[DNA] Sucesso com modelo: ${model}`);
      return data.choices[0].message.content;

    } catch (err) {
      console.warn(`[DNA] Modelo ${model} falhou: ${err.message}`);
      lastError = err;
      // Continua pro proximo modelo
    }
  }

  throw new Error(`Todos os modelos falharam. Ultimo erro: ${lastError?.message}`);
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
