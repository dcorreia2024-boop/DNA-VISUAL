import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import { formatDossieText, formatForClaude, copyToClipboard } from '../services/clipboard';
import './Output.css';

// Very minimal markdown renderer (headings, bold, lists, paragraphs)
function renderMarkdown(md) {
  if (!md) return [];
  const lines = md.split('\n');
  const blocks = [];
  let buffer = [];
  let inList = false;

  const flushPara = () => {
    if (buffer.length) {
      blocks.push({ type: 'p', text: buffer.join(' ') });
      buffer = [];
    }
  };

  lines.forEach((line, i) => {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    const h1 = line.match(/^#\s+(.+)$/);
    const li = line.match(/^[-*]\s+(.+)$/);

    if (h1) { flushPara(); inList = false; blocks.push({ type: 'h1', text: h1[1] }); }
    else if (h2) { flushPara(); inList = false; blocks.push({ type: 'h2', text: h2[1] }); }
    else if (h3) { flushPara(); inList = false; blocks.push({ type: 'h3', text: h3[1] }); }
    else if (li) { flushPara(); blocks.push({ type: 'li', text: li[1] }); inList = true; }
    else if (line.trim() === '') { flushPara(); inList = false; }
    else { buffer.push(line.trim()); }
  });
  flushPara();
  return blocks;
}

function renderInline(text) {
  // **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

export default function Output() {
  const navigate = useNavigate();
  const { formData } = useForm();
  const [mode, setMode] = useState('prompt');
  const [feedback, setFeedback] = useState(null);

  // API integration state
  const [dossie, setDossie] = useState(null);
  const [apiMode, setApiMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const clientName = formData.clientName || 'Cliente';
  const designerName = formData.designerName || 'Designer';
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const baseSection = SECTIONS.find(s => s.block === 'dados-base');
  const reuniaoSections = SECTIONS.filter(s => s.block === 'reuniao');

  // Try to generate via API on mount
  useEffect(() => {
    let cancelled = false;
    const tryGenerate = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData })
        });
        if (!response.ok) throw new Error('API response not ok');
        const data = await response.json();
        if (cancelled) return;
        if (data.mode === 'api' && data.dossie) {
          setDossie(data.dossie);
          setApiMode(true);
        } else if (data.mode === 'fallback') {
          setApiError(data.error || 'API indisponivel');
        }
      } catch (err) {
        if (!cancelled) setApiError('API offline');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    tryGenerate();
    return () => { cancelled = true; };
  }, []);

  const showFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 1800);
  };

  const getExportText = () => {
    if (apiMode && dossie) {
      // In API mode, export the generated dossier
      const header = `DOSSIE DE IDENTIDADE VISUAL\n${clientName}\nGerado em ${dateStr} por ${designerName}\n${'='.repeat(50)}\n\n`;
      return header + dossie;
    }
    return mode === 'prompt' ? formatForClaude(formData) : formatDossieText(formData);
  };

  const handleDownload = () => {
    const text = getExportText();
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
    await copyToClipboard(getExportText());
    showFeedback('cp');
  };

  const renderedDossie = apiMode && dossie ? renderMarkdown(dossie) : null;

  return (
    <div className="output-screen">
      {/* NAV */}
      <nav className="out-nav">
        <button className="out-nav-back" onClick={() => navigate('/form')}>&larr; Voltar e editar</button>
        <div className="out-nav-brand">
          <div className="out-nav-v4">V4</div>
          <span>DNA Visual</span>
          {apiMode && <span className="out-nav-badge">Gerado pela IA</span>}
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

            {/* Loading state */}
            {loading && (
              <div className="dossie-loading">
                <div className="dossie-loading-spinner" />
                <div className="dossie-loading-text">Gerando dossi&ecirc; com IA...</div>
                <div className="dossie-loading-sub">Isso pode levar 15-30 segundos</div>
              </div>
            )}

            {/* API MODE: show generated dossier */}
            {!loading && apiMode && renderedDossie && (
              <div className="dossie-generated">
                {renderedDossie.map((block, i) => {
                  if (block.type === 'h1') return <h1 key={i} className="dg-h1">{renderInline(block.text)}</h1>;
                  if (block.type === 'h2') return <h2 key={i} className="dg-h2">{renderInline(block.text)}</h2>;
                  if (block.type === 'h3') return <h3 key={i} className="dg-h3">{renderInline(block.text)}</h3>;
                  if (block.type === 'li') return <div key={i} className="dg-li">{renderInline(block.text)}</div>;
                  return <p key={i} className="dg-p">{renderInline(block.text)}</p>;
                })}
              </div>
            )}

            {/* FALLBACK MODE: show raw form data */}
            {!loading && !apiMode && (
              <>
                {apiError && (
                  <div className="api-error-note">
                    <strong>Modo manual ativo.</strong> A IA n&atilde;o est&aacute; dispon&iacute;vel no momento. Use os bot&otilde;es ao lado para copiar e levar para outra IA.
                  </div>
                )}

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
              </>
            )}

          </div>
        </div>

        {/* RIGHT — DARK EXPORT PANEL */}
        <div className="export-col">
          <div className="export-header">
            <div className="export-title">Exportar Dossi&ecirc;</div>
            <div className="export-sub">
              {apiMode ? 'Dossi\u00ea profissional gerado pela IA' : 'Escolha o formato e o que incluir'}
            </div>
          </div>

          {/* Mode selector — only in fallback mode */}
          {!apiMode && (
            <div className="mode-sel">
              <div className={`mode-slider ${mode === 'simple' ? 'right' : ''}`} />
              <button className={`mode-btn ${mode === 'prompt' ? 'on' : ''}`} onClick={() => setMode('prompt')}>Com prompt IA</button>
              <button className={`mode-btn ${mode === 'simple' ? 'on' : ''}`} onClick={() => setMode('simple')}>S&oacute; respostas</button>
            </div>
          )}

          {/* Export cards */}
          <div className="export-cards">
            {/* Download */}
            <div className={`e-card primary ${loading ? 'off' : ''}`} onClick={!loading ? handleDownload : undefined}>
              <div className="e-card-top">
                <div className="e-card-icon">&darr;</div>
                <span className="e-tag rec">Recomendado</span>
              </div>
              <div className="e-card-title">Baixar Dossi&ecirc;</div>
              <div className="e-card-desc">
                {apiMode
                  ? 'Arquivo .md com o dossi\u00ea profissional gerado pela IA, pronto pra entregar.'
                  : 'Arquivo .md pronto pra jogar no Claude, ChatGPT ou qualquer IA e gerar o dossi\u00ea profissional.'}
              </div>
              <div className="e-card-action">Baixar .md <span className="arrow">&rarr;</span></div>
              {feedback === 'dl' && (
                <div className="e-fb show">
                  <div className="e-fb-check">&check;</div>
                  <div className="e-fb-text">Baixado!</div>
                </div>
              )}
            </div>

            {/* Copy */}
            <div className={`e-card ${loading ? 'off' : ''}`} onClick={!loading ? handleCopy : undefined}>
              <div className="e-card-top">
                <div className="e-card-icon">&#x2398;</div>
              </div>
              <div className="e-card-title">Copiar Texto</div>
              <div className="e-card-desc">
                {apiMode
                  ? 'Copia o dossi\u00ea gerado pra clipboard. Cole no Notion, Drive ou WhatsApp.'
                  : 'Copia tudo pra clipboard. Cole no Notion, Drive, e-mail ou WhatsApp.'}
              </div>
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
              <div className="e-card-desc">Dossi&ecirc; formatado, pronto pra apresentar.</div>
              <div className="e-card-action" style={{ opacity: 0.3 }}>Em breve <span className="arrow">&rarr;</span></div>
            </div>
          </div>

          <div className="export-footer">
            <div className="export-hint">
              {apiMode
                ? 'Dossi\u00ea completo gerado automaticamente. Baixe ou copie pra usar onde precisar.'
                : mode === 'prompt'
                  ? 'Inclui instru\u00e7\u00f5es que permitem qualquer IA gerar o dossi\u00ea profissional completo a partir das suas respostas.'
                  : 'Apenas perguntas e respostas organizadas, sem instru\u00e7\u00f5es de IA.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
