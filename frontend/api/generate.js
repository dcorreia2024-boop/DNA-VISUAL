// Vercel Serverless Function — geracao de dossie via OpenRouter
// Node 18+ tem fetch nativo, sem necessidade de node-fetch

const DOSSIER_PROMPT = `Voce e o assistente de onboarding visual da V4 Ruston & Co. Sua tarefa e receber as respostas brutas coletadas durante a reuniao com o cliente e transforma-las em um dossie profissional de identidade visual.

Voce vai receber dois tipos de dados:
1. DADOS BASE DO CLIENTE — informacoes objetivas (nome, nicho, site, redes, concorrentes) que voce deve usar para pesquisar contexto e complementar o dossie
2. RESPOSTAS DA REUNIAO — informacoes qualitativas coletadas pelo designer durante a reuniao com o cliente

Use AMBOS para gerar o dossie completo.

REGRAS:
- Linguagem pratica e acionavel — "foto de pessoa em consultorio, titulo X, botao Y" — nao "transmita autoridade"
- Organize as informacoes de forma que qualquer designer (do junior ao senior) consiga usar sem ajuda
- Se alguma informacao nao foi fornecida, indique claramente o que esta faltando e por que e importante
- Nao invente informacoes — se o cliente nao respondeu algo, diga que esta pendente
- Use codigos HEX quando mencionar cores
- Seja especifico em tipografia — nome da fonte, peso, uso recomendado
- Diferencie claramente o que o cliente TEM do que PRECISA SER CRIADO
- Formate a saida em Markdown com ## para secoes e ### para subsecoes

ESTRUTURA DO DOSSIE:

## 1. IDENTIDADE DA MARCA
- Posicionamento (1 frase que define a marca)
- Missao, Visao e Valores
- Publico-alvo (perfil detalhado: idade, genero, renda, comportamento, dores)
- Proposta de valor unica (o que diferencia dos concorrentes)

## 2. DIRETRIZES VISUAIS
- Paleta de cores — primaria, secundaria, neutra com codigos HEX e uso recomendado
- Tipografia — familia, hierarquia e uso (headline, body, destaque)
- Estilo visual geral — 3 adjetivos + descricao pratica
- Elementos graficos — padroes, texturas, formas recorrentes
- O que NAO fazer visualmente — restricoes claras

## 3. TOM DE VOZ E COMUNICACAO
- 3 adjetivos que definem a voz da marca
- Exemplos concretos de copy ON-BRAND vs OFF-BRAND
- Persona de comunicacao
- Linguagem por plataforma (Instagram, WhatsApp, LinkedIn, site)

## 4. REFERENCIAS E CONCORRENTES
Para cada concorrente: o que fazem bem, o que fazem mal, como este cliente se diferencia.

## 5. MATERIAIS E ATIVOS
- O que o cliente ja tem (logo, fotos, videos, manual)
- O que precisa ser criado do zero — priorizado

## 6. HISTORICO E APRENDIZADOS
- O que funcionou e por que
- O que nao funcionou
- Motivacao atual

## 7. DIRECIONAMENTO POR TIPO DE ENTREGA
Para cada tipo relevante (LP, Ads, Carrossel, Video, KV): objetivo, formato, direcionamento visual.

## 8. CHECKLIST DE ONBOARDING DO DESIGNER
- Lista pratica do que saber antes de criar
- Perguntas pendentes
- Materiais a solicitar
- O que pode comecar imediatamente`;

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
      temperature: 0.7,
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

  const { formData } = req.body || {};
  if (!formData) {
    return res.status(400).json({ error: 'formData is required' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(200).json({ mode: 'local' });
  }

  try {
    const userContent = formatFormDataForAI(formData);
    const dossie = await callOpenRouter(userContent, DOSSIER_PROMPT);
    return res.status(200).json({ mode: 'api', dossie });
  } catch (err) {
    console.error('OpenRouter error:', err.message);
    return res.status(200).json({ mode: 'fallback', error: err.message });
  }
}
