require('dotenv').config();
const express = require('express');
const cors = require('cors');
const generateRoute = require('./routes/generate');
const analyzeRoute = require('./routes/analyze');
const clientsRoute = require('./routes/clients');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/generate', generateRoute);
app.use('/api/analyze', analyzeRoute);
app.use('/api/clients', clientsRoute);

app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: process.env.OPENROUTER_API_KEY ? 'api' : 'local' }));

app.listen(PORT, () => console.log(`DNA Visual backend running on port ${PORT}`));
