// Dossie pre-gerado para modo demo (Schema v2 do template Bloom Studio)
// Carrega instantaneamente sem chamar API

export const DEMO_DOSSIER = {
  clientName: 'Bloom Studio',
  designerName: 'Designer Demo',
  generatedAt: new Date().toISOString(),

  // Header institucional
  edition: 'VOL. 01',
  issue: 'NO. 0042',
  segment: 'Design floral · Estúdio autoral',
  location: 'Brasil',
  tagline: 'Estúdio floral premium para quem busca exclusividade e arte nos detalhes — onde cada arranjo conta uma história.',

  brandEssence: {
    purpose: 'Transformar momentos comuns em memórias através de arranjos florais autorais.',
    mission: 'Criar arranjos florais autorais que transformam momentos comuns em memórias.',
    vision: 'Ser referência em design floral artesanal no Brasil até 2028, mantendo o caráter autoral em cada arranjo.',
    values: ['Autenticidade', 'Delicadeza', 'Sustentabilidade', 'Arte como linguagem'],
    personality: ['Sofisticada', 'Calorosa', 'Criativa', 'Atenciosa'],
    personalityMeanings: [
      'Estética refinada em cada detalhe',
      'Atendimento humano e próximo',
      'Cada arranjo é composição autoral',
      'Curadoria nos mínimos detalhes',
    ],
  },

  targetAudience: {
    primary: {
      profile: '<strong>Mulheres 28–45 anos</strong>, classes A/B, que valorizam estética e experiências únicas. Buscam presente memorável, estética diferenciada e experiência premium.',
      painPoints: ['Flores genéricas', 'Atendimento impessoal', 'Falta de exclusividade'],
      desires: ['Autoral', 'Premium', 'Artístico', 'Memorável'],
    },
    secondary: {
      profile: '<strong>Empresas e eventos corporativos</strong> que precisam de identidade visual floral consistente. Querem identidade única, consistência visual e parceria confiável.',
      painPoints: ['Decoração genérica', 'Prazo apertado'],
      desires: ['Genérico', 'Promocional', 'Massificado'],
    },
  },

  colorPalette: {
    primary: { name: 'Rosa Antigo', hex: '#C9856C', usage: 'CTAs, destaques, elementos principais', proportion: 40 },
    secondary: { name: 'Verde Sage', hex: '#8A9E7B', usage: 'Fundos secundários e elementos de suporte', proportion: 25 },
    neutral: { name: 'Creme Marfim', hex: '#F5EFE6', usage: 'Fundos, espaços em branco, leveza', proportion: 25 },
    dark: { name: 'Terracota Escuro', hex: '#3D2B1F', usage: 'Textos, contrastes, peso visual', proportion: 10 },
    accent: { name: 'Dourado Suave', hex: '#D4AF7A', usage: 'Detalhes premium, ícones, bordas', proportion: 0 },
  },

  typography: [
    { role: 'display', family: 'Cormorant Garamond', weights: ['300', '400', '500', '600'], usage: 'Headlines, títulos, logo' },
    { role: 'text', family: 'DM Sans', weights: ['300', '400', '500', '600', '700'], usage: 'Texto corrido, UI, legendas' },
  ],

  toneOfVoice: {
    quote: 'Cada flor conta uma história. Cada arranjo é criado com intenção, não por encomenda.',
    adjectives: ['Poético', 'Refinado', 'Próximo', 'Inspirador'],
    doSay: [
      'Cada flor conta uma história',
      'Criado com intenção',
      'Arte que você pode sentir',
      'Para os momentos que importam',
    ],
    dontSay: [
      'Promoção relâmpago — só hoje!',
      'O melhor preço da cidade',
      'Floricultura completa para todas as ocasiões',
      'Compre 3 leve 4 — ofertas imperdíveis',
    ],
    wordsToUse: ['Autoral', 'Intenção', 'Arte', 'História', 'Criado', 'Memória'],
    wordsToAvoid: ['Barato', 'Promoção', 'Imperdível', 'Liquidação', 'Combo', 'Pacote'],
  },

  competitors: [
    {
      name: 'Flor de Lis',
      positioning: 'Volume e preço acessível · Nacional',
      type: 'incumbent',
      strength: 'Presença forte em datas comemorativas. Marca conhecida e capilaridade nas grandes capitais.',
      weakness: 'Sem identidade visual consistente. Comunicação genérica e promocional, sem autoria.',
      differentiator: 'Bloom tem autoria — cada arranjo é único, assinado e tem narrativa própria.',
    },
    {
      name: 'Studio Verde',
      positioning: 'Decoração corporativa · São Paulo',
      type: 'nicho',
      strength: 'Contratos recorrentes com empresas. Logística robusta para eventos de grande porte.',
      weakness: 'Não atende consumidor final com atenção. Visual industrial sem alma artística.',
      differentiator: 'Bloom equilibra B2C e B2B sem perder a essência artística em nenhum dos dois.',
    },
    {
      name: 'Aesop (referência)',
      positioning: 'Cosméticos premium · Global',
      type: 'global',
      strength: 'Identidade editorial impecável, tipografia refinada, atenção ao detalhe em cada toque.',
      weakness: 'Não é do nosso setor — é referência visual, não concorrente direto.',
      differentiator: 'Bloom traz a mesma sofisticação editorial pro universo floral brasileiro.',
    },
  ],

  visualReferences: {
    principles: [
      { name: 'Editorial', description: 'Composições assimétricas, muita respiração visual, fotografia com luz natural.' },
      { name: 'Orgânico', description: 'Texturas naturais, tons terrosos e rosados, fluidez nas formas.' },
      { name: 'Refinado', description: 'Cormorant Garamond nos títulos, hierarquia clara, minimalismo intencional.' },
    ],
    avoid: [
      'Cores neon ou saturadas',
      'Fontes decorativas excessivas',
      'Visual genérico de floricultura',
      'Imagens stock de buquê',
      'Excesso de elementos competindo',
    ],
  },

  materials: {
    existing: [
      { title: 'Logo básico', description: 'Vetorial, com agência anterior. Precisa modernização tipográfica.' },
      { title: 'Conta Instagram ativa', description: '@bloomstudio · 2k seguidores · posts sem identidade consistente.' },
      { title: 'Catálogo fotográfico', description: 'Cerca de 200 fotos de arranjos. Qualidade boa, estilo inconsistente.' },
      { title: 'Lista de fornecedores locais', description: 'Produtores orgânicos da região de Holambra. Diferencial já estabelecido.' },
    ],
    toCreate: [
      { title: 'Brand book completo', description: 'Sistema visual unificado: logo + variações + paleta + tipografia + tom.', priority: 'alta' },
      { title: 'Templates Instagram', description: 'Kit de 8 layouts para posts, stories e carrosséis. Editáveis em Canva.', priority: 'alta' },
      { title: 'Embalagem premium', description: 'Caixa, papel de seda, etiqueta personalizada com mensagem manuscrita.', priority: 'media' },
      { title: 'Site institucional', description: 'Vitrine + portfólio + agendamento de orçamento. Mobile-first.', priority: 'media' },
      { title: 'Lookbook digital anual', description: 'PDF curado com 30 arranjos do ano + texto editorial.', priority: 'baixa' },
    ],
  },

  history: {
    worked: {
      quote: 'Sessões de fotografia editorial com luz natural geraram engajamento orgânico três vezes maior',
      explanation: 'A audiência da Bloom valoriza estética antes de preço. Conteúdo que parece editorial (não publicidade) converte mais. Replicar mensalmente.',
    },
    failed: {
      quote: 'Posts com gatilhos promocionais (só hoje, imperdível) tiveram zero conversão',
      explanation: 'O público premium não responde a urgência artificial. A marca perdeu credibilidade nas semanas seguintes.',
    },
    benchmarks: 'Benchmarks aspiracionais: <strong>Aesop</strong> (identidade editorial impecável) e <strong>Marimekko</strong> (autoria visual reconhecível). Anti-benchmark: <strong>floricultura de shopping</strong> com cartaz de promoção.',
  },

  deliveries: [
    {
      name: 'Templates Instagram',
      priority: 'Prioridade Alta',
      objective: 'Permitir publicação consistente sem depender de designer pra cada post.',
      direction: 'Cormorant nos títulos, DM Sans nos corpos. Fundo creme marfim. Foto da flor no centro.',
      avoid: 'Texto sobre foto. Mais de 1 CTA. Cores fora da paleta. Filtro vintage.',
    },
    {
      name: 'Embalagem',
      priority: 'Estratégico',
      objective: 'Transformar entrega em parte da experiência. Embalagem como conteúdo gerado pelo cliente.',
      direction: 'Caixa kraft com etiqueta tipográfica. Papel de seda rosa antigo. Mensagem manuscrita interna.',
      avoid: 'Plástico. Logos grandes. Fitas chamativas. Cartão impresso genérico.',
    },
    {
      name: 'Site Institucional',
      priority: 'Volume Alto',
      objective: 'Captar orçamento via formulário detalhado. Vitrine de portfólio organizado por ocasião.',
      direction: 'Mobile-first. Hero com vídeo curto. Tipografia editorial. Fotos em grid assimétrico.',
      avoid: 'Carrossel de banners. CTAs piscando. Stock photos. Cores fora da paleta.',
    },
  ],

  designerChecklist: {
    immediate: [
      'Mapear paleta atual (HEX exatos das fotos existentes)',
      'Definir 3 conceitos de logo modernizado para apresentar ao cliente',
      'Criar 8 templates de Instagram (3 posts + 3 carrosséis + 2 stories)',
      'Curadoria de 50 fotos do catálogo que servem ao novo posicionamento',
      'Sessão fotográfica editorial com novo direcionamento visual',
    ],
    pending: 'Cliente quer expandir B2B mas equipe atual é enxuta (3 pessoas). Recomendar contratar produtora visual antes de aceitar contratos corporativos grandes.',
    questions: [
      'Aprovação da paleta antes de produzir: rosa antigo + verde sage + creme + terracota?',
      'O slogan "cada flor conta uma história" pode ser usado externamente?',
      'Existem fornecedores fixos que já entregam embalagem com a marca?',
      'Qual o orçamento total para o lançamento da nova identidade?',
    ],
  },

  finalSummary: {
    main: 'A Bloom precisa de identidade que <em>respire arte e intenção</em> — onde cada elemento reforça que estamos falando de um estúdio autoral, não de uma floricultura comum.',
    startHere: [
      'Logo modernizado com Cormorant Garamond',
      'Paleta rosa antigo · verde sage · creme',
      'Kit de 8 templates Instagram editoriais',
      'Sessão fotográfica com luz natural',
    ],
    defend: [
      'Composição assimétrica em todas as peças',
      'Tipografia editorial nos títulos',
      'Espaço em branco generoso',
      'Tom de voz autoral, nunca promocional',
    ],
    avoid: [
      'Cores neon ou saturadas',
      'Estética de floricultura de shopping',
      'Gatilhos promocionais agressivos',
      'Stock photos ou imagens genéricas',
    ],
  },

  // Mockups da seção tipografia (campos opcionais — IA pode preencher ou usar fallback)
  typographyMockups: {
    instagram: {
      handle: '@bloomstudio.br',
      title: 'Cada flor conta <em>uma história</em>.',
      meta: 'Coleção Outono · 2026',
    },
    tag: {
      number: 'N° 042',
      name: 'Bloom <em>Studio</em>',
      message: 'Criado com intenção. Para os momentos que importam.',
    },
    hero: {
      eyebrow: 'Coleção Permanente',
      title: 'Arte que você pode <em>sentir</em>',
      cta: 'Agendar consultoria →',
    },
  },
};
