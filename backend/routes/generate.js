const express = require('express');
const router = express.Router();
const { callOpenRouter } = require('../services/openrouter');
const { DOSSIER_PROMPT } = require('../prompts/dossier-prompt');

const BASE_KEYS = new Set([
  'clientCompany', 'clientNiche', 'clientCity', 'clientWebsite',
  'clientInstagram', 'clientOtherSocial', 'competitor1', 'competitor2', 'competitor3',
  'clientName', 'designerName'
]);

function formatFormDataForAI(formData) {
  let text = '=== DADOS BASE DO CLIENTE ===\n\n';
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
      text += `**${key}**\n${String(value).trim()}\n\n`;
    }
  });

  return text;
}

function parseDossierJson(raw) {
  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
  }
  return null;
}

router.post('/', async (req, res) => {
  const { formData } = req.body;
  if (!formData) return res.status(400).json({ error: 'formData is required' });

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({ mode: 'local' });
  }

  try {
    const userContent = formatFormDataForAI(formData);
    const raw = await callOpenRouter(userContent, DOSSIER_PROMPT);
    const json = parseDossierJson(raw);

    if (json) return res.json({ mode: 'api', format: 'json', dossie: json });
    return res.json({ mode: 'api', format: 'text', dossie: raw });
  } catch (err) {
    console.error('OpenRouter error:', err.message);
    return res.json({ mode: 'fallback', error: err.message });
  }
});

module.exports = router;
