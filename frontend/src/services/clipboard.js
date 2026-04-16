import SECTIONS from '../data/sections';
import { DOSSIER_SYSTEM_PROMPT } from './prompts';

export function formatDossieText(data) {
  const cn = data.clientName || 'Cliente';
  const dn = data.designerName || 'Designer';
  const dt = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  let text = `DOSSI\u00ca DE IDENTIDADE VISUAL\n${cn}\nGerado em ${dt} por ${dn}\n${'='.repeat(50)}\n\n`;
  SECTIONS.forEach((sec) => {
    text += `${sec.num}. ${sec.title.toUpperCase()}\n${'-'.repeat(40)}\n`;
    sec.fields.forEach((f) => {
      const val = (data[f.key] || '').trim();
      text += `\n${f.label}\n${val || '[N\u00e3o preenchido]'}\n`;
    });
    text += '\n';
  });
  return text;
}

export function formatForClaude(data) {
  let text = DOSSIER_SYSTEM_PROMPT;
  text += '\n\n---\n\n';
  text += 'RESPOSTAS DO FORMUL\u00c1RIO DE ONBOARDING:\n\n';

  // Dados Base do Cliente
  text += '\u2550\u2550\u2550 DADOS BASE DO CLIENTE \u2550\u2550\u2550\n\n';
  const baseFields = [
    ['Empresa', data.clientCompany],
    ['Nicho', data.clientNiche],
    ['Cidade', data.clientCity],
    ['Site', data.clientWebsite],
    ['Instagram', data.clientInstagram],
    ['Outras redes', data.clientOtherSocial],
    ['Concorrente 1', data.competitor1],
    ['Concorrente 2', data.competitor2],
    ['Concorrente 3', data.competitor3],
  ];
  baseFields.forEach(([label, value]) => {
    if (value && value.trim()) text += `${label}: ${value.trim()}\n`;
  });
  text += '\n';

  // Perguntas da Reuniao (apenas secoes do bloco reuniao)
  text += '\u2550\u2550\u2550 RESPOSTAS DA REUNI\u00c3O \u2550\u2550\u2550\n\n';
  const reuniaoSections = SECTIONS.filter(s => s.block === 'reuniao');
  reuniaoSections.forEach(sec => {
    text += `--- ${sec.title.toUpperCase()} ---\n\n`;
    sec.fields.forEach(f => {
      const val = (data[f.key] || '').trim();
      if (val) text += `${f.label}\n${val}\n\n`;
    });
  });

  // Instrucao final
  text += '\n---\n\n';
  text += 'Com base em TODAS as informa\u00e7\u00f5es acima, gere o dossi\u00ea completo de identidade visual seguindo a estrutura definida no system prompt. Seja pr\u00e1tico e acion\u00e1vel.\n';

  return text;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
}
