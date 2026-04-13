const express = require('express');
const router = express.Router();
const { callClaude } = require('../services/claude');
const { ANALYZE_PROMPT } = require('../prompts/analyze-prompt');

router.post('/', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'content is required' });

  if (process.env.CLAUDE_API_KEY) {
    try {
      const result = await callClaude(content, ANALYZE_PROMPT);
      const parsed = JSON.parse(result);
      return res.json({ mode: 'api', analysis: parsed });
    } catch (err) {
      console.error('Claude API analysis error:', err.message);
    }
  }

  res.json({ mode: 'local', content });
});

module.exports = router;
