const express = require('express');
const router = express.Router();
const { callClaude } = require('../services/claude');
const { DOSSIER_PROMPT } = require('../prompts/dossier-prompt');

router.post('/', async (req, res) => {
  const { formData } = req.body;
  if (!formData) return res.status(400).json({ error: 'formData is required' });

  if (process.env.CLAUDE_API_KEY) {
    try {
      const userMessage = Object.entries(formData)
        .filter(([_, v]) => v && v.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      const result = await callClaude(userMessage, DOSSIER_PROMPT);
      return res.json({ mode: 'api', dossier: result });
    } catch (err) {
      console.error('Claude API error:', err.message);
    }
  }

  // Fallback: return mirror of form data
  res.json({ mode: 'local', dossier: null, formData });
});

module.exports = router;
