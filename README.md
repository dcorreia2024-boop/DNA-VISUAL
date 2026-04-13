# DNA Visual - V4 Ruston & Co.

Ferramenta de onboarding visual para designers. Coleta informacoes do cliente e gera dossies de identidade visual.

## Inicio Rapido

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (opcional)
cd backend
npm install
node server.js
```

## Modos de Operacao

1. **Local (sem API):** Formulario funciona, output espelha respostas, botao "Copiar para o Claude" para processamento manual
2. **Com API:** Configure `CLAUDE_API_KEY` no `.env` para gerar dossies via IA
3. **Completo:** Configure `SUPABASE_URL` para persistencia de clientes e dossies

## Stack

- Frontend: React 18 + Vite + React Router DOM
- Backend: Express.js
- IA: Claude API (Anthropic)
- Banco: Supabase (futuro)
