# PLAYBOOK — DNA VISUAL

## 1. Nome do Projeto
**DNA Visual**

## 2. Vertical
**Design** — V4 Ruston & Co.

## 3. Gargalo Resolvido

O DNA Visual resolve um conjunto de problemas interligados que afetam a operacao de design da V4 de ponta a ponta:

**Falta de informacao no inicio dos projetos.** As tasks chegam no Ekyte sem briefing completo. O designer precisa parar o que esta fazendo, buscar no WhatsApp, perguntar pro account, pesquisar no Instagram do cliente, vasculhar e-mails — tudo antes de abrir o Figma. Isso consome de 2 a 3 horas por cliente novo.

**O designer novo nao sabe o que perguntar.** Um designer que acabou de entrar na unidade ou que vai participar das primeiras reunioes com clientes nao tem um roteiro. Mesmo designers experientes enfrentam dificuldade — cada cliente e um contexto novo, e sem um guia estruturado, perguntas essenciais ficam sem resposta. O DNA Visual funciona como esse roteiro: 24 perguntas organizadas que cobrem tudo que o designer precisa saber.

**O designer experiente tambem perde tempo.** Nao e so o iniciante que sofre. O designer senior tambem gasta horas coletando informacoes espalhadas. A diferenca e que ele sabe o que precisa, mas nao tem um processo centralizado pra buscar. O DNA Visual da essa agilidade: todas as informacoes num unico lugar, num formato padronizado.

**Transicao de carteira e recomeco do zero.** Quando um designer sai da unidade ou e movido pra outra equipe, o proximo assume a carteira sem contexto nenhum. Nao tem documento, nao tem historico, nao tem registro do que ja foi feito. O designer que assume perde dias tentando entender o cliente. Com o DNA Visual, existe um dossie completo — o novo designer abre, le, e ja sabe tudo. Nao perde horas nem dias. Se sente seguro pra comecar.

**Cada designer inventa o processo.** Sem padronizacao, cada designer coleta informacoes de um jeito. Um anota no bloco de notas, outro no WhatsApp, outro no Notion. Nada e transferivel, nada e pesquisavel, nada sobrevive a uma troca de maquina. O DNA Visual padroniza: mesma estrutura, mesmos campos, mesmo output pra todos.

**A visao de futuro: a Biblia do Designer V4.** O DNA Visual nao e so um formulario — e o inicio de uma base de conhecimento permanente. Cada cliente atendido gera um dossie que fica acessivel a qualquer designer da unidade, a qualquer momento. E a base que nunca se perde. A Biblia do Designer V4.

## 4. O que Faz

O DNA Visual e uma ferramenta de onboarding visual que coleta, organiza e transforma todas as informacoes de um cliente numa base completa de identidade visual.

O designer tem dois caminhos de entrada:
- **Preencher ao vivo** durante ou apos a reuniao com o cliente — 24 perguntas organizadas em 2 blocos (Dados Base + Reuniao)
- **Subir um documento existente** — formulario respondido, transcricao de call, dossie parcial, briefing do account

A ferramenta processa o que foi informado e gera um **dossie completo de identidade visual**: posicionamento, publico, paleta de cores, tipografia, tom de voz, referencias, concorrentes, materiais disponiveis, direcionamento por tipo de entrega e um checklist pratico do que o designer precisa antes de comecar.

**Com a integracao de IA (proxima fase):**
- A IA vai pesquisar dados publicos do cliente automaticamente (site, redes sociais, concorrentes) a partir do nome e nicho informados nos Dados Base
- O dossie sera gerado automaticamente pela IA — nao so organizando o que o designer informou, mas enriquecendo com dados pesquisados e insights estrategicos
- O designer podera subir transcricoes de calls e a IA vai extrair as informacoes relevantes automaticamente

**O resultado e um documento que serve como base pra qualquer entrega:** MIV, criativos de ads, carrossel, landing page, video, key visual. Qualquer designer que abrir o dossie tem tudo que precisa pra comecar a criar.

## 5. Como Funciona

### Fluxo 1 — Preencher ao Vivo (funcional agora)
1. O designer abre a ferramenta e preenche os **Dados Base** — 9 campos curtos: nome da empresa, nicho, cidade, site, Instagram, outras redes, 3 concorrentes
2. Durante ou apos a reuniao com o cliente, preenche as **15 perguntas conversacionais** organizadas em 5 blocos tematicos
3. A barra de progresso e os indicadores na sidebar mostram o que ja foi preenchido e o que falta
4. Clica em **"Gerar Dossie"** — a ferramenta valida, avisa se falta algo e gera o documento formatado
5. O designer pode **"Copiar Tudo"** (texto formatado) ou usar **"Copiar para o Claude"** que formata as respostas + prompt pra IA processar e gerar o dossie profissional completo

### Fluxo 2 — Enviar Documento (estrutura pronta, analise real via IA na proxima fase)
1. O designer arrasta um arquivo DOCX ou TXT — pode ser formulario respondido, briefing ou transcricao
2. A ferramenta mostra uma animacao de processamento e divide o conteudo em **"O que foi encontrado"** e **"O que esta faltando"**
3. O designer completa manualmente o que falta e gera o dossie

