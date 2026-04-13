# Arquitetura - DNA Visual

## Visao Geral
SPA React (Vite) + API Express. Funciona em 3 modos: local, com API, completo.

## Frontend
- React 18 + Vite + React Router DOM
- Estado global via Context + useReducer
- Persistencia: localStorage (key: `dna_visual_v4`)
- 6 telas: Home, Form, Output, Upload, Loading, Result

## Backend
- Express.js com 3 rotas: /api/generate, /api/analyze, /api/clients
- Wrapper para Claude API (preparado)
- Placeholder para Supabase (futuro)

## Fluxo de Dados
```
[Formulario] → formData (Context) → [Output] → texto formatado
[Upload] → FileReader → sessionStorage → [Loading] → simAnalysis → [Result]
```

## Modos
| Modo | CLAUDE_API_KEY | SUPABASE_URL | Comportamento |
|------|---------------|--------------|---------------|
| Local | - | - | Output espelho + Copiar para o Claude |
| API | ✓ | - | Dossie gerado por IA |
| Completo | ✓ | ✓ | + Persistencia de clientes |
