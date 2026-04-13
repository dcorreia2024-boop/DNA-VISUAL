const express = require('express');
const router = express.Router();

// Future: CRUD operations for clients and dossiers via Supabase
// Will be implemented when SUPABASE_URL is configured

router.get('/', (req, res) => {
  res.json({ message: 'Clients API - Supabase integration pending', clients: [] });
});

module.exports = router;
