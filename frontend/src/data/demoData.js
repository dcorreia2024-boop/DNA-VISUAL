// Dossie pre-gerado para modo demo
// Schema compativel com DossieTemplate v3 (Brand Book Premium)
// Carrega instantaneamente sem chamar API

export const DEMO_DOSSIER = {
  clientName: 'Bloom <em>Studio</em>',
  nameRaw: 'Bloom Studio',
  segment: 'Design floral &middot; Est&uacute;dio autoral',
  designer: 'Designer Demo',
  edition: 'VOL. 01',
  issue: 'NO. 0042 · DEMO',
  date: 'Demonstração',
  location: 'Brasil',

  tagline: 'Estúdio floral premium para quem busca exclusividade e arte nos detalhes.',
  pullquote: 'Transformar momentos comuns em memórias através de arranjos florais autorais.',

  mission: 'Criar arranjos florais autorais que transformam momentos comuns em memórias.',
  vision: 'Ser referência em design floral artesanal no Brasil até 2028, mantendo o caráter autoral em cada arranjo.',
  values: 'Autenticidade — cada arranjo é único.\nDelicadeza — atendimento humano.\nSustentabilidade — flores de produtores locais.\nArte — composição como linguagem.',

  personality: [
    { word: 'Sofisticada', italic: false, meaning: 'Estética refinada em cada detalhe' },
    { word: 'Calorosa', italic: true, meaning: 'Atendimento humano e próximo' },
    { word: 'Criativa', italic: false, meaning: 'Cada arranjo é uma composição autoral' },
  ],

  primaryAudience: '<strong>Mulheres 28-45 anos</strong>, classes A/B, que valorizam estética e experiências únicas. Buscam presente memorável, estética diferenciada e experiência premium.',
  secondaryAudience: '<strong>Empresas e eventos corporativos</strong> que precisam de identidade visual floral consistente. Querem identidade única, consistência visual e parceria confiável.',

  wantTags: ['Autoral', 'Premium', 'Artístico', 'Sofisticado', 'Memorável', 'Atencioso'],
  avoidTags: ['Genérico', 'Promocional', 'Floricultura comum', 'Barato', 'Massificado'],

  colors: {
    primary: '#C9856C',
    secondary: '#8A9E7B',
    neutral: '#F5EFE6',
    accent: '#3D2B1F',
  },

  palette: [
    { name: 'Rosa', italicPart: 'Antigo', hex: '#C9856C', role: 'Primária', usage: 'CTAs, destaques, elementos principais. Cânor da composição.', proportion: 40 },
    { name: 'Verde', italicPart: 'Sage', hex: '#8A9E7B', role: 'Secundária', usage: 'Fundos secundários e elementos de suporte. Equilíbrio orgânico.', proportion: 25 },
    { name: 'Creme', italicPart: 'Marfim', hex: '#F5EFE6', role: 'Neutra', usage: 'Fundos, espaços em branco, leveza. Substitui o branco puro.', proportion: 25 },
    { name: 'Terracota', italicPart: 'Escuro', hex: '#3D2B1F', role: 'Texto', usage: 'Textos longos, contrastes, peso visual. Mais humano que preto puro.', proportion: 10 },
  ],

  typography: [
    {
      display: 'Cada flor conta <em>uma história</em>.',
      family: 'Cormorant Garamond',
      weight: 'Light–Regular',
      usage: 'Display — momentos monumentais',
      status: 'Recomendada',
      isSerif: true,
      googleFontsUrl: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400',
    },
    {
      display: 'Criado com intenção. Arte que você pode sentir.',
      family: 'DM Sans',
      weight: 'Regular–Medium',
      usage: 'Body — todo o resto do dossiê',
      status: 'Recomendada',
      isSerif: false,
      googleFontsUrl: 'DM+Sans:wght@300;400;500;600;700',
    },
  ],

  visualStyle: [
    { adjective: 'Editorial', description: 'Composições assimétricas, muita respiração visual, fotografia com luz natural' },
    { adjective: 'Orgânico', description: 'Texturas naturais, tons terrosos e rosados, fluidez nas formas' },
    { adjective: 'Refinado', description: 'Cormorant Garamond nos títulos, hierarquia clara, minimalismo intencional' },
  ],

  visualDontDo: [
    'Cores neon ou saturadas',
    'Fontes decorativas excessivas',
    'Visual genérico de floricultura de shopping',
    'Imagens stock de buquê',
    'Excesso de elementos competindo',
  ],

  voiceQuote: 'Cada flor conta uma história. Cada arranjo é criado com intenção, não por encomenda.',

  copyOnBrand: [
    'Cada flor conta uma história',
    'Criado com intenção',
    'Arte que você pode sentir',
    'Para os momentos que importam',
  ],

  copyOffBrand: [
    'Promoção relâmpago — só hoje!',
    'O melhor preço da cidade',
    'Floricultura completa para todas as ocasiões',
    'Compre 3 leve 4 — ofertas imperdíveis',
  ],

  alwaysWords: ['Autoral', 'Intenção', 'Arte', 'História', 'Criado', 'Memória'],
  neverWords: ['Barato', 'Promoção', 'Imperdível', 'Liquidação', 'Combo', 'Pacote'],

  competitors: [
    {
      name: 'Flor de Lis',
      tagline: 'Volume e preço acessível · Nacional',
      badge: 'INCUMBENT',
      doWell: 'Presença forte em datas comemorativas. Marca conhecida e capilaridade nas grandes capitais.',
      doBad: 'Sem identidade visual consistente. Comunicação genérica e promocional, sem autoria.',
      diff: 'Bloom tem autoria — cada arranjo é único, assinado e tem narrativa própria.',
    },
    {
      name: 'Studio Verde',
      tagline: 'Decoração corporativa · São Paulo',
      badge: 'NICHO',
      doWell: 'Contratos recorrentes com empresas. Logística robusta para eventos de grande porte.',
      doBad: 'Não atende consumidor final com atenção. Visual industrial sem alma artística.',
      diff: 'Bloom equilibra B2C e B2B sem perder a essência artística em nenhum dos dois.',
    },
    {
      name: 'Aesop (referência)',
      tagline: 'Cosméticos premium · Global',
      badge: 'GLOBAL',
      doWell: 'Identidade editorial impecável, tipografia refinada, atenção ao detalhe em cada toque.',
      doBad: 'Não é do nosso setor — é referência visual, não concorrente direto.',
      diff: 'Bloom traz a mesma sofisticação editorial pro universo floral brasileiro.',
    },
  ],

  existingAssets: [
    { name: 'Logo básico', detail: 'Vetorial, com agência anterior. Precisa modernização tipográfica.' },
    { name: 'Conta Instagram ativa', detail: '@bloomstudio · 2k seguidores · posts sem identidade consistente.' },
    { name: 'Catálogo fotográfico', detail: 'Cerca de 200 fotos de arranjos. Qualidade boa, estilo inconsistente.' },
    { name: 'Lista de fornecedores locais', detail: 'Produtores orgânicos da região de Holambra. Diferencial já estabelecido.' },
  ],

  assetsToCreate: [
    { name: 'Brand book completo', detail: 'Sistema visual unificado: logo + variações + paleta + tipografia + tom de voz', priority: 'high' },
    { name: 'Templates Instagram', detail: 'Kit de 8 layouts para posts, stories e carrosséis. Editáveis em Canva.', priority: 'high' },
    { name: 'Embalagem premium', detail: 'Caixa, papel de seda, etiqueta personalizada com mensagem manuscrita.', priority: 'mid' },
    { name: 'Site institucional', detail: 'Vitrine + portfólio + agendamento de orçamento. Mobile-first.', priority: 'mid' },
    { name: 'Lookbook digital anual', detail: 'PDF curado com 30 arranjos do ano + texto editorial.', priority: 'low' },
  ],

  whatWorked: {
    what: 'Sessões de fotografia editorial com luz natural geraram engajamento orgânico três vezes maior',
    why: 'A audiência da Bloom valoriza estética antes de preço. Conteúdo que parece editorial (não publicidade) converte mais. Replicar mensalmente.',
  },

  whatFailed: {
    what: 'Posts com gatilhos promocionais (só hoje, imperdível) tiveram zero conversão',
    why: 'O público premium não responde a urgência artificial. A marca perdeu credibilidade nas semanas seguintes.',
  },

  strategicNote: 'Benchmarks aspiracionais: <strong>Aesop</strong> (identidade editorial impecável) e <strong>Marimekko</strong> (autoria visual reconhecível). Anti-benchmark: <strong>floricultura de shopping</strong> com cartaz de promoção.',

  deliveries: [
    {
      type: 'Templates Instagram',
      meta: 'Prioridade Alta',
      objective: 'Permitir publicação consistente sem depender de designer pra cada post',
      visual: 'Cormorant nos títulos, DM Sans nos corpos. Fundo creme marfim. Foto da flor no centro. Espaço em branco generoso.',
      avoid: 'Texto sobre foto. Mais de 1 CTA. Cores fora da paleta. Filtro vintage.',
    },
    {
      type: 'Embalagem',
      meta: 'Estratégico',
      objective: 'Transformar entrega em parte da experiência. Embalagem como conteúdo gerado pelo cliente.',
      visual: 'Caixa kraft com etiqueta tipográfica. Papel de seda rosa antigo. Mensagem manuscrita interna.',
      avoid: 'Plástico. Logos grandes. Fitas chamativas. Cartão impresso genérico.',
    },
    {
      type: 'Site institucional',
      meta: 'Volume Alto',
      objective: 'Captar orçamento via formulário detalhado. Vitrine de portfólio organizado por ocasião.',
      visual: 'Mobile-first. Hero com vídeo curto. Tipografia editorial. Fotos em grid assimétrico.',
      avoid: 'Carrossel de banners. CTAs piscando. Stock photos. Cores fora da paleta.',
    },
  ],

  immediateActions: [
    'Mapear paleta atual (HEX exatos das fotos existentes)',
    'Definir 3 conceitos de logo modernizado para apresentar ao cliente',
    'Criar 8 templates de Instagram (3 posts + 3 carrosséis + 2 stories)',
    'Curadoria de 50 fotos do catálogo que servem ao novo posicionamento',
    'Sessão fotográfica editorial com novo direcionamento visual',
  ],

  operationalNote: 'Cliente quer expandir B2B mas equipe atual é enxuta (3 pessoas). Recomendar contratar produtora visual antes de aceitar contratos corporativos grandes.',

  pendingQuestions: [
    'Aprovação da paleta antes de produzir: rosa antigo + verde sage + creme + terracota?',
    'O slogan "cada flor conta uma história" pode ser usado externamente?',
    'Existem fornecedores fixos que já entregam embalagem com a marca?',
    'Qual o orçamento total para o lançamento da nova identidade?',
  ],

  finalSummary: 'Bloom Studio precisa de identidade que respire arte e intenção. Cormorant Garamond + paleta terrosa-rosada + composições editoriais.',
};
