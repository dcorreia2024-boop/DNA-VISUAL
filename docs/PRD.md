# PRD — DNA Visual

## Problema
Designers da V4 perdem 2-3h por cliente novo buscando informacoes basicas (logo, cores, tom de voz, referencias, publico). Tasks chegam no Ekyte sem briefing completo. Designers novos nao tem roteiro para primeiras reunioes. Na transicao de carteira o historico se perde e o proximo designer recomeca do zero. Cada designer inventa o processo.

## Solucao
Ferramenta de onboarding visual que coleta informacoes via formulario estruturado (24 campos em 7 secoes, 2 blocos) ou upload de documento existente, e gera um dossie completo de identidade visual. Funciona como roteiro para reunioes, base de conhecimento permanente e padronizacao do processo — a Biblia do Designer V4.

## Publico
Designers da V4 Ruston & Co. — Vertical de Design. Desde o designer junior na primeira reuniao ate o senior que precisa de agilidade.

## Fluxos
1. **Preencher ao Vivo (funcional):** 9 campos base + 15 perguntas conversacionais durante/apos reuniao → gera dossie
2. **Enviar Documento (estrutura pronta):** Upload DOCX/TXT → analise do conteudo → mostra encontrado vs faltando → gera dossie. Analise real via IA na proxima fase.
3. **Copiar para o Claude (ponte):** Formata respostas + prompt para o designer colar no Claude.ai enquanto API nao esta conectada.

## Estrutura do Formulario
- **Bloco 1 — Dados Base (9 inputs):** empresa, nicho, cidade, site, Instagram, redes, 3 concorrentes
- **Bloco 2 — Reuniao (15 textareas):** negocio/publico (3), personalidade (4), identidade visual (3), materiais/historico (3), tom de comunicacao (1), observacoes (1)
- Secoes 1-5 obrigatorias, 6-7 opcionais

## Modos de Operacao
- **Local (agora):** Sem API, sem banco. Output espelho + Copiar para o Claude
- **Com API (proximo):** Claude gera dossie automatizado + analise real de documentos
- **Completo (futuro):** + Supabase para persistencia de clientes e historico

## Metricas de Sucesso
- Reducao de 2-3h para 20-30min no onboarding visual
- Zero perda de informacao na troca de designers
- 100% dos clientes com dossie padronizado
- Designer novo produtivo desde a primeira reuniao
