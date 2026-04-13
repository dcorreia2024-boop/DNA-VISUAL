# Prompts - DNA Visual

## System Prompt: Gerador de Dossie
Localizado em: `backend/prompts/dossier-prompt.js` e `frontend/src/services/prompts.js`

Recebe respostas brutas do formulario e gera dossie profissional com 8 secoes:
1. Identidade da Marca
2. Diretrizes Visuais
3. Tom de Voz e Comunicacao
4. Referencias e Concorrentes
5. Materiais e Ativos
6. Historico e Aprendizados
7. Direcionamento por Tipo de Entrega
8. Checklist de Onboarding

## System Prompt: Analisador de Documentos
Localizado em: `backend/prompts/analyze-prompt.js`

Recebe texto extraido de documento e retorna JSON mapeando 31 campos como encontrado/faltando.

## Uso Manual (Copiar para o Claude)
O botao "Copiar para o Claude" no Output formata: system prompt + respostas do formulario. O designer cola no Claude.ai e recebe o dossie processado.
