const express = require('express');
const router = express.Router();
const { callOpenRouter } = require('../services/openrouter');
const { ANALYZE_PROMPT } = require('../prompts/analyze-prompt');

router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });

  if (!process.env.OPENROUTER_API_KEY) {
    return res.json({ mode: 'local', content });
  }

  try {
    const result = await callOpenRouter(content, ANALYZE_PROMPT);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json({ mode: 'api', analysis: parsed });
    }
    return res.json({ mode: 'fallback', raw: result, content });
  } catch (err) {
    console.error('OpenRouter analysis error:', err.message);
    return res.json({ mode: 'fallback', error: err.message, content });
  }
});

module.exports = router;
