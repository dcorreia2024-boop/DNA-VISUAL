import './DossieTemplate.css';

const arr = (v) => (Array.isArray(v) ? v : []);
const safe = (v, fallback = '') => (v == null || v === '' ? fallback : v);

// Permite renderizar HTML simples (br, em, strong) que vem da IA dentro de campos como clientName
function HtmlText({ html, className }) {
  if (!html) return null;
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// Substitui o italicPart no nome da cor por <em>
function SwatchName({ name, italicPart }) {
  if (!name) return null;
  if (!italicPart || !name.includes(italicPart)) {
    return <>{name}</>;
  }
  const before = name.split(italicPart)[0];
  return <>{before}<em>{italicPart}</em></>;
}

export default function DossieTemplate({ data, clientName: fallbackClientName, designerName: fallbackDesignerName, dateStr }) {
  if (!data) return null;

  const clientName = data.clientName || fallbackClientName || 'Cliente';
  const designerName = data.designerName || fallbackDesignerName || 'Designer';
  const date = data.date || dateStr || '';

  const clientColors = {
    '--c-primary': data.colors?.[0]?.hex || '#2C5F9E',
    '--c-secondary': data.colors?.[1]?.hex || '#6BB04C',
    '--c-neutral': data.colors?.[3]?.hex || data.colors?.[2]?.hex || '#1A2B3C',
    '--c-accent': data.colors?.[2]?.hex || '#F5F3EE',
  };

  return (
    <div id="dossie-content" className="dossie-template" style={clientColors}>

      {/* COVER */}
      <section className="dt-cover">
        <div className="dt-cover-top">
          <div className="dt-cover-edition">
            {data.edition || 'Volume 01'}<br />
            <span>Brand Foundation Document</span>
          </div>
          <div className="dt-cover-v4-mark">V4 &middot; Identity</div>
        </div>
        <div className="dt-cover-main">
          <div className="dt-cover-eyebrow">Dossi&ecirc; de Identidade</div>
          <h1 className="dt-cover-name">
            <HtmlText html={clientName} />
          </h1>
          {data.tagline && <p className="dt-cover-tagline">{data.tagline}</p>}
        </div>
        <div className="dt-cover-bottom">
          <div className="dt-cover-meta-item">
            <span className="dt-cover-meta-label">Cliente</span>
            <span className="dt-cover-meta-value">{(clientName || '').replace(/<[^>]+>/g, '').replace(/<br>/g, ' ')}</span>
          </div>
          <div className="dt-cover-meta-item">
            <span className="dt-cover-meta-label">Segmento</span>
            <span className="dt-cover-meta-value">{data.segment || '—'}</span>
          </div>
          <div className="dt-cover-meta-item">
            <span className="dt-cover-meta-label">Designer</span>
            <span className="dt-cover-meta-value">{designerName}</span>
          </div>
          <div className="dt-cover-meta-item">
            <span className="dt-cover-meta-label">Edi&ccedil;&atilde;o</span>
            <span className="dt-cover-meta-value">{date}</span>
          </div>
        </div>
      </section>

      {/* INDEX */}
      <section className="dt-index">
        <div className="dt-index-eyebrow">Sum&aacute;rio</div>
        <h2 className="dt-index-title">Oito cap&iacute;tulos para <em>guiar</em> o designer<br />do briefing &agrave; entrega.</h2>
        <div className="dt-index-grid">
          {[
            ['01', 'Identidade da Marca'],
            ['02', 'Diretrizes Visuais'],
            ['03', 'Tom de Voz'],
            ['04', 'Concorrentes'],
            ['05', 'Materiais e Ativos'],
            ['06', 'Histórico e Aprendizados'],
            ['07', 'Direcionamento por Entrega'],
            ['08', 'Checklist do Designer'],
          ].map(([num, label]) => (
            <div className="dt-index-item" key={num}>
              <span className="dt-index-num">{num}</span>
              <span className="dt-index-text">{label}</span>
              <span className="dt-index-arrow">&rarr;</span>
            </div>
          ))}
        </div>
      </section>

      {/* 01 IDENTIDADE */}
      <section className="dt-section">
        <SectionHeader num="1" chapter="Capítulo Um" title={<>Identidade<br />da <em>Marca</em></>} intro="Quem é, o que defende, para quem fala e onde quer chegar." />
        <div className="dt-content-area">
          {data.positioning && (
            <div className="dt-statement">"{data.positioning}"</div>
          )}

          {(data.mission || data.vision || data.values) && (
            <div className="dt-card-grid">
              {data.mission && <Card num="i." title="Missão" content={data.mission} />}
              {data.vision && <Card num="ii." title="Visão" content={data.vision} />}
              {data.values && <Card num="iii." title="Valores" content={data.values} />}
            </div>
          )}

          {arr(data.personality).length > 0 && (
            <div>
              <div className="dt-block-label">Personalidade da Marca</div>
              <div className="dt-personality-row">
                {arr(data.personality).slice(0, 3).map((p, i) => (
                  <div className="dt-personality-cell" key={i}>
                    <div className="dt-personality-word">
                      {p.italic ? <em>{p.word}</em> : p.word}
                    </div>
                    <div className="dt-personality-meaning">{p.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(data.primaryAudience || data.secondaryAudience) && (
            <div className="dt-two-col">
              {data.primaryAudience && (
                <div>
                  <div className="dt-block-label">Público-Alvo Primário</div>
                  <div className="dt-audience" dangerouslySetInnerHTML={{ __html: data.primaryAudience }} />
                </div>
              )}
              {data.secondaryAudience && (
                <div>
                  <div className="dt-block-label">Público-Alvo Secundário (B2B)</div>
                  <div className="dt-audience" dangerouslySetInnerHTML={{ __html: data.secondaryAudience }} />
                </div>
              )}
            </div>
          )}

          {arr(data.wantAssociations).length > 0 && (
            <div>
              <div className="dt-block-label">Associa&ccedil;&otilde;es Desejadas <span className="dt-block-label-aux">/ Quero ser visto como</span></div>
              <div className="dt-tag-group">
                {arr(data.wantAssociations).map((t, i) => (<span className="dt-tag dt-tag-positive" key={i}>{t}</span>))}
              </div>
            </div>
          )}

          {arr(data.avoidAssociations).length > 0 && (
            <div>
              <div className="dt-block-label">Associa&ccedil;&otilde;es a Evitar <span className="dt-block-label-aux">/ Nunca quero parecer</span></div>
              <div className="dt-tag-group">
                {arr(data.avoidAssociations).map((t, i) => (<span className="dt-tag dt-tag-negative" key={i}>{t}</span>))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 02 DIRETRIZES VISUAIS */}
      <section className="dt-section dt-section-alt">
        <SectionHeader num="2" chapter="Capítulo Dois" title={<>Diretrizes<br /><em>Visuais</em></>} intro="A paleta, a tipografia e o estilo que traduzem a marca em cada peça." />
        <div className="dt-content-area">

          {arr(data.colors).length > 0 && (
            <div>
              <div className="dt-block-label">Paleta Crom&aacute;tica</div>
              <div className="dt-palette">
                {arr(data.colors).slice(0, 4).map((c, i) => (
                  <div className={`dt-swatch ${c.isLight ? 'light' : ''}`} style={{ background: c.hex }} key={i}>
                    <div className="dt-swatch-name"><SwatchName name={c.name} italicPart={c.italicPart} /></div>
                    <div className="dt-swatch-hex">{c.hex}</div>
                    <div className="dt-swatch-role">{c.role}</div>
                    <div className="dt-swatch-meta">
                      <div className="dt-swatch-usage">{c.usage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {arr(data.typography).length > 0 && (
            <div>
              <div className="dt-block-label">Tipografia</div>
              {arr(data.typography).map((t, i) => (
                <div className="dt-type-specimen" key={i}>
                  <div
                    className="dt-type-display"
                    style={{ fontFamily: t.fontStack || `'${t.family}', sans-serif`, fontSize: i === 0 ? undefined : 48 }}
                    dangerouslySetInnerHTML={{ __html: t.display }}
                  />
                  <div className="dt-type-info">
                    <div><div className="dt-type-info-label">Fam&iacute;lia</div><div className="dt-type-info-value">{t.family}</div></div>
                    <div><div className="dt-type-info-label">Peso</div><div className="dt-type-info-value">{t.weight}</div></div>
                    <div><div className="dt-type-info-label">Uso</div><div className="dt-type-info-value">{t.usage}</div></div>
                    <div><div className="dt-type-info-label">Status</div><div className="dt-type-info-value">{t.status}</div></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {arr(data.visualStyle).length > 0 && (
            <div>
              <div className="dt-block-label">Estilo Visual</div>
              <div className="dt-card-grid">
                {arr(data.visualStyle).map((s, i) => (
                  <Card key={i} num={['i.', 'ii.', 'iii.', 'iv.'][i] || `${i + 1}.`} title={s.adjective} content={s.description} />
                ))}
              </div>
            </div>
          )}

          {arr(data.visualDontDo).length > 0 && (
            <div>
              <div className="dt-block-label">O que Evitar</div>
              <div className="dt-tag-group">
                {arr(data.visualDontDo).map((t, i) => (<span className="dt-tag dt-tag-negative" key={i}>{t}</span>))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 03 TOM DE VOZ */}
      <section className="dt-section">
        <SectionHeader num="3" chapter="Capítulo Três" title={<>Tom de <em>Voz</em></>} intro="Como a marca fala, escreve e responde — em qualquer canal, em qualquer hora." />
        <div className="dt-content-area">
          {data.voicePersonaQuote && (<div className="dt-statement">"{data.voicePersonaQuote}"</div>)}

          {(arr(data.copyOnBrand).length > 0 || arr(data.copyOffBrand).length > 0) && (
            <div>
              <div className="dt-block-label">Compara&ccedil;&atilde;o ON-Brand &times; OFF-Brand</div>
              <div className="dt-copy-compare">
                {arr(data.copyOnBrand).length > 0 && (
                  <div className="dt-copy-col">
                    <div className="dt-copy-col-header">
                      <div className="dt-copy-mark on">&#10003;</div>
                      <div className="dt-copy-col-title">Como falamos</div>
                    </div>
                    <div className="dt-copy-list">
                      {arr(data.copyOnBrand).map((c, i) => (<div className="dt-copy-item on" key={i}>{c}</div>))}
                    </div>
                  </div>
                )}
                {arr(data.copyOffBrand).length > 0 && (
                  <div className="dt-copy-col">
                    <div className="dt-copy-col-header">
                      <div className="dt-copy-mark off">&times;</div>
                      <div className="dt-copy-col-title">Como N&Atilde;O falamos</div>
                    </div>
                    <div className="dt-copy-list">
                      {arr(data.copyOffBrand).map((c, i) => (<div className="dt-copy-item off" key={i}>{c}</div>))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="dt-two-col">
            {arr(data.alwaysUseWords).length > 0 && (
              <div>
                <div className="dt-block-label">Sempre Usar</div>
                <div className="dt-tag-group">
                  {arr(data.alwaysUseWords).map((w, i) => (<span className="dt-tag dt-tag-positive" key={i}>{w}</span>))}
                </div>
              </div>
            )}
            {arr(data.neverUseWords).length > 0 && (
              <div>
                <div className="dt-block-label">Nunca Usar</div>
                <div className="dt-tag-group">
                  {arr(data.neverUseWords).map((w, i) => (<span className="dt-tag dt-tag-negative" key={i}>{w}</span>))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 04 CONCORRENTES */}
      <section className="dt-section dt-section-alt">
        <SectionHeader num="4" chapter="Capítulo Quatro" title={<>Concorrentes &amp;<br /><em>Refer&ecirc;ncias</em></>} intro="O que o mercado faz, o que o cliente faz diferente." />
        <div className="dt-content-area">
          {arr(data.competitors).map((c, i) => (
            <div className="dt-competitor" key={i}>
              <div className="dt-competitor-head">
                <div className="dt-competitor-name">{c.name}</div>
                <div className="dt-competitor-handle">{c.handle}</div>
              </div>
              <div className="dt-competitor-body">
                <div className="dt-competitor-cell">
                  <div className="dt-competitor-cell-label">Faz Bem</div>
                  <p className="dt-competitor-cell-text">{c.doWell}</p>
                </div>
                <div className="dt-competitor-cell">
                  <div className="dt-competitor-cell-label">Faz Mal</div>
                  <p className="dt-competitor-cell-text">{c.doBad}</p>
                </div>
                <div className="dt-competitor-cell">
                  <div className="dt-competitor-cell-label">Como Diferenciamos</div>
                  <p className="dt-competitor-cell-text">{c.differentiation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 MATERIAIS */}
      <section className="dt-section">
        <SectionHeader num="5" chapter="Capítulo Cinco" title={<>Materiais &amp;<br /><em>Ativos</em></>} intro="O que o cliente já tem nas mãos. O que precisa ser criado, em que ordem." />
        <div className="dt-content-area">
          {arr(data.existingAssets).length > 0 && (
            <div>
              <div className="dt-block-label">J&aacute; Existe</div>
              <div className="dt-asset-list">
                {arr(data.existingAssets).map((a, i) => (
                  <div className="dt-asset-item" key={i}>
                    <div className="dt-asset-icon has">&#10003;</div>
                    <div className="dt-asset-content">
                      <div className="dt-asset-title">{a.name}</div>
                      <div className="dt-asset-detail">{a.details}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {arr(data.assetsToCreate).length > 0 && (
            <div>
              <div className="dt-block-label">Precisa Ser Criado</div>
              <div className="dt-asset-list">
                {arr(data.assetsToCreate).map((a, i) => {
                  const prio = (a.priority || '').toLowerCase();
                  const iconClass = prio === 'alta' ? 'high' : prio === 'baixa' ? 'low' : 'medium';
                  const arrow = prio === 'alta' ? '↑' : prio === 'baixa' ? '·' : '→';
                  const prioLabel = prio === 'alta' ? 'Alta' : prio === 'baixa' ? 'Baixa' : 'Média';
                  return (
                    <div className="dt-asset-item" key={i}>
                      <div className={`dt-asset-icon ${iconClass}`}>{arrow}</div>
                      <div className="dt-asset-content">
                        <div className="dt-asset-title">{a.name}</div>
                        <div className="dt-asset-detail">{a.details}</div>
                      </div>
                      <div className={`dt-asset-priority ${iconClass}`}>{prioLabel}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 06 HISTORICO */}
      <section className="dt-section dt-section-dark">
        <SectionHeader num="6" chapter="Capítulo Seis" title={<>Hist&oacute;rico &amp;<br /><em>Aprendizados</em></>} intro="O que já foi tentado, o que funcionou, o que falhou — e por quê." />
        <div className="dt-content-area">
          {(data.whatWorked || data.whatFailed) && (
            <div className="dt-history-grid">
              {data.whatWorked && (
                <div className="dt-history-cell success">
                  <div className="dt-history-cell-label">Funcionou</div>
                  <div className="dt-history-cell-what">"{data.whatWorked.what}"</div>
                  {data.whatWorked.why && <div className="dt-history-cell-why">Por qu&ecirc;: {data.whatWorked.why}</div>}
                </div>
              )}
              {data.whatFailed && (
                <div className="dt-history-cell failure">
                  <div className="dt-history-cell-label">N&atilde;o Funcionou</div>
                  <div className="dt-history-cell-what">"{data.whatFailed.what}"</div>
                  {data.whatFailed.why && <div className="dt-history-cell-why">Por qu&ecirc;: {data.whatFailed.why}</div>}
                </div>
              )}
            </div>
          )}

          {data.strategicNote && (
            <div className="dt-note dt-note-dark">
              <div className="dt-note-label">Nota Estrat&eacute;gica</div>
              <div className="dt-note-text" dangerouslySetInnerHTML={{ __html: data.strategicNote }} />
            </div>
          )}
        </div>
      </section>

      {/* 07 ENTREGAS */}
      <section className="dt-section">
        <SectionHeader num="7" chapter="Capítulo Sete" title={<>Direcionamento<br />por <em>Entrega</em></>} intro="Como aplicar a marca em cada formato — sem perder coerência." />
        <div className="dt-content-area">
          {arr(data.deliveries).map((d, i) => (
            <div className="dt-delivery" key={i}>
              <div className="dt-delivery-head">
                <div className="dt-delivery-type">{d.type}</div>
                {d.meta && <div className="dt-delivery-meta">{d.meta}</div>}
              </div>
              <div className="dt-delivery-body">
                <div className="dt-delivery-cell">
                  <div className="dt-delivery-cell-label">Objetivo</div>
                  <p className="dt-delivery-cell-text">{d.objective}</p>
                </div>
                <div className="dt-delivery-cell">
                  <div className="dt-delivery-cell-label">Dire&ccedil;&atilde;o Visual</div>
                  <p className="dt-delivery-cell-text">{d.visualDirection}</p>
                </div>
                <div className="dt-delivery-cell">
                  <div className="dt-delivery-cell-label">Evitar</div>
                  <p className="dt-delivery-cell-text">{d.avoid}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 08 CHECKLIST */}
      <section className="dt-section dt-section-alt">
        <SectionHeader num="8" chapter="Capítulo Oito" title={<>Checklist do<br /><em>Designer</em></>} intro="O que pode começar hoje, o que está pendente, o que precisa ser perguntado." />
        <div className="dt-content-area">
          {arr(data.immediateActions).length > 0 && (
            <div>
              <div className="dt-block-label">A&ccedil;&otilde;es Imediatas</div>
              <div className="dt-checklist">
                {arr(data.immediateActions).map((a, i) => (
                  <div className="dt-check-item" key={i}>
                    <div className="dt-check-box" />
                    <div className="dt-check-text">{a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.operationalNote && (
            <div>
              <div className="dt-block-label">Pend&ecirc;ncias Operacionais <span className="dt-block-label-aux">/ n&atilde;o &eacute; design, mas afeta</span></div>
              <div className="dt-note">
                <div className="dt-note-label">Aten&ccedil;&atilde;o</div>
                <div className="dt-note-text">{data.operationalNote}</div>
              </div>
            </div>
          )}

          {arr(data.pendingQuestions).length > 0 && (
            <div>
              <div className="dt-block-label">Perguntas para o Cliente</div>
              <div className="dt-checklist">
                {arr(data.pendingQuestions).map((q, i) => (
                  <div className="dt-check-item" key={i}>
                    <div className="dt-check-box" />
                    <div className="dt-check-text">{q}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FINAL SUMMARY */}
      {data.designerSummary && (
        <div className="dt-final-summary">
          <div className="dt-final-eyebrow">S&iacute;ntese para o Designer</div>
          <p className="dt-final-text">"{data.designerSummary}"</p>
        </div>
      )}

      {/* FOOTER */}
      <footer className="dt-doc-footer">
        <span>DNA Visual &middot; V4 Ruston &amp; Co.</span>
        <span>{data.edition || 'Vol. 01'} &middot; {date} &middot; Designer: {designerName}</span>
      </footer>
    </div>
  );
}

function SectionHeader({ num, chapter, title, intro }) {
  return (
    <div className="dt-section-header">
      <div className="dt-section-num-block">
        <span className="dt-section-num">0<em>{num}</em></span>
        <div className="dt-section-num-label">{chapter}</div>
      </div>
      <div className="dt-section-title-block">
        <h2 className="dt-section-title">{title}</h2>
        {intro && <p className="dt-section-intro">{intro}</p>}
      </div>
    </div>
  );
}

function Card({ num, title, content }) {
  return (
    <div className="dt-card">
      <div className="dt-card-num">{num}</div>
      <div className="dt-card-title">{title}</div>
      <p className="dt-card-content">{content}</p>
    </div>
  );
}
