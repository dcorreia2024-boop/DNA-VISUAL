import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import { formatDossieText, formatForClaude, copyToClipboard } from '../services/clipboard';
import './Output.css';

export default function Output() {
  const navigate = useNavigate();
  const { formData } = useForm();
  const [copyLabel, setCopyLabel] = useState('COPIAR TUDO');
  const [claudeLabel, setClaudeLabel] = useState('COPIAR PARA O CLAUDE');

  const clientName = formData.clientName || 'Cliente';
  const designerName = formData.designerName || 'Designer';
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleCopy = async () => {
    await copyToClipboard(formatDossieText(formData));
    setCopyLabel('COPIADO!');
    setTimeout(() => setCopyLabel('COPIAR TUDO'), 2000);
  };

  const handleCopyForClaude = async () => {
    await copyToClipboard(formatForClaude(formData));
    setClaudeLabel('COPIADO!');
    setTimeout(() => setClaudeLabel('COPIAR PARA O CLAUDE'), 2000);
  };

  return (
    <div className="out-screen">
      <div className="out-wrap">
        <div className="out-top">
          <div className="v4">V4</div>
          <div className="brand">
            <div className="brand-n">{clientName}</div>
            <div className="brand-s">DNA Visual &mdash; V4 Ruston &amp; Co.</div>
          </div>
        </div>
        <div className="out-client">{clientName}</div>
        <div className="out-meta">Dossi&ecirc; de Identidade Visual &mdash; Gerado em {dateStr} por {designerName}</div>

        {SECTIONS.map((sec) => (
          <div className="out-sec" key={sec.id}>
            <div className="out-sec-t">
              <span className="out-sec-n">{sec.num}</span> {sec.title.toUpperCase()}
            </div>
            {sec.fields.map((f) => {
              const val = (formData[f.key] || '').trim();
              return (
                <div className="out-item" key={f.key}>
                  <div className="out-q">{f.label}</div>
                  {val ? <div className="out-a">{val}</div> : <div className="out-e">N&atilde;o preenchido</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="out-ft">
        <button className="btn btn-o" onClick={() => navigate('/form')}>VOLTAR E EDITAR</button>
        <button className="btn btn-r" onClick={handleCopy}>{copyLabel}</button>
        <button className="btn btn-claude" onClick={handleCopyForClaude}>{claudeLabel}</button>
      </div>
    </div>
  );
}
