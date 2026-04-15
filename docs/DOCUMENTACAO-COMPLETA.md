# DNA VISUAL: DOCUMENTACAO COMPLETA
**V4 Ruston & Co. - Vertical de Design**
*Atualizado em: Abril de 2026*

---

## SUMARIO
1. [Visao Geral](#visao-geral)
2. [Historico de Desenvolvimento](#historico-de-desenvolvimento)
3. [O Problema](#o-problema)
4. [A Solucao](#a-solucao)
5. [Arquitetura Tecnica](#arquitetura-tecnica)
6. [Estrutura do Formulario](#estrutura-do-formulario)
7. [As 24 Perguntas](#as-24-perguntas)
8. [Telas e Fluxos](#telas-e-fluxos)
9. [Input e Output](#input-e-output)
10. [Funcionalidades](#funcionalidades)
11. [Modos de Operacao](#modos-de-operacao)
12. [Stack Tecnologica](#stack-tecnologica)
13. [Estrutura de Pastas](#estrutura-de-pastas)
14. [Deploy e Acessos](#deploy-e-acessos)
15. [Proximos Passos](#proximos-passos)

---

## VISAO GERAL

O **DNA Visual** e uma ferramenta de onboarding visual para designers da V4 Ruston & Co. Ela resolve tres problemas em uma so solucao:

1. **Coleta estruturada** das informacoes do cliente via formulario de 24 perguntas
2. **Analise automatizada** de documentos existentes (briefings, transcricoes de call)
3. **Geracao de dossie** completo de identidade visual, pronto para uso

A visao de longo prazo e se tornar a **Biblia do Designer V4**: uma base de conhecimento permanente onde qualquer designer pode acessar o historico completo de qualquer cliente.

---

## HISTORICO DE DESENVOLVIMENTO

### Versao 1 - HTML Standalone
- Arquivo unico `dna-visual.html` com tudo inline (CSS + JS)
- 8 secoes, 31 campos, todos textarea
- Funcional mas sem estrutura escalavel

### Versao 2 - Migracao para React
- Projeto reorganizado em `dna-visual/` com frontend + backend
- React 19 + Vite 8 + React Router 7
- Backend Express 5 preparado para Claude API e Supabase
- Mesma identidade visual do HTML original
- Playbook, PRD e docs criados

### Versao 3 - Refinamento do Formulario
- Reestruturado para **7 secoes, 24 campos, 2 blocos**
- Bloco 1 (Dados Base): 9 campos `<input>` curtos para dados que a IA pode pesquisar
- Bloco 2 (Reuniao com o Cliente): 15 `<textarea>` conversacionais
- Indicadores de 3 estados (vazio, parcial, completo)
- Validacao inteligente (campos obrigatorios + avisos de secoes parciais)
- Botao "Novo Cliente" com confirmacao
- Navegacao mobile com barra horizontal

### Versao 4 - Correcoes Finais (13 ajustes)
- Navbar limpa (sem "Como Funciona", apenas "Comecar")
- Remocao das secoes Features e "Como Funciona" do hero
- Botao "Copiar para o Claude" com estilo outline vermelho
- Upload restrito a DOCX e TXT (removido PDF/imagens)
- Workaround para DOCX lido como texto
- Botao "Cancelar" na tela de Loading
- Campo "Nome do Cliente" na tela de Resultado
- Botao "HOME" no header do Resultado
- Prompts atualizados com as 24 novas keys

### Versao 5 - Deploy e Documentacao
- Repositorio no GitHub (github.com/dcorreia2024-boop/DNA-VISUAL)
- Deploy no Vercel (dna-visual.vercel.app)
- vercel.json com rewrites para SPA routing
- Playbook v1.0 completo

---

## O PROBLEMA

O designer da V4 perde de 2 a 3 horas por cliente novo buscando informacoes que deveriam estar prontas antes da task chegar. Logo, cores, tom de voz, referencias, publico, materiais, tudo espalhado entre WhatsApp, e-mail, Drive e a cabeca do account.

**Designers novos:** nao tem um roteiro do que perguntar na primeira reuniao com o cliente. Cada um descobre do jeito dificil.

**Designers experientes:** sabem o que precisam mas nao tem onde centralizar as informacoes.

**Transicao de carteira:** quando um designer sai ou muda de equipe, o proximo assume do zero. Sem historico, sem contexto, sem registro do que ja foi feito.

**Falta de padronizacao:** cada designer coleta informacoes de um jeito diferente. Nada transferivel, nada pesquisavel, nada sobrevive a uma troca de maquina.

**Consequencias praticas:**
- 30 a 50% das entregas voltam por falta de briefing adequado
- Retrabalho constante, entregas fora da expectativa
- Designer novo leva semanas para se tornar produtivo
- Informacao perdida a cada troca de designer na carteira

---

## A SOLUCAO

### Formulario Estruturado
24 perguntas organizadas em 2 blocos que servem de **roteiro universal** para qualquer designer (do junior ao senior). Desde a primeira reuniao, o designer sabe exatamente o que perguntar.

### Dois Caminhos de Entrada
1. **Preencher ao Vivo:** durante ou apos a reuniao com o cliente
2. **Enviar Documento:** upload de briefing existente, transcricao de call ou formulario respondido

### Dossie Padronizado
Todas as respostas organizadas em um documento profissional que qualquer outro designer consegue abrir, ler e usar como base. Mesma estrutura para todos os clientes.

### Base de Conhecimento Permanente
Com a integracao do Supabase (futuro), cada dossie fica salvo e acessivel a qualquer designer da unidade, a qualquer momento. O historico nunca se perde.

---

## ARQUITETURA TECNICA

```
dna-visual/
├── frontend/          # React SPA (Vite)
│   ├── src/
│   │   ├── pages/     # 6 telas (Home, Form, Output, Upload, Loading, Result)
│   │   ├── context/   # FormContext (estado global)
│   │   ├── hooks/     # useAutoResize
│   │   ├── services/  # clipboard, analyzer, prompts
│   │   ├── data/      # sections.js (as 24 perguntas)
│   │   └── styles/    # global.css
│   └── vercel.json    # SPA routing
├── backend/           # Express API (preparado)
│   ├── routes/        # generate, analyze, clients
│   ├── services/      # claude, fileParser
│   └── prompts/       # dossier-prompt, analyze-prompt
└── docs/              # Documentacao
```

### Fluxo de Dados
```
Usuario preenche formulario
   ↓
FormContext (useReducer) atualiza estado
   ↓
Auto-save no localStorage (debounce 300ms)
   ↓
Toast "Salvo automaticamente" aparece
   ↓
Usuario clica "Gerar Dossie"
   ↓
Validacao (nome cliente + campos obrigatorios)
   ↓
Navega para Output page
   ↓
Renderiza dossie dinamicamente a partir de SECTIONS
   ↓
Copiar Tudo OU Copiar para o Claude
```

---

## ESTRUTURA DO FORMULARIO

### Bloco 1: DADOS BASE (9 campos input curtos)
Dados que a IA pode pesquisar automaticamente quando a API estiver conectada. Hoje preenchidos manualmente.

### Bloco 2: REUNIAO COM O CLIENTE (15 textareas conversacionais)
Perguntas abertas organizadas em 6 secoes tematicas:
- O Negocio e o Publico
- Personalidade da Marca
- Identidade Visual e Estilo
- Materiais e Historico
- Tom de Comunicacao
- Observacoes Livres

### Obrigatoriedade
- **Secoes 1-5:** obrigatorias (avisa se faltar)
- **Secoes 6-7:** opcionais
- **Campo `clientCompany`:** obrigatorio no Bloco 1
- **Validacao de partial:** avisa se secao obrigatoria tem campos vazios

---

## AS 24 PERGUNTAS

### BLOCO 1: DADOS BASE

**Secao 1: Dados Base do Cliente** (9 campos)

| Key | Pergunta |
|-----|----------|
| `clientCompany` | Nome da empresa ou marca |
| `clientNiche` | Nicho ou segmento de atuacao (ex: saude, moda, educacao, food service, tecnologia) |
| `clientCity` | Cidade e estado de atuacao |
| `clientWebsite` | Site do cliente (URL) |
| `clientInstagram` | Instagram do cliente (@) |
| `clientOtherSocial` | Outras redes sociais (Facebook, LinkedIn, TikTok, YouTube) |
| `competitor1` | Concorrente 1: nome + Instagram ou site |
| `competitor2` | Concorrente 2: nome + Instagram ou site |
| `competitor3` | Concorrente 3: nome + Instagram ou site |

### BLOCO 2: REUNIAO COM O CLIENTE

**Secao 2: O Negocio e o Publico** (3 campos)

| Key | Pergunta |
|-----|----------|
| `businessDescription` | Me explica o que a empresa faz, pra quem vende e qual problema resolve, como se estivesse explicando pra alguem que nunca ouviu falar da marca. |
| `idealClient` | Quem e o cliente ideal? Descreve a pessoa: idade, perfil, renda, onde mora, o que valoriza na hora de comprar. |
| `motivation` | O que motivou o cliente a buscar esse trabalho agora? (insatisfacao, rebranding, lancamento, crescimento, troca de agencia) |

**Secao 3: Personalidade da Marca** (4 campos)

| Key | Pergunta |
|-----|----------|
| `brandPersonality` | Se a marca fosse uma pessoa, quais 3 palavras definiriam a personalidade dela? Como ela fala: formal, descontraida, tecnica, divertida? |
| `brandFeeling` | O que o cliente quer que as pessoas SINTAM ao ver a marca? E o que ele NAO quer ser associado de jeito nenhum? |
| `missionValues` | O cliente tem missao, visao, valores ou slogan definidos? Quais sao? |
| `futureVision` | Onde a empresa quer estar em 2-3 anos? Qual a ambicao? |

**Secao 4: Identidade Visual e Estilo** (3 campos)

| Key | Pergunta |
|-----|----------|
| `existingIdentity` | O que o cliente ja tem de identidade visual: logo, cores (HEX se tiver), fontes, manual de marca? Onde estao os arquivos? |
| `visualStyle` | Qual estilo visual o cliente quer: minimalista, vibrante, premium, popular, moderno, classico? Tem alguma marca de qualquer segmento que admira visualmente? |
| `visualHate` | O que o cliente detesta visualmente? O que NAO pode aparecer nos materiais de jeito nenhum? |

**Secao 5: Materiais e Historico** (3 campos)

| Key | Pergunta |
|-----|----------|
| `existingMaterials` | Que fotos e videos o cliente ja tem? (produto, equipe, espaco, bastidores, depoimentos) Onde estao os arquivos? |
| `missingMaterials` | O que o cliente NAO tem e vai precisar ser criado do zero? (fotos, videos, logo, manual, templates) |
| `pastResults` | Alguma campanha ou material anterior funcionou muito bem? O que funcionou e por que? E algum que foi um desastre? |

**Secao 6: Tom de Comunicacao** (1 campo, opcional)

| Key | Pergunta |
|-----|----------|
| `voiceTone` | A marca se comunica formal ou informal? Pode usar humor, girias, emojis? Tem palavras ou expressoes que sempre usa ou que nunca deve usar? |

**Secao 7: Observacoes Livres** (1 campo, opcional)

| Key | Pergunta |
|-----|----------|
| `freeNotes` | Tem alguma coisa importante sobre esse cliente que nao foi perguntada acima? Pode ser uma dor, um contexto, uma particularidade. Anote tudo. |

### Campos Globais (fora das secoes)

| Key | Pergunta |
|-----|----------|
| `clientName` | Nome do cliente (identificacao principal) |
| `designerName` | Nome do designer responsavel |

**Total: 24 campos + 2 globais = 26 campos para 100% de preenchimento**

---

## TELAS E FLUXOS

### Tela 1: HOME
**Rota:** `/`

- Navbar fixa com logo V4 + botao "Comecar"
- Hero com glow vermelho, grain noise, linhas diagonais
- Badge "FERRAMENTA DE IDENTIDADE VISUAL"
- Titulo gigante "DNA Visual" (branco + vermelho)
- Subtitulo explicativo
- 2 action cards:
  - **Preencher ao Vivo** (botao vermelho): leva ao formulario
  - **Enviar Documento** (botao outline): leva ao upload
- Barra de metricas: "0 min" / "8 secoes" / "1 clique"
- Footer com info da V4

### Tela 2: FORMULARIO
**Rota:** `/form`

- **Sidebar fixa 260px:**
  - Botao "← HOME"
  - Logo V4 + "DNA Visual"
  - Label "DADOS BASE" (cinza)
  - Secao 1 (indicador + nome)
  - Separador horizontal
  - Label "REUNIAO COM O CLIENTE" (vermelho)
  - Secoes 2-7 (indicador + nome)
  - Barra de progresso com %
  - Botao "Novo Cliente" (reset)

- **Area de conteudo:**
  - Header sticky: "Nome do Cliente" + "Nome do Designer"
  - Secao 1 (Dados Base) com 9 inputs
  - Divisor visual "Reuniao com o Cliente"
  - Secoes 2-7 com textareas auto-expandiveis
  - Numero decorativo gigante atras de cada secao
  - Tag "OPCIONAL" na secao 7

- **Footer fixo:** Botao "GERAR DOSSIE DE IDENTIDADE VISUAL"

- **Mobile:** sidebar some, aparece barra horizontal scrollavel no topo com numeros das secoes + progresso

### Tela 3: OUTPUT
**Rota:** `/output`

- Fundo branco (contraste com o resto escuro)
- Logo V4 + nome do cliente + designer + data
- Cada secao com titulo vermelho e linha divisoria
- Perguntas em caixa alta cinza
- Respostas preenchidas em preto
- "Nao preenchido" em italico cinza para vazios
- Footer fixo com 3 botoes:
  - **VOLTAR E EDITAR** (outline preto)
  - **COPIAR TUDO** (vermelho solido)
  - **COPIAR PARA O CLAUDE** (outline vermelho)

### Tela 4: UPLOAD
**Rota:** `/upload`

- Botao "← HOME" no topo
- Drop zone grande com borda tracejada
- Icone de upload em CSS puro (vermelho)
- Texto "Arraste o arquivo aqui ou clique para selecionar"
- Subtexto "Aceita DOCX ou TXT (max. 10MB)"
- Ao selecionar: nome do arquivo aparece
- Botao "ANALISAR DOCUMENTO" aparece (vermelho)

### Tela 5: LOADING
**Rota:** `/loading`

- Fundo preto, centralizado
- Titulo "Analisando o documento..." em Bebas Neue
- 7 itens aparecem sequencialmente com fade-in
- Cada item: numero vermelho + nome da secao + barra de progresso
- Botao "CANCELAR" aparece apos 1 segundo (outline)
- Ao terminar: navega automaticamente para Resultado

### Tela 6: RESULTADO
**Rota:** `/result`

- Header fixo com 3 elementos:
  - Botao "← VOLTAR"
  - Texto "Resultado da Analise"
  - Botao "HOME" (direita)

- **Duas colunas:**
  - **Esquerda (fundo escuro):**
    - Campo "Nome do Cliente" destacado
    - Titulo "O QUE FOI ENCONTRADO"
    - Secoes com indicador verde (completo) ou amarelo (parcial)
    - Conteudo extraido em cinza
  - **Direita (fundo card):**
    - Titulo "O QUE ESTA FALTANDO"
    - Secoes com indicador vermelho
    - Textareas vazias para preenchimento manual

- Footer fixo com 2 botoes:
  - **GERAR DOSSIE COM O QUE TENHO** (vermelho)
  - **COMPLETAR O QUE FALTA** (outline)

---

## INPUT E OUTPUT

### INPUT

**Formulario (Fluxo 1):**
- Textos livres em 15 textareas
- Valores curtos em 9 inputs
- Nome do cliente e designer obrigatorios

**Upload (Fluxo 2):**
- Arquivo DOCX (Word) ate 10MB
- Arquivo TXT ate 10MB
- Briefings, transcricoes de call, formularios respondidos

### OUTPUT

**Modo Local (atual):**

1. **Tela de Output:** dossie formatado visualmente com todas as respostas
2. **Copiar Tudo:** texto puro formatado para clipboard
   ```
   DOSSIE DE IDENTIDADE VISUAL
   [nome do cliente]
   Gerado em [data] por [designer]
   ==================================================
   
   1. DADOS BASE DO CLIENTE
   ----------------------------------------
   Nome da empresa ou marca
   [resposta]
   ...
   ```
3. **Copiar para o Claude:** system prompt + respostas formatadas
   ```
   [System prompt do dossier-prompt.js]
   
   ---
   
   RESPOSTAS DO FORMULARIO:
   
   Secao 1: Dados Base do Cliente
   [pergunta]: [resposta]
   ...
   ```

**Modo com API (futuro):**
- Dossie profissional gerado pela IA com 8 secoes estruturadas:
  1. Identidade da Marca
  2. Diretrizes Visuais (com HEX, tipografia, estilo)
  3. Tom de Voz e Comunicacao
  4. Referencias e Concorrentes
  5. Materiais e Ativos
  6. Historico e Aprendizados
  7. Direcionamento por Tipo de Entrega (LP, Ads, Carrossel, Video, KV)
  8. Checklist de Onboarding do Designer

---

## FUNCIONALIDADES

### Auto-save
- localStorage key: `dna_visual_v4`
- Debounce de 300ms no save
- Toast "Salvo automaticamente" por 2 segundos
- Bolinha verde indicativa
- Persiste entre reloads do navegador

### Indicadores de 3 Estados (sidebar)
- **Vazio:** borda cinza, sem preenchimento
- **Parcial:** vermelho com opacidade 0.4 (algumas respostas)
- **Completo:** vermelho solido (todos os campos da secao preenchidos)

### Barra de Progresso
- Calcula % sobre 26 campos totais (24 + clientName + designerName)
- Atualiza em tempo real a cada digitacao
- Aparece na sidebar (desktop) e no topo (mobile)

### Validacao Inteligente
1. **Alert** se clientName vazio
2. **Alert** se clientCompany vazio (com scroll ate a secao base)
3. **Pulse animation** na sidebar se secao obrigatoria (1-5) vazia
4. **Confirm dialog** se secao obrigatoria parcialmente preenchida
5. So gera dossie quando tudo OK

### Textareas Auto-Expand
- Ajuste automatico da altura conforme texto cresce
- Sem scroll interno
- Mantem altura ao recarregar (dados carregados do localStorage)

### Scroll Spy
- IntersectionObserver detecta secao ativa na area de conteudo
- Atualiza destaque na sidebar em tempo real
- Funciona tanto em desktop quanto mobile

### Navegacao Suave
- Click em secao da sidebar rola ate a secao
- Offset considera o header sticky
- Transicao suave

### Mobile (< 768px)
- Sidebar desaparece
- Barra horizontal scrollavel com numeros das secoes
- Indicador de progresso compacto
- Botao "Gerar Dossie" full-width

### Reset (Novo Cliente)
- Botao na sidebar com confirm
- Limpa localStorage
- Reseta formData no Context
- Volta para secao 1

### Drag and Drop
- Counter para evitar flickering
- Highlight visual ao arrastar (borda vermelha)
- Aceita apenas .docx, .doc, .txt
- Validacao de tamanho (10MB)
- Reset do input para permitir mesmo arquivo 2x

### DOCX Workaround
- Detecta se content comeca com "PK" (ZIP header do DOCX)
- Ou se contem "word/document.xml"
- Remove tags XML com regex
- Extrai texto legivel do lixo binario
- Substituido por mammoth.js quando API estiver conectada

### Analise Local (sem API)
- Keyword matching nos 24 campos
- Extrai ate 5 palavras-chave de cada pergunta
- Busca no texto do documento
- Retorna trechos de contexto (170 caracteres ao redor)
- Mostra encontrado vs faltando

---

## MODOS DE OPERACAO

### Modo 1: Local (atual)
**Variaveis de ambiente:** nenhuma configurada

- Formulario funciona 100%
- Upload funciona com analise local (keyword matching)
- Output e espelho das respostas
- Botao "Copiar para o Claude" formata prompt + respostas
- Designer cola no Claude.ai e recebe dossie processado

### Modo 2: Com API (proximo)
**Variaveis:** `CLAUDE_API_KEY` configurada

- Formulario funciona igual
- Upload passa a usar Claude para analise real
- Output mostra dossie gerado pela IA automaticamente
- Sem necessidade de copiar/colar manual

### Modo 3: Completo (futuro)
**Variaveis:** `CLAUDE_API_KEY` + `SUPABASE_URL` + `SUPABASE_ANON_KEY`

- Tudo do Modo 2
- Persistencia de clientes no Supabase
- Historico de dossies por cliente
- Qualquer designer da unidade acessa qualquer dossie
- Controle de versao dos dossies
- A "Biblia do Designer V4"

---

## STACK TECNOLOGICA

### Frontend
| Pacote | Versao | Funcao |
|--------|--------|--------|
| react | ^19.2.4 | UI library |
| react-dom | ^19.2.4 | DOM renderer |
| react-router-dom | ^7.14.0 | SPA routing |
| vite | ^8.0.4 | Build tool + dev server |

### Backend
| Pacote | Versao | Funcao |
|--------|--------|--------|
| express | ^5.2.1 | HTTP server |
| cors | ^2.8.6 | CORS handling |
| dotenv | ^17.4.1 | Env variables |

### Futuro
- `@anthropic-ai/sdk` para Claude API
- `@supabase/supabase-js` para banco de dados
- `mammoth` para parsing de DOCX real

### Fontes e Design
- **Bebas Neue:** titulos (Google Fonts)
- **DM Sans:** texto corrido (Google Fonts)
- **Paleta:** preto #0A0A0A + vermelho #C0392B + branco

---

## ESTRUTURA DE PASTAS

```
dna-visual/
├── .gitignore
├── .env.example
├── README.md
├── .claude/
│   └── launch.json              # Config do dev server
│
├── docs/
│   ├── PRD.md                   # Product Requirements Document
│   ├── ARCHITECTURE.md          # Documentacao arquitetural
│   ├── PROMPTS.md               # Documentacao dos prompts
│   ├── playbook.md              # Playbook do checkpoint
│   └── DOCUMENTACAO-COMPLETA.md # Este arquivo
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json              # SPA routing
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx             # Entry point
│   │   ├── App.jsx              # Router + Provider
│   │   ├── components/
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── FormContext.jsx  # Estado global
│   │   ├── hooks/
│   │   │   └── useAutoResize.js
│   │   ├── data/
│   │   │   └── sections.js      # As 24 perguntas
│   │   ├── pages/
│   │   │   ├── Home.jsx / .css
│   │   │   ├── Form.jsx / .css
│   │   │   ├── Output.jsx / .css
│   │   │   ├── Upload.jsx / .css
│   │   │   ├── Loading.jsx / .css
│   │   │   └── Result.jsx / .css
│   │   ├── services/
│   │   │   ├── analyzer.js      # Analise local
│   │   │   ├── clipboard.js     # Copiar tudo + Copiar pra Claude
│   │   │   └── prompts.js       # System prompt do dossie
│   │   └── styles/
│   │       └── global.css       # Variaveis + reset
│   └── dist/                    # Build output (gitignored)
│
└── backend/
    ├── package.json
    ├── server.js                # Express app
    ├── routes/
    │   ├── generate.js          # POST /api/generate
    │   ├── analyze.js           # POST /api/analyze
    │   └── clients.js           # CRUD clientes (futuro)
    ├── services/
    │   ├── claude.js            # Wrapper Claude API
    │   └── fileParser.js        # Parser DOCX/TXT (futuro)
    └── prompts/
        ├── dossier-prompt.js    # Prompt do gerador
        └── analyze-prompt.js    # Prompt do analisador
```

---

## DEPLOY E ACESSOS

### Producao
- **URL publica:** https://dna-visual.vercel.app
- **Plataforma:** Vercel
- **Conta:** danielcorreia-7184
- **Deploy automatico:** nao configurado (manual via CLI por enquanto)

### Repositorio
- **GitHub:** https://github.com/dcorreia2024-boop/DNA-VISUAL
- **Branch principal:** feature/design-dna-visual
- **Commits:** 4 ate o momento

### Desenvolvimento Local
```bash
cd dna-visual/frontend
npm install
npm run dev
# http://localhost:5173
```

### Build Local
```bash
npm run build
# gera dist/ com o app otimizado
```

### Variaveis de Ambiente
```env
# .env
CLAUDE_API_KEY=                  # Vazio no modo local
CLAUDE_MODEL=claude-sonnet-4-20250514
SUPABASE_URL=                    # Vazio sem banco
SUPABASE_ANON_KEY=               # Vazio sem banco
PORT=3001                        # Porta do backend
```

---

## PROXIMOS PASSOS

### Curto Prazo (ate proximo checkpoint)
1. Obter chave da Claude API
2. Testar geracao real do dossie via API
3. Coletar feedback da equipe de design da V4
4. Ajustar perguntas se necessario

### Medio Prazo
1. Configurar projeto no Supabase
2. Criar tabelas: `clients`, `dossies`, `designers`
3. Implementar autenticacao (Google OAuth)
4. Listar clientes do designer logado
5. Visualizar dossies anteriores
6. Editar dossie existente

### Longo Prazo
1. Instalar `mammoth` para parsing real de DOCX
2. Suporte a PDF via `pdf-parse`
3. Suporte a transcricoes de calls (YouTube, Google Meet)
4. IA pesquisar dados publicos automaticamente
5. Sistema de versoes dos dossies
6. Exportacao como PDF
7. Compartilhamento de dossie via link
8. Integracao com Figma (injetar paleta/fontes)
9. Integracao com Ekyte (puxar briefing da task)

---

## METRICAS DE IMPACTO ESPERADO

| Metrica | Antes | Depois |
|---------|-------|--------|
| Onboarding de cliente novo | 2-3 horas | 20-30 minutos |
| Transicao de carteira | Horas ou dias | Zero minutos |
| Designer novo produtivo | Semanas | Desde o primeiro dia |
| Retrabalho por briefing fraco | 30-50% | Reducao significativa |
| Informacao perdida (troca de designer) | Frequente | Nunca |
| Padronizacao | Zero | 100% |

**Economia estimada por designer:** 8-12 horas por mes.
**Economia estimada para a vertical:** multiplicar pelo numero de designers ativos.

---

## CREDITOS

**Responsavel:** Daniel Correia da Silva - Designer, V4 Ruston & Co. (Uberlandia)
**Facilitador:** Mariano Dimas Arce - Coordenador da Vertical de Design
**Desenvolvido com:** Claude Code + Claude Opus 4.6
**Contexto:** Hackathon ROKKO / NRD - V4 Ruston & Co. - Abril 2026

---

*Documentacao viva. Atualizar a cada mudanca estrutural.*
