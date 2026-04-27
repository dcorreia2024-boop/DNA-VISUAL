import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import { formatDossieText, formatForClaude, copyToClipboard } from '../services/clipboard';
import DossieTemplate from '../components/DossieTemplate';
import ErrorBoundary from '../components/ErrorBoundary';
import './Output.css';

// Converte dossie JSON em markdown pra export
function dossieJsonToMarkdown(data) {
  if (!data) return '';
  const lines = [];
  lines.push(`# ${data.clientName || 'Cliente'} — Dossie de Identidade Visual\n`);
  if (data.segment || data.city) lines.push(`${data.segment || ''}${data.city ? ' | ' + data.city : ''}\n`);
  if (data.status) lines.push(`**Contexto:** ${data.status}\n`);

  lines.push('\n## 1. IDENTIDADE DA MARCA\n');
  if (data.positioning) lines.push(`> ${data.positioning}\n`);
  if (data.mission) lines.push(`**Missao:** ${data.mission}`);
  if (data.vision) lines.push(`**Visao:** ${data.vision}`);
  if (data.values) lines.push(`**Valores:** ${data.values}`);
  if (data.slogan) lines.push(`**Slogan:** "${data.slogan}"`);
  if (data.personality?.length) lines.push(`**Personalidade:** ${data.personality.join(' | ')}`);
  if (data.targetAge) lines.push(`\n**Publico:** ${data.targetAge}, ${data.targetGender || ''}, ${data.targetClass || ''}, ${data.targetLocation || ''}`);
  if (data.targetBehavior) lines.push(`**Comportamento:** ${data.targetBehavior}`);
  if (data.targetPain) lines.push(`**Dor:** ${data.targetPain}`);
  if (data.valueProposition) lines.push(`\n**Proposta de valor:** ${data.valueProposition}`);
  if (data.wantAssociations?.length) lines.push(`\n**Associar a:** ${data.wantAssociations.join(', ')}`);
  if (data.avoidAssociations?.length) lines.push(`**Evitar:** ${data.avoidAssociations.join(', ')}`);

  lines.push('\n## 2. DIRETRIZES VISUAIS\n');
  if (data.colors?.length) {
    lines.push('**Paleta de cores:**');
    data.colors.forEach(c => lines.push(`- ${c.name} (${c.hex}) — ${c.role}: ${c.usage}`));
  }
  if (data.typography?.length) {
    lines.push('\n**Tipografia:**');
    data.typography.forEach(t => lines.push(`- ${t.family} ${t.weight} — ${t.usage} (${t.status})`));
  }
  if (data.visualStyle?.length) {
    lines.push('\n**Estilo:** ' + data.visualStyle.map(s => s.adjective).join(', '));
    data.visualStyle.forEach(s => lines.push(`- ${s.adjective}: ${s.description}`));
  }
  if (data.graphicElements?.length) lines.push('\n**Elementos graficos:** ' + data.graphicElements.join(', '));
  if (data.visualDontDo?.length) {
    lines.push('\n**Nao fazer:**');
    data.visualDontDo.forEach(d => lines.push(`- ${d}`));
  }

  lines.push('\n## 3. TOM DE VOZ\n');
  if (data.voiceAdjectives?.length) data.voiceAdjectives.forEach(v => lines.push(`- **${v.word}:** ${v.description}`));
  if (data.communicationPersona) lines.push(`\n**Persona:** ${data.communicationPersona}`);
  if (data.copyOnBrand?.length) {
    lines.push('\n**Copy ON-BRAND:**');
    data.copyOnBrand.forEach(c => lines.push(`- ✓ ${c}`));
  }
  if (data.copyOffBrand?.length) {
    lines.push('\n**Copy OFF-BRAND:**');
    data.copyOffBrand.forEach(c => lines.push(`- ✗ ${c}`));
  }
  if (data.alwaysUseWords?.length) lines.push('\n**Sempre usar:** ' + data.alwaysUseWords.join(', '));
  if (data.neverUseWords?.length) lines.push('**Nunca usar:** ' + data.neverUseWords.join(', '));
  if (data.platformGuidelines?.length) {
    lines.push('\n**Por plataforma:**');
    data.platformGuidelines.forEach(p => lines.push(`- **${p.platform}:** ${p.guideline}`));
  }

  lines.push('\n## 4. CONCORRENTES\n');
  if (data.competitors?.length) {
    data.competitors.forEach(c => {
      lines.push(`### ${c.name} ${c.handle || ''} ${c.location ? '— ' + c.location : ''}`);
      lines.push(`- **Faz bem:** ${c.doWell}`);
      lines.push(`- **Faz mal:** ${c.doBad}`);
      lines.push(`- **Diferenciacao:** ${c.differentiation}\n`);
    });
  }
  if (data.visualReferences?.length) {
    lines.push('**Referencias visuais:**');
    data.visualReferences.forEach(r => lines.push(`- **${r.name}:** ${r.description}`));
  }

  lines.push('\n## 5. MATERIAIS E ATIVOS\n');
  if (data.existingAssets?.length) {
    lines.push('**Ja existe:**');
    data.existingAssets.forEach(a => lines.push(`- ✓ **${a.name}** — ${a.details}`));
  }
  if (data.assetsToCreate?.length) {
    lines.push('\n**Precisa ser criado:**');
    data.assetsToCreate.forEach(a => lines.push(`- [${a.priority}] **${a.name}** — ${a.details}`));
  }

  lines.push('\n## 6. HISTORICO\n');
  if (data.whatWorked) lines.push(`**Funcionou:** ${data.whatWorked.description} — *${data.whatWorked.why}*`);
  if (data.whatFailed) lines.push(`**Falhou:** ${data.whatFailed.description} — *${data.whatFailed.why}*`);
  if (data.currentMotivation) lines.push(`\n**Motivacao atual:** ${data.currentMotivation}`);
  if (data.strategicNotes) lines.push(`\n⚠ **Nota estrategica:** ${data.strategicNotes}`);

  lines.push('\n## 7. DIRECIONAMENTO POR ENTREGA\n');
  if (data.deliveryGuidelines?.length) {
    data.deliveryGuidelines.forEach(d => {
      lines.push(`### ${d.type}`);
      lines.push(`- **Objetivo:** ${d.objective}`);
      lines.push(`- **Direcao visual:** ${d.visualDirection}`);
      lines.push(`- **Evitar:** ${d.avoid}\n`);
    });
  }

  lines.push('\n## 8. CHECKLIST DO DESIGNER\n');
  if (data.immediateActions?.length) {
    lines.push('**Acoes imediatas:**');
    data.immediateActions.forEach(a => lines.push(`- [ ] ${a}`));
  }
  if (data.pendingItems?.length) {
    lines.push('\n**Pendencias:**');
    data.pendingItems.forEach(p => lines.push(`- **${p.item}** — ${p.details}`));
  }
  if (data.pendingQuestions?.length) {
    lines.push('\n**Perguntas pendentes:**');
    data.pendingQuestions.forEach(q => lines.push(`- ? ${q}`));
  }
  if (data.designerSummary) lines.push(`\n**Resumo:** ${data.designerSummary}`);

  return lines.join('\n');
}

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
  const location = useLocation();
  const { formData } = useForm();
  const [mode, setMode] = useState('prompt');
  const [feedback, setFeedback] = useState(null);

  // Se veio do fluxo de analise, usa dados temporarios do sessionStorage
  // (nao mistura com FormContext para nao contaminar o form ao vivo)
  const fromAnalysis = location.state?.fromAnalysis;
  const outputData = useMemo(() => {
    if (fromAnalysis) {
      try {
        return JSON.parse(sessionStorage.getItem('dna_temp_output_data') || '{}');
      } catch { return {}; }
    }
    return formData;
  }, [fromAnalysis, formData]);

  // API integration state
  const [dossie, setDossie] = useState(null);
  const [dossieFormat, setDossieFormat] = useState(null); // 'json' | 'text'
  const [apiMode, setApiMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const clientName = outputData.clientName || 'Cliente';
  const designerName = outputData.designerName || 'Designer';
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const baseSection = SECTIONS.find(s => s.block === 'dados-base');
  const reuniaoSections = SECTIONS.filter(s => s.block === 'reuniao');

  // Try to generate via API on mount (timeout 120s — Llama 3.3 70B free leva 60-90s tipico)
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000);

    const tryGenerate = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData: outputData }),
          signal: controller.signal
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (cancelled) return;
        if (data.mode === 'api' && data.dossie && data.format === 'json' && typeof data.dossie === 'object') {
          setDossie(data.dossie);
          setDossieFormat('json');
          setApiMode(true);
        } else if (data.mode === 'api' && data.format === 'text' && typeof data.dossie === 'string') {
          // IA retornou markdown em vez de JSON — ainda mostra, so nao usa template visual
          setDossie(data.dossie);
          setDossieFormat('text');
          setApiMode(true);
        } else if (data.mode === 'fallback') {
          setApiError(data.error || 'API indispon\u00edvel');
        } else if (data.mode === 'local') {
          setApiError('API n\u00e3o configurada. Modo manual ativo.');
        }
      } catch (err) {
        if (cancelled) return;
        if (err.name === 'AbortError') {
          setApiError('A gera\u00e7\u00e3o demorou mais de 3 minutos. Clique em "Tentar novamente" ou use o modo manual.');
        } else {
          setApiError('API indispon\u00edvel. ' + (err.message || 'Usando modo manual.'));
        }
      } finally {
        clearTimeout(timeoutId);
        if (!cancelled) setLoading(false);
      }
    };
    tryGenerate();
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [retryCount]);

  const handleRetry = () => {
    setApiMode(false);
    setDossie(null);
    setDossieFormat(null);
    setRetryCount(c => c + 1);
  };

  const showFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 1800);
  };

  const getExportText = () => {
    if (apiMode && dossie) {
      const header = `DOSSIE DE IDENTIDADE VISUAL\n${clientName}\nGerado em ${dateStr} por ${designerName}\n${'='.repeat(50)}\n\n`;
      if (dossieFormat === 'json') return header + dossieJsonToMarkdown(dossie);
      return header + dossie; // text format
    }
    return mode === 'prompt' ? formatForClaude(outputData) : formatDossieText(outputData);
  };

  const handleDownload = () => {
    const text = getExportText();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (outputData.clientCompany || clientName || 'cliente')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    a.download = `dossie-${safeName || 'cliente'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('dl');
  };

  const handleCopy = async () => {
    await copyToClipboard(getExportText());
    showFeedback('cp');
  };

  const handleGeneratePDF = async () => {
    const element = document.getElementById('dossie-content');
    if (!element) return;

    const safeName = (outputData.clientCompany || clientName || 'cliente')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `dossie-${safeName || 'cliente'}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    showFeedback('pdf');
    // Dynamic import — html2pdf e ~350KB, so carrega se clicar
    const { default: html2pdf } = await import('html2pdf.js');
    html2pdf().set(opt).from(element).save();
  };

  const renderedDossie = apiMode && dossie && dossieFormat === 'text' && typeof dossie === 'string' ? renderMarkdown(dossie) : null;

  return (
    <div className="output-screen">
      {/* NAV */}
      <nav className="out-nav">
        <button className="out-nav-back" onClick={() => navigate(fromAnalysis ? '/result' : '/form')}>&larr; Voltar e editar</button>
        <div className="out-nav-brand">
          <div className="out-nav-v4">V4</div>
          <span>DNA Visual</span>
          {apiMode && <span className="out-nav-badge">Gerado pela IA</span>}
        </div>
      </nav>

      <div className="out-layout">
        {/* LEFT — WHITE DOCUMENT */}
        <div className="doc-col">
         <div id="dossie-content">
          {/* API MODE with JSON: render visual template (no doc-inner padding) */}
          {!loading && apiMode && dossieFormat === 'json' && dossie && typeof dossie === 'object' && (
            <ErrorBoundary>
              <DossieTemplate
                data={dossie}
                clientName={clientName}
                designerName={designerName}
                dateStr={dateStr}
              />
            </ErrorBoundary>
          )}

          {/* Other modes: use the old doc-inner layout */}
          {(loading || !apiMode || dossieFormat !== 'json') && (
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
                <div className="dossie-loading-sub">Pode levar at&eacute; 2-3 minutos (gerando JSON estruturado completo)</div>
              </div>
            )}

            {/* API MODE with TEXT format: show markdown rendered */}
            {!loading && apiMode && dossieFormat === 'text' && renderedDossie && (
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
                    <strong>Modo manual ativo.</strong> {apiError}
                    <button
                      onClick={handleRetry}
                      style={{
                        marginLeft: 12,
                        padding: '6px 14px',
                        background: 'var(--red, #C0392B)',
                        color: '#fff',
                        border: 'none',
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        cursor: 'pointer',
                        verticalAlign: 'middle'
                      }}
                    >Tentar novamente</button>
                  </div>
                )}

                {baseSection && (
                  <div className="client-grid">
                    <div className="client-grid-title">Dados Base do Cliente</div>
                    <div className="client-data">
                      {baseSection.fields.map(f => (
                        <div className="client-item" key={f.key}>
                          <span className="client-label">{f.label.split('(')[0].split('\u2014')[0].trim()}</span>
                          <span className={`client-value ${(outputData[f.key] || '').trim() ? '' : 'empty'}`}>
                            {(outputData[f.key] || '').trim() || '\u2014'}
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
                        const val = (outputData[f.key] || '').trim();
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
          )}
         </div>{/* /#dossie-content */}
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
                  <div className="e-fb-check">&#10003;</div>
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
                  <div className="e-fb-check">&#10003;</div>
                  <div className="e-fb-text">Copiado!</div>
                </div>
              )}
            </div>

            {/* PDF — ativo */}
            <div className={`e-card ${loading ? 'off' : ''}`} onClick={!loading ? handleGeneratePDF : undefined}>
              <div className="e-card-top">
                <div className="e-card-icon">&#9674;</div>
              </div>
              <div className="e-card-title">Gerar PDF</div>
              <div className="e-card-desc">Exporta o dossi&ecirc; como PDF pronto pra apresentar ao time ou ao cliente.</div>
              <div className="e-card-action">Exportar PDF <span className="arrow">&rarr;</span></div>
              {feedback === 'pdf' && (
                <div className="e-fb show">
                  <div className="e-fb-check">&#10003;</div>
                  <div className="e-fb-text">PDF gerado!</div>
                </div>
              )}
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
