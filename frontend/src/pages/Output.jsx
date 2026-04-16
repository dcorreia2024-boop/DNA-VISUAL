import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import { formatDossieText, formatForClaude, copyToClipboard } from '../services/clipboard';
import './Output.css';

export default function Output() {
  const navigate = useNavigate();
  const { formData } = useForm();
  const [mode, setMode] = useState('prompt');
  const [feedback, setFeedback] = useState(null);

  const clientName = formData.clientName || 'Cliente';
  const designerName = formData.designerName || 'Designer';
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const baseSection = SECTIONS.find(s => s.block === 'dados-base');
  const reuniaoSections = SECTIONS.filter(s => s.block === 'reuniao');

  const showFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 1800);
  };

  const handleDownload = () => {
    const text = mode === 'prompt' ? formatForClaude(formData) : formatDossieText(formData);
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (formData.clientCompany || clientName).toLowerCase().replace(/[^a-z0-9]/g, '-');
    a.download = `dossie-${safeName}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('dl');
  };

  const handleCopy = async () => {
    const text = mode === 'prompt' ? formatForClaude(formData) : formatDossieText(formData);
    await copyToClipboard(text);
    showFeedback('cp');
  };

  return (
    <div className="output-screen">
      {/* NAV */}
      <nav className="out-nav">
        <button className="out-nav-back" onClick={() => navigate('/form')}>&larr; Voltar e editar</button>
        <div className="out-nav-brand">
          <div className="out-nav-v4">V4</div>
          <span>DNA Visual</span>
        </div>
      </nav>

      <div className="out-layout">
        {/* LEFT — WHITE DOCUMENT */}
        <div className="doc-col">
          <div className="doc-inner">

            {/* Header */}
            <div className="doc-header">
              <div className="doc-logo">
                <div className="doc-v4">V4</div>
                <span className="doc-brand-text">DNA Visual &mdash; V4 Ruston &amp; Co.</span>
              </div>
              <h1 className="doc-name">{clientName}</h1>
              <div className="doc-meta">
                <span>Dossi&ecirc; de Identidade Visual</span>
                <span className="doc-sep" />
                <span>{dateStr}</span>
                <span className="doc-sep" />
                <span>por {designerName}</span>
              </div>
            </div>

            {/* Client data grid */}
            {baseSection && (
              <div className="client-grid">
                <div className="client-grid-title">Dados Base do Cliente</div>
                <div className="client-data">
                  {baseSection.fields.map(f => (
                    <div className="client-item" key={f.key}>
                      <span className="client-label">{f.label.split('(')[0].split('\u2014')[0].trim()}</span>
                      <span className={`client-value ${(formData[f.key] || '').trim() ? '' : 'empty'}`}>
                        {(formData[f.key] || '').trim() || '\u2014'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sections */}
            {reuniaoSections.map(sec => (
              <div className="doc-section" key={sec.id}>
                <div className="doc-sec-header">
                  <span className="doc-sec-num">{sec.num}</span>
                  <div className="doc-sec-title-group">
                    <div className="doc-sec-title">{sec.title.toUpperCase()}</div>
                    <div className="doc-sec-line" />
                    {!sec.required && <div className="doc-sec-opt">Se&ccedil;&atilde;o opcional</div>}
                  </div>
                </div>
                <div className="doc-fields">
                  {sec.fields.map(f => {
                    const val = (formData[f.key] || '').trim();
                    return (
                      <div className="doc-field" key={f.key}>
                        <div className="doc-q">{f.label.split('?')[0].split('\u2014')[0].trim()}</div>
                        {val
                          ? <div className="doc-a">{val}</div>
                          : <div className="doc-a empty">N&atilde;o preenchido</div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* RIGHT — DARK EXPORT PANEL */}
        <div className="export-col">
          <div className="export-header">
            <div className="export-title">Exportar Dossi&ecirc;</div>
            <div className="export-sub">Escolha o formato e o que incluir</div>
          </div>

          {/* Mode selector */}
          <div className="mode-sel">
            <div className={`mode-slider ${mode === 'simple' ? 'right' : ''}`} />
            <button className={`mode-btn ${mode === 'prompt' ? 'on' : ''}`} onClick={() => setMode('prompt')}>Com prompt IA</button>
            <button className={`mode-btn ${mode === 'simple' ? 'on' : ''}`} onClick={() => setMode('simple')}>S&oacute; respostas</button>
          </div>

          {/* Export cards */}
          <div className="export-cards">
            {/* Download */}
            <div className="e-card primary" onClick={handleDownload}>
              <div className="e-card-top">
                <div className="e-card-icon">&darr;</div>
                <span className="e-tag rec">Recomendado</span>
              </div>
              <div className="e-card-title">Baixar Dossi&ecirc;</div>
              <div className="e-card-desc">Arquivo .md pronto pra jogar no Claude, ChatGPT ou qualquer IA e gerar o dossi&ecirc; profissional.</div>
              <div className="e-card-action">Baixar .md <span className="arrow">&rarr;</span></div>
              {feedback === 'dl' && (
                <div className="e-fb show">
                  <div className="e-fb-check">&check;</div>
                  <div className="e-fb-text">Baixado!</div>
                </div>
              )}
            </div>

            {/* Copy */}
            <div className="e-card" onClick={handleCopy}>
              <div className="e-card-top">
                <div className="e-card-icon">&#x2398;</div>
              </div>
              <div className="e-card-title">Copiar Texto</div>
              <div className="e-card-desc">Copia tudo pra clipboard. Cole no Notion, Drive, e-mail ou WhatsApp.</div>
              <div className="e-card-action">Copiar <span className="arrow">&rarr;</span></div>
              {feedback === 'cp' && (
                <div className="e-fb show">
                  <div className="e-fb-check">&check;</div>
                  <div className="e-fb-text">Copiado!</div>
                </div>
              )}
            </div>

            {/* PDF — disabled */}
            <div className="e-card off">
              <div className="e-card-top">
                <div className="e-card-icon">&loz;</div>
                <span className="e-tag soon">Em breve</span>
              </div>
              <div className="e-card-title">Gerar PDF</div>
              <div className="e-card-desc">Dossi&ecirc; formatado pela IA, pronto pra apresentar. Requer API.</div>
              <div className="e-card-action" style={{ opacity: 0.3 }}>Em breve <span className="arrow">&rarr;</span></div>
            </div>
          </div>

          <div className="export-footer">
            <div className="export-hint">
              {mode === 'prompt'
                ? 'Inclui instru\u00e7\u00f5es que permitem qualquer IA gerar o dossi\u00ea profissional completo a partir das suas respostas.'
                : 'Apenas perguntas e respostas organizadas, sem instru\u00e7\u00f5es de IA.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
