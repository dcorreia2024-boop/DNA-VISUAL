const express = require('express');
const router = express.Router();
const mammoth = require('mammoth');
const { callOpenRouter } = require('../services/openrouter');
const { ANALYZE_PROMPT } = require('../prompts/analyze-prompt');

async function extractTextFromFile(fileBase64, fileName) {
  const buffer = Buffer.from(fileBase64, 'base64');
  const ext = (fileName || '').toLowerCase().split('.').pop();

  if (ext === 'docx' || ext === 'doc') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  return buffer.toString('utf-8');
}

router.post('/', async (req, res) => {
  const { content, fileBase64, fileName } = req.body;
  let text = content;

  if (fileBase64 && fileName) {
    try {
      text = await extractTextFromFile(fileBase64, fileName);
    } catch (err) {
      console.error('Erro ao extrair texto:', err.message);
      return res.json({ mode: 'fallback', error: `Nao foi possivel ler: ${err.message}`, content: '' });
    }
  }

  if (!text) return res.status(400).json({ error: 'content ou fileBase64 obrigatorio' });

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({ mode: 'local', content: text });
  }

  const trimmed = text.length > 40000 ? text.slice(0, 40000) + '\n\n[... documento truncado ...]' : text;

  try {
    const raw = await callOpenRouter(trimmed, ANALYZE_PROMPT);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({ mode: 'api', analysis: parsed, extractedText: text });
      } catch (parseErr) {
        return res.json({ mode: 'fallback', error: 'JSON invalido da IA', raw, content: text });
      }
    }
    return res.json({ mode: 'fallback', raw, content: text });
  } catch (err) {
    console.error('OpenRouter analysis error:', err.message);
    return res.json({ mode: 'fallback', error: err.message, content: text });
  }
});

module.exports = router;
