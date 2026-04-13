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
  text += '\n\n---\n\nRESPOSTAS DO FORMUL\u00c1RIO:\n\n';
  SECTIONS.forEach((sec) => {
    text += `Se\u00e7\u00e3o ${sec.num} \u2014 ${sec.title}:\n`;
    sec.fields.forEach((f) => {
      const val = (data[f.key] || '').trim();
      if (val) text += `${f.label}\n${val}\n\n`;
    });
    text += '\n';
  });
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
