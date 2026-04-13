// DNA VISUAL — SECOES E CAMPOS DEFINITIVOS
// Atualizado em 08/04/2026
// 2 blocos: Dados Base (IA pesquisa) + Reuniao com o Cliente (Designer preenche)
// Total: 9 campos base + 15 perguntas conversacionais = 24 campos

const SECTIONS = [

  // BLOCO 1 — DADOS BASE (IA PESQUISA)
  {
    id: 'base',
    num: '1',
    title: 'Dados Base do Cliente',
    required: true,
    block: 'dados-base',
    blockLabel: 'DADOS BASE \u2014 A IA pesquisa automaticamente',
    fields: [
      { key: 'clientCompany', label: 'Nome da empresa ou marca', type: 'input' },
      { key: 'clientNiche', label: 'Nicho ou segmento de atua\u00e7\u00e3o (ex: sa\u00fade, moda, educa\u00e7\u00e3o, food service, tecnologia)', type: 'input' },
      { key: 'clientCity', label: 'Cidade e estado de atua\u00e7\u00e3o', type: 'input' },
      { key: 'clientWebsite', label: 'Site do cliente (URL)', type: 'input', placeholder: 'https://' },
      { key: 'clientInstagram', label: 'Instagram do cliente (@)', type: 'input', placeholder: '@' },
      { key: 'clientOtherSocial', label: 'Outras redes sociais (Facebook, LinkedIn, TikTok, YouTube \u2014 links ou @\'s)', type: 'input' },
      { key: 'competitor1', label: 'Concorrente 1 \u2014 nome + Instagram ou site', type: 'input' },
      { key: 'competitor2', label: 'Concorrente 2 \u2014 nome + Instagram ou site', type: 'input' },
      { key: 'competitor3', label: 'Concorrente 3 \u2014 nome + Instagram ou site', type: 'input' },
    ],
  },

  // BLOCO 2 — REUNIAO COM O CLIENTE
  {
    id: 'business',
    num: '2',
    title: 'O Neg\u00f3cio e o P\u00fablico',
    required: true,
    block: 'reuniao',
    blockLabel: 'REUNI\u00c3O COM O CLIENTE \u2014 Preencha durante ou ap\u00f3s a call',
    fields: [
      { key: 'businessDescription', label: 'Me explica o que a empresa faz, pra quem vende e qual problema resolve \u2014 como se estivesse explicando pra algu\u00e9m que nunca ouviu falar da marca.' },
      { key: 'idealClient', label: 'Quem \u00e9 o cliente ideal? Descreve a pessoa \u2014 idade, perfil, renda, onde mora, o que valoriza na hora de comprar.' },
      { key: 'motivation', label: 'O que motivou o cliente a buscar esse trabalho agora? (insatisfa\u00e7\u00e3o, rebranding, lan\u00e7amento, crescimento, troca de ag\u00eancia)' },
    ],
  },
  {
    id: 'personality',
    num: '3',
    title: 'Personalidade da Marca',
    required: true,
    block: 'reuniao',
    fields: [
      { key: 'brandPersonality', label: 'Se a marca fosse uma pessoa, quais 3 palavras definiriam a personalidade dela? Como ela fala \u2014 formal, descontra\u00edda, t\u00e9cnica, divertida?' },
      { key: 'brandFeeling', label: 'O que o cliente quer que as pessoas SINTAM ao ver a marca? E o que ele N\u00c3O quer ser associado de jeito nenhum?' },
      { key: 'missionValues', label: 'O cliente tem miss\u00e3o, vis\u00e3o, valores ou slogan definidos? Quais s\u00e3o?' },
      { key: 'futureVision', label: 'Onde a empresa quer estar em 2-3 anos? Qual a ambi\u00e7\u00e3o?' },
    ],
  },
  {
    id: 'visual',
    num: '4',
    title: 'Identidade Visual e Estilo',
    required: true,
    block: 'reuniao',
    fields: [
      { key: 'existingIdentity', label: 'O que o cliente j\u00e1 tem de identidade visual \u2014 logo, cores (HEX se tiver), fontes, manual de marca? Onde est\u00e3o os arquivos?' },
      { key: 'visualStyle', label: 'Qual estilo visual o cliente quer \u2014 minimalista, vibrante, premium, popular, moderno, cl\u00e1ssico? Tem alguma marca de qualquer segmento que admira visualmente?' },
      { key: 'visualHate', label: 'O que o cliente detesta visualmente? O que N\u00c3O pode aparecer nos materiais de jeito nenhum?' },
    ],
  },
  {
    id: 'materials',
    num: '5',
    title: 'Materiais e Hist\u00f3rico',
    required: true,
    block: 'reuniao',
    fields: [
      { key: 'existingMaterials', label: 'Que fotos e v\u00eddeos o cliente j\u00e1 tem? (produto, equipe, espa\u00e7o, bastidores, depoimentos) Onde est\u00e3o os arquivos?' },
      { key: 'missingMaterials', label: 'O que o cliente N\u00c3O tem e vai precisar ser criado do zero? (fotos, v\u00eddeos, logo, manual, templates)' },
      { key: 'pastResults', label: 'Alguma campanha ou material anterior funcionou muito bem? O que funcionou e por qu\u00ea? E algum que foi um desastre?' },
    ],
  },
  {
    id: 'communication',
    num: '6',
    title: 'Tom de Comunica\u00e7\u00e3o',
    required: false,
    block: 'reuniao',
    fields: [
      { key: 'voiceTone', label: 'A marca se comunica formal ou informal? Pode usar humor, g\u00edrias, emojis? Tem palavras ou express\u00f5es que sempre usa ou que nunca deve usar?' },
    ],
  },
  {
    id: 'freeNotes',
    num: '7',
    title: 'Observa\u00e7\u00f5es Livres',
    required: false,
    block: 'reuniao',
    fields: [
      { key: 'freeNotes', label: 'Tem alguma coisa importante sobre esse cliente que n\u00e3o foi perguntada acima? Pode ser uma dor, um contexto, uma particularidade \u2014 anote tudo.' },
    ],
  },
];

export default SECTIONS;
export const STORAGE_KEY = 'dna_visual_v4';
