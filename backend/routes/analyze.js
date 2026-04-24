const express = require('express');
const router = express.Router();
const mammoth = require('mammoth');
// Importa direto do lib pra evitar o debug block do index.js
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const { callOpenRouter } = require('../services/openrouter');
const { ANALYZE_PROMPT } = require('../prompts/analyze-prompt');

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
  return buffer.toString('utf-8');
}

router.post('/', async (req, res) => {
  const { content, fileBase64, fileName, files } = req.body;
  let allText = '';

  try {
    if (Array.isArray(files) && files.length > 0) {
      for (const f of files) {
        if (!f || !f.base64 || !f.name) continue;
        const text = await extractTextFromFile(f.base64, f.name);
        allText += `\n\n--- DOCUMENTO: ${f.name} ---\n\n${text}`;
      }
      allText = allText.trim();
    } else if (fileBase64 && fileName) {
      allText = await extractTextFromFile(fileBase64, fileName);
    } else if (content) {
      allText = content;
    }
  } catch (err) {
    console.error('Erro ao extrair texto:', err.message);
    return res.json({ mode: 'fallback', error: `Nao foi possivel ler: ${err.message}`, content: '' });
  }

  if (!allText || !allText.trim()) return res.status(400).json({ error: 'Nenhum conteudo encontrado' });

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({ mode: 'local', content: allText });
  }

  // Trunca textos muito longos pegando INICIO + FIM
  let trimmed = allText;
  if (allText.length > 50000) {
    trimmed = allText.slice(0, 25000)
      + '\n\n[... PARTE CENTRAL OMITIDA ...]\n\n'
      + allText.slice(-25000);
  }

  try {
    const raw = await callOpenRouter(trimmed, ANALYZE_PROMPT);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({ mode: 'api', analysis: parsed, extractedText: allText });
      } catch {
        return res.json({ mode: 'fallback', error: 'JSON invalido', raw, content: allText });
      }
    }
    return res.json({ mode: 'fallback', raw, content: allText });
  } catch (err) {
    console.error('OpenRouter analysis error:', err.message);
    return res.json({ mode: 'fallback', error: err.message, content: allText });
  }
});

module.exports = router;
