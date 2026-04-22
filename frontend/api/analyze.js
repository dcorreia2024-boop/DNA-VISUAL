// Vercel Serverless — analise de documentos via OpenRouter
// Suporta multiplos arquivos (TXT/DOCX/PDF) em array base64

import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

const ANALYZE_PROMPT = `Voce e o assistente de onboarding visual da V4 Ruston & Co. Analise o conteudo dos documentos enviados e identifique quais informacoes do formulario de onboarding estao presentes e quais estao faltando.

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
- So marque found:true se o(s) documento(s) contem informacao relevante
- Extraia o trecho mais relevante como content
- Se multiplos documentos mencionam o mesmo campo, consolide
- Nao invente — use apenas o que esta nos documentos
- SEMPRE retorne TODOS os campos listados acima
- Responda APENAS com JSON valido`;

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

async function extractTextFromFile(fileBase64, fileName) {
  const buffer = Buffer.from(fileBase64, 'base64');
  const ext = (fileName || '').toLowerCase().split('.').pop();

  if (ext === 'pdf') {
    // pdf-parse v2 API: new PDFParse({ data }).getText()
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  }
  if (ext === 'docx' || ext === 'doc') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  // TXT (default)
  return buffer.toString('utf-8');
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, fileBase64, fileName, files } = req.body || {};

  let allText = '';

  try {
    // Novo formato: array de arquivos
    if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (!f || !f.base64 || !f.name) continue;
        const text = await extractTextFromFile(f.base64, f.name);
        allText += `\n\n--- DOCUMENTO: ${f.name} ---\n\n${text}`;
      }
      allText = allText.trim();
    }
    // Formato antigo: arquivo unico
    else if (fileBase64 && fileName) {
      allText = await extractTextFromFile(fileBase64, fileName);
    }
    // Fallback: texto direto
    else if (content) {
      allText = content;
    }
  } catch (err) {
    console.error('Erro ao extrair texto:', err.message);
    return res.status(200).json({
      mode: 'fallback',
      error: `Nao foi possivel ler o(s) arquivo(s): ${err.message}`,
      content: ''
    });
  }

  if (!allText || !allText.trim()) {
    return res.status(400).json({ error: 'Nenhum conteudo encontrado nos arquivos' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(200).json({ mode: 'local', content: allText });
  }

  const trimmed = allText.length > 40000
    ? allText.slice(0, 40000) + '\n\n[... documento(s) truncado(s) ...]'
    : allText;

  try {
    const raw = await callOpenRouter(trimmed, ANALYZE_PROMPT);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ mode: 'api', analysis: parsed, extractedText: allText });
      } catch (parseErr) {
        return res.status(200).json({ mode: 'fallback', error: 'JSON invalido da IA', raw, content: allText });
      }
    }
    return res.status(200).json({ mode: 'fallback', raw, content: allText });
  } catch (err) {
    console.error('OpenRouter analyze error:', err.message);
    return res.status(200).json({ mode: 'fallback', error: err.message, content: allText });
  }
}
