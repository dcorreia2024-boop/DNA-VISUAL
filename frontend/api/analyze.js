// Vercel Serverless — analise de documentos via OpenRouter
// Suporta multiplos arquivos (TXT/DOCX/PDF) em array base64

import mammoth from 'mammoth';
// Importa direto do lib pra evitar o debug block do index.js que le um PDF
// de teste ao boot (quebra em serverless)
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const ANALYZE_PROMPT = `Voce e um analista de onboarding visual altamente experiente da V4 Ruston & Co. Sua tarefa e ler documentos de clientes — que podem ser transcricoes brutas de calls, briefings, anotacoes ou documentos formais — e EXTRAIR todas as informacoes relevantes para montar o dossie de identidade visual.

CONTEXTO IMPORTANTE:
- O documento pode ser uma TRANSCRICAO DE CALL. Transcricoes sao BAGUNCADAS: tem erros de transcricao automatica, interrupcoes, conversas paralelas, piadas, silencios, gente falando por cima, tangentes que voltam ao assunto minutos depois.
- A informacao NAO esta organizada por secoes. Uma resposta sobre publico-alvo pode aparecer no meio de uma conversa sobre concorrentes. Uma cor mencionada pode estar numa frase sobre o logo, 20 minutos antes de falar de estilo visual.
- NUNCA presuma que informacao nao existe so porque nao esta numa secao obvia. VASCULHE o documento inteiro. RELEIA mentalmente. CONECTE informacoes espalhadas.
- Preste atencao especial em quem esta falando. O CLIENTE e quem da as respostas. O designer/gestor e quem pergunta. Identifique os nomes e papeis.

COMO ANALISAR:

1. LEIA O DOCUMENTO INTEIRO antes de comecar a extrair. Entenda o contexto geral: quem e o cliente, o que faz, o que quer.

2. Para CADA campo abaixo, vasculhe o documento inteiro procurando:
   - Mencoes diretas ("nosso nicho e saude")
   - Mencoes indiretas ("a gente financia procedimentos esteticos" -> nicho: fintech de saude/estetica)
   - Informacoes implicitas ("atendemos em 235 cidades" -> atuacao nacional)
   - Informacoes fragmentadas (o cliente fala metade agora, complementa 10 minutos depois)
   - Informacoes ditas por OUTROS participantes sobre o cliente (agencia atual, equipe, etc)

3. COMBINE informacoes espalhadas. Se em um momento o cliente diz "nosso publico e mulher" e 15 minutos depois diz "35 a 55 anos, classe B e C", JUNTE tudo no campo de publico-alvo.

4. INTERPRETE erros de transcricao. "Acredite Saint-Germa" provavelmente e "Credit Saint-Germain". "Only Funs" e "OnlyFans". "rap vida" e "Hapvida". Use contexto pra corrigir.

5. DIFERENCIE entre o que o cliente TEM e o que ele QUER. "Nosso azul escuro atual" e identidade existente. "Quero algo mais popular" e estilo desejado.

6. Se uma informacao NAO existe no documento, marque found: false. NAO invente. Mas antes de marcar false, releia mentalmente se nao esta escondida em alguma fala tangencial.

CAMPOS A EXTRAIR:

DADOS BASE:
- clientCompany: Nome da empresa ou marca. Considere nome formal E como e chamada informalmente.
- clientNiche: Nicho ou segmento. Nao copie literal — sintetize (ex: "financeira que faz credito para saude e pessoal" -> "Fintech — credito pessoal e saude")
- clientCity: Cidade e estado. Pode estar implicito ("nosso hospital fica em..." ou "clientes de 235 cidades mas somos uma marca local")
- clientWebsite: Site/URL. So se for mencionado explicitamente.
- clientInstagram: Instagram (@). So se mencionado.
- clientOtherSocial: Outras redes. Inclua TODAS que forem mencionadas (Meta Ads, LinkedIn, YouTube, TikTok, etc).
  ATENCAO — diferencie canais USADOS ATIVAMENTE de contas que apenas EXISTEM. Se alguem diz "Google Ads nao foi utilizado" ou "temos conta mas nao usamos", NAO liste como ativo.
  Formato com status: "Instagram (ativo), Facebook (ativo), LinkedIn (pouco uso), Google Ads (nao utilizado)"
- competitor1/2/3: Concorrentes — nome + contexto. Se mencionaram varios, pegue os 3 mais relevantes.

REUNIAO — O NEGOCIO E O PUBLICO:
- businessDescription: O que a empresa faz, pra quem, qual problema resolve. SINTETIZE de tudo que foi dito. Inclua modelo (B2B, B2C, ambos), como funciona, diferencial.
- idealClient: Cliente ideal. JUNTE todas as mencoes de publico: idade, genero, classe, renda, comportamento, localizacao, dores.
  Se o cliente tem MAIS DE UM publico-alvo (B2C + B2B), LISTE AMBOS. Formato: "Publico B2C: [descricao]. Publico B2B: [descricao]."
- motivation: O que motivou buscar esse trabalho. Pode ser multiplos motivos em momentos diferentes.

REUNIAO — PERSONALIDADE DA MARCA:
- brandPersonality: Personalidade em 3 palavras + como fala. Pode estar em respostas diretas OU em como o cliente descreve o tom ("rapido, facil, sem burocracia" = personalidade)
- brandFeeling: O que quer transmitir + o que NAO quer ser associado. SEPARE claramente. Inclua exemplos negativos ("nao quero parecer Hapvida")
  Preste atencao quando alguem TRADUZ/CONFIRMA um conceito. Se o designer diz "podemos posicionar como autoridade?" e o cliente responde "exatamente, traduziu perfeitamente" — "autoridade" e KEYWORD DE POSICIONAMENTO. Capture no final como: "Palavra-chave confirmada: [termo]"
- missionValues: Missao, visao, valores, slogan. Pode nao ter sido perguntado — o cliente pode ter dito indiretamente ("nosso objetivo e..." "eu acredito que...")
- futureVision: Onde quer estar em 2-3 anos. Qualquer mencao de crescimento, expansao, metas futuras.

REUNIAO — IDENTIDADE VISUAL E ESTILO:
- existingIdentity: O que ja tem — logo (formatos), cores (HEX ou descricao "azul escuro"), fontes, manual, estado atual ("desatualizado", "inconsistente").
- visualStyle: Estilo desejado. Inclua referencias visuais, adjetivos usados, preferencias. Se a agencia atual opinou, inclua.
- visualHate: O que detesta VISUALMENTE. Diferencie de "o que nao quer ser associado" (personalidade). Aqui e estetica pura.

REUNIAO — MATERIAIS E HISTORICO:
- existingMaterials: O que ja tem. VASCULHE: fotos, videos, drive, manual, material impresso, TVs, outdoor, PDVs, provas sociais, cases. Inclua ONDE estao.
- missingMaterials: APENAS MATERIAIS VISUAIS E DE DESIGN que precisam ser criados — logo, manual de marca, templates, videos, fotos, apresentacoes, cartao de visita. NAO inclua necessidades operacionais (CRM, ferramentas de gestao, processos). Se o cliente menciona CRM, vai em freeNotes como nota operacional, NAO aqui.
- pastResults: Campanhas/materiais que funcionaram + falharam. Inclua CONTEXTO.
  Preste atencao em QUALQUER mencao de conteudo que performou ("teve um video que explodiu", "os reels foram bem"). Capture MESMO SE dito por outra pessoa (agencia, equipe). Inclua provas sociais (videos de clientes, depoimentos). Se falaram que trabalho anterior "nao tinha nada a ver" — e resultado que FALHOU.
  Formato: "Funcionou: [o que, por que]. Falhou: [o que, por que]. Provas sociais: [listar]."

REUNIAO — TOM DE COMUNICACAO:
- voiceTone: Como a marca se comunica. Va ALEM de "formal/informal". Capture NUANCES:
  - Se publico "nao tem educacao financeira" -> comunicacao CLARA e SIMPLES, sem jargao
  - Se cliente enfatiza transparencia -> "sem pegadinhas", "sem letras miudas" e diretriz
  - Capture como o cliente fala naturalmente (tom dele = tom da marca)
  - Diferencie tom por canal se mencionado (WhatsApp vs Instagram vs site)
  Formato: "Tom geral: [descricao]. Diretriz principal: [ex: clareza absoluta]. Palavras-chave: [termos naturais do cliente]."

REUNIAO — OBSERVACOES LIVRES:
- freeNotes: TUDO que e importante e nao se encaixa nos campos acima.
  OBRIGATORIO capturar dados operacionais e financeiros mesmo que nao parecam "de design" — o designer precisa de contexto. Inclua se mencionados:
  - Faturamento atual e meta
  - Ticket medio, margem de lucro
  - Tamanho da equipe comercial
  - Ferramentas usadas (WhatsApp, CRM, etc)
  - Benchmarks aspiracionais (empresas admiradas e POR QUE)
  - Anti-benchmarks (que NAO quer parecer e POR QUE)
  - Dinamica interna (board, socios, agencia atual, quem aprova)
  - Restricoes ou prazos
  Formato: topicos curtos, um por linha.

FORMATO DE RESPOSTA:
Responda APENAS com JSON valido. Sem texto antes, sem texto depois, sem backticks de markdown.

{
  "clientCompany": { "found": true, "content": "..." },
  "clientNiche": { "found": true, "content": "..." },
  "clientCity": { "found": true, "content": "..." },
  "clientWebsite": { "found": false, "content": "" },
  "clientInstagram": { "found": false, "content": "" },
  "clientOtherSocial": { "found": true, "content": "..." },
  "competitor1": { "found": true, "content": "..." },
  "competitor2": { "found": true, "content": "..." },
  "competitor3": { "found": false, "content": "" },
  "businessDescription": { "found": true, "content": "..." },
  "idealClient": { "found": true, "content": "..." },
  "motivation": { "found": true, "content": "..." },
  "brandPersonality": { "found": true, "content": "..." },
  "brandFeeling": { "found": true, "content": "..." },
  "missionValues": { "found": false, "content": "" },
  "futureVision": { "found": true, "content": "..." },
  "existingIdentity": { "found": true, "content": "..." },
  "visualStyle": { "found": true, "content": "..." },
  "visualHate": { "found": true, "content": "..." },
  "existingMaterials": { "found": true, "content": "..." },
  "missingMaterials": { "found": true, "content": "..." },
  "pastResults": { "found": false, "content": "" },
  "voiceTone": { "found": true, "content": "..." },
  "freeNotes": { "found": true, "content": "..." }
}

REGRAS FINAIS:
- O campo "content" deve ser um RESUMO SINTETIZADO, nao copiar e colar trechos da transcricao
- Se a informacao esta fragmentada, JUNTE e escreva uma sintese coerente
- Se a transcricao tem erros (nomes cortados, frases incompletas), INTERPRETE pelo contexto
- Seja GENEROSO no found:true — se ha qualquer indicacao parcial, marque como encontrado
- O campo freeNotes e o seu coringa — coloque TUDO que e valioso e nao coube nos outros
- Priorize QUALIDADE da sintese sobre QUANTIDADE de texto. Seja conciso mas completo.`;

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
      max_tokens: 6000
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
    const result = await pdfParse(buffer);
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

  // Trunca textos muito longos pegando INICIO + FIM (mais relevante em transcricoes:
  // abertura com apresentacao e encerramento com resumo; miolo tem mais tangentes)
  let trimmed = allText;
  if (allText.length > 50000) {
    trimmed = allText.slice(0, 25000)
      + '\n\n[... PARTE CENTRAL DO DOCUMENTO OMITIDA PARA CABER NO LIMITE ...]\n\n'
      + allText.slice(-25000);
  }

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