**Nota tecnica:** Atualmente a analise de documentos funciona por correspondencia de palavras-chave (busca local). A analise real via IA (Claude API) esta preparada no backend — quando a chave de API for configurada, a analise passa a ser feita pela IA automaticamente, sem nenhuma mudanca na interface.

### Modo "Copiar para o Claude" (ponte ate a API)
Enquanto a API do Claude nao esta conectada, o botao "Copiar para o Claude" no output formata todas as respostas do formulario junto com o system prompt profissional. O designer cola no Claude.ai e recebe o dossie processado pela IA. E a ponte funcional entre o modo local e o modo automatizado.

## 6. Stack

| Camada | Tecnologia | Funcao |
|--------|-----------|--------|
| Frontend | React 19 + Vite 8 | Interface da ferramenta (SPA) |
| Roteamento | React Router 7 | Navegacao entre as 6 telas |
| Estado | Context API + useReducer | Dados do formulario globais |
| Persistencia | localStorage | Auto-save dos dados |
| Backend | Express 5 | API preparada pra Claude e Supabase |
| IA (preparado) | Claude API (Anthropic) | Geracao do dossie e analise de documentos |
| Banco (futuro) | Supabase | Perfis de clientes e historico de dossies |

## 7. Prompt Principal

### Gerador de Dossie
A IA recebe todas as respostas do formulario e gera um dossie profissional com 8 secoes:

1. **Identidade da Marca** — posicionamento, missao/visao/valores, publico-alvo, proposta de valor
2. **Diretrizes Visuais** — paleta HEX, tipografia com hierarquia, estilo visual, o que NAO fazer
3. **Tom de Voz e Comunicacao** — 3 adjetivos, exemplos ON-BRAND vs OFF-BRAND, linguagem por canal
4. **Referencias e Concorrentes** — o que fazem bem, o que fazem mal, diferenciacao
5. **Materiais e Ativos** — o que tem, o que criar, links uteis
6. **Historico e Aprendizados** — o que funcionou, o que falhou, motivacao
7. **Direcionamento por Tipo de Entrega** — LP, Ads, Carrossel, Video, KV
8. **Checklist de Onboarding do Designer** — o que saber, perguntas pendentes, materiais a solicitar

Regras: linguagem pratica e acionavel, nao inventar informacoes, usar codigos HEX, diferenciar o que o cliente TEM do que PRECISA SER CRIADO.

### Analisador de Documentos
A IA recebe o texto extraido de um documento (briefing, transcricao de call, formulario respondido) e mapeia quais dos 24 campos estao presentes e quais faltam, retornando um JSON estruturado.

## 8. Input / Output

### Input
**Formulario (24 campos em 2 blocos):**
- Dados Base: nome da empresa, nicho, cidade, site, Instagram, outras redes, 3 concorrentes
- Reuniao: descricao do negocio, publico ideal, motivacao, personalidade, sentimento da marca, missao/valores, visao de futuro, identidade visual existente, estilo desejado, o que repudia, materiais disponiveis, materiais faltantes, historico de campanhas, tom de comunicacao, observacoes livres

**Upload de documento:** DOCX ou TXT (max. 10MB) — briefing, transcricao de call, formulario respondido

### Output
- Dossie formatado com todas as respostas organizadas por secao
- Texto copiavel (Copiar Tudo)
- Texto formatado com prompt pra Claude (Copiar para o Claude)
- Com API: dossie profissional gerado automaticamente pela IA

## 9. Tempo Economizado

| Metrica | Antes | Depois |
|---------|-------|--------|
| Onboarding de cliente novo | 2-3 horas buscando informacao | 20-30 min de reuniao + dossie na hora |
| Transicao de carteira | Recomeca do zero (horas/dias) | Abre o dossie e ja tem tudo (0 min) |
| Designer novo na primeira reuniao | Nao sabe o que perguntar | 24 perguntas prontas como roteiro |
| Informacao perdida | Frequente (designer sai, historico some) | Nunca (dossie salvo e padronizado) |
| Retrabalho por falta de briefing | 30-50% das entregas voltam | Reducao significativa |
| Padronizacao | Cada designer inventa o processo | Mesma estrutura pra todos |

**Impacto estimado:** economia de 8-12 horas por designer por mes.

## 10. Como Testar

```bash
cd dna-visual/frontend
npm install
npm run dev
# Abre http://localhost:5173
```

1. Clicar em "Iniciar Preenchimento"
2. Preencher nome do cliente + nome do designer
3. Preencher Dados Base (empresa, nicho)
4. Preencher pelo menos 1 campo de cada secao obrigatoria
5. Clicar "Gerar Dossie" — ver documento formatado
6. Testar "Copiar Tudo" e "Copiar para o Claude"
7. Testar "Voltar e Editar" — dados preservados
8. Testar "Novo Cliente" — limpa tudo
9. Testar upload com arquivo .txt
10. Fechar e reabrir — dados persistem (auto-save)

## 11. Responsavel
**Daniel Correia da Silva** — Designer, V4 Ruston & Co. (Uberlandia)

Facilitador: Mariano Dimas Arce — Coordenador da Vertical de Design

## 12. Repositorio
https://github.com/dcorreia2024-boop/DNA-VISUAL (branch: feature/design-dna-visual)

---

*DNA Visual — V4 Ruston & Co. — Vertical de Design*
*Playbook v1.0 — Abril 2026*
