// Vercel Serverless — geracao de dossie JSON via OpenRouter

const DOSSIER_PROMPT = `Voce e o assistente de onboarding visual da V4 Ruston & Co. Analise as respostas do cliente e gere um dossie profissional de identidade visual.

CONTEXTO DO TEMPLATE:
O dossie sera renderizado num template visual estilo "Brand Book Premium" (8 capitulos com capa, indice, sintese final e rodape). Voce precisa retornar JSON com TODOS os campos abaixo. Cada campo tem proposito especifico no layout.

REGRAS CRITICAS:
- Responda APENAS com JSON valido. Sem markdown, sem texto antes ou depois, sem backticks.
- Linguagem pratica e acionavel
- Se informacao nao foi fornecida, use null ou string vazia / array vazio
- Diferencie o que o cliente TEM do que PRECISA SER CRIADO
- Gere 3-4 exemplos concretos de copy ON-BRAND e OFF-BRAND
- Liste acoes imediatas praticas no checklist

REGRA PARA CONCORRENTES:
- Use PRIMARIAMENTE as informacoes que o cliente deu sobre os concorrentes
- Se voce nao tem informacoes especificas sobre um concorrente, seja HONESTO no campo:
  doWell: "Informacao insuficiente — pesquisar o perfil antes de produzir material"
  doBad: "Informacao insuficiente — pesquisar o perfil"
  differentiation: "Definir apos pesquisa dos concorrentes"
- NAO invente analises genericas como "Nao oferece solucoes de tecnologia de ponta"
- E melhor dizer que falta informacao do que inventar analises superficiais

REGRA PARA CORES:
- Nomes descritivos e evocativos — NAO use nomes genericos tipo "Azul" ou "Roxo"
- Use nomes como "Azul Eletrico", "Violeta Tech", "Rosa Quartzo", "Verde Musgo", "Bege Organico"
- No campo "usage", seja ESPECIFICO sobre onde usar:
  BOM: "Fundos de cards, CTAs principais, estados de hover"
  RUIM: "uso geral"
- Sugira 3-4 cores: primaria, secundaria, neutra e opcionalmente uma de apoio
- Use codigos HEX reais e acessiveis (contraste minimo 4.5:1 para texto)

REGRA PARA TIPOGRAFIA:
- Use nomes de fontes reais do Google Fonts (ex: Inter, Playfair Display, DM Sans, Montserrat)
- Especifique peso (Regular 400, Medium 500, Bold 700)
- Uso deve ser concreto: "Headlines H1 e H2", "Corpo de texto 14-16px", "Labels e legendas"

REGRA PARA CHECKLIST (pendingQuestions):
- As perguntas pendentes devem ser APENAS sobre informacoes que NAO foram fornecidas
- Se o cliente ja respondeu sobre publico-alvo, NAO pergunte "qual o publico-alvo"
- Foque em gaps reais: arquivos pendentes (logo em SVG?), decisoes nao tomadas (aprovacao da paleta?), informacoes estrategicas ausentes (orcamento para producao?)
- Se todas as informacoes necessarias foram fornecidas, retorne array vazio []

RETORNE ESTE JSON EXATO (todos os campos obrigatorios):
{
  "clientName": "Nome do cliente (use <br> e <em>palavra</em> se quiser destacar parte do nome em italico, ex: 'Credit<br>Saint-<em>Germain</em>')",
  "segment": "Segmento (ex: 'Fintech · Credito')",
  "city": "Cidade, Estado",
  "designerName": "Nome do designer",
  "edition": "Volume 01",
  "date": "data atual em pt-BR (ex: '24 de abril, 2026')",

  "tagline": "1 frase descritiva da marca pra capa (max 140 chars)",
  "positioning": "frase de posicionamento (sera mostrada como statement em destaque, com aspas e italico)",

  "mission": "missao em 1-2 frases praticas",
  "vision": "visao de 2-3 anos com meta concreta",
  "values": "valores principais",

  "personality": [
    {"word": "Palavra1", "italic": false, "meaning": "descricao curta de como se manifesta"},
    {"word": "Palavra2", "italic": true, "meaning": "descricao"},
    {"word": "Palavra3", "italic": false, "meaning": "descricao"}
  ],

  "primaryAudience": "publico primario em 2-3 linhas. Use <strong>palavras</strong> pra destacar idade/classe/perfil",
  "secondaryAudience": "publico B2B/secundario em 2-3 linhas (ou null se nao tiver)",

  "wantAssociations": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "avoidAssociations": ["evitar1", "evitar2", "evitar3", "evitar4"],

  "colors": [
    {"name": "Nome Cor", "italicPart": "palavra em italico (parte do nome)", "hex": "#XXXXXX", "role": "Primaria", "isLight": false, "usage": "uso recomendado em 1-2 frases (aparece no hover do swatch)"},
    {"name": "Nome Cor", "italicPart": "Aprovacao", "hex": "#XXXXXX", "role": "Secundaria", "isLight": false, "usage": "uso"},
    {"name": "Nome Cor", "italicPart": "Calma", "hex": "#XXXXXX", "role": "Neutra", "isLight": true, "usage": "uso"},
    {"name": "Nome Cor", "italicPart": "Texto", "hex": "#XXXXXX", "role": "Texto", "isLight": false, "usage": "uso"}
  ],

  "typography": [
    {"display": "Frase exemplo da marca usando essa fonte (com <em> opcional pra italico)", "family": "Fraunces", "weight": "Regular 400", "usage": "Headlines, titulos", "status": "Recomendada", "fontStack": "'Fraunces', serif"},
    {"display": "Outra frase exemplo", "family": "Inter", "weight": "Regular 400 / Medium 500", "usage": "Texto longo, UI", "status": "Recomendada", "fontStack": "'Inter', sans-serif"}
  ],

  "visualStyle": [
    {"adjective": "Adjetivo1", "description": "como aplicar na pratica"},
    {"adjective": "Adjetivo2", "description": "como aplicar"},
    {"adjective": "Adjetivo3", "description": "como aplicar"}
  ],

  "visualDontDo": ["restricao1", "restricao2", "restricao3", "restricao4", "restricao5"],

  "voicePersonaQuote": "1 frase resumindo a voz da marca (sera exibida como statement em italico)",
  "copyOnBrand": ["copy1 entre aspas", "copy2", "copy3", "copy4"],
  "copyOffBrand": ["copy1 entre aspas", "copy2", "copy3", "copy4"],
  "alwaysUseWords": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6"],
  "neverUseWords": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5", "palavra6"],

  "competitors": [
    {"name": "Nome", "handle": "@handle · cidade", "doWell": "o que fazem bem", "doBad": "o que fazem mal", "differentiation": "como nos diferenciamos"}
  ],

  "existingAssets": [
    {"name": "Nome do ativo", "details": "detalhes (formato, localizacao, status)"}
  ],

  "assetsToCreate": [
    {"name": "Nome do ativo", "priority": "alta", "details": "o que precisa ser criado e contexto"}
  ],

  "whatWorked": {"what": "frase entre aspas descrevendo o que funcionou", "why": "por que funcionou e como replicar"},
  "whatFailed": {"what": "frase entre aspas descrevendo o que falhou", "why": "por que falhou e o que aprender"},
  "strategicNote": "observacoes estrategicas (benchmarks, anti-benchmarks com motivo) ou null",

  "deliveries": [
    {"type": "Landing Page", "meta": "Prioridade Alta", "objective": "objetivo", "visualDirection": "direcao visual", "avoid": "o que evitar"},
    {"type": "Anuncios Meta Ads", "meta": "Volume Alto", "objective": "objetivo", "visualDirection": "direcao", "avoid": "evitar"},
    {"type": "Material B2B (Parceiros)", "meta": "Estrategico", "objective": "objetivo", "visualDirection": "direcao", "avoid": "evitar"}
  ],

  "immediateActions": ["acao1", "acao2", "acao3", "acao4", "acao5"],
  "operationalNote": "nota sobre pendencias operacionais (CRM, tracking, ferramentas) ou null",
  "pendingQuestions": ["pergunta1 ao cliente", "pergunta2", "pergunta3", "pergunta4"],

  "designerSummary": "sintese final em 1-2 frases com aspas (vai aparecer em destaque no fim do dossie)"
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
