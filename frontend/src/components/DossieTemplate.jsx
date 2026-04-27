import './DossieTemplate.css';

// Algoritmo WCAG: calcula luminance e retorna branco ou preto pra contraste
function getContrastText(hex) {
  if (!hex || typeof hex !== 'string') return '#FFFFFF';
  const c = hex.replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#FFFFFF';
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1A1A1A' : '#FFFFFF';
}

const arr = (v) => (Array.isArray(v) ? v : []);

// Renderiza HTML simples (em, strong, br) que vem do JSON
function HtmlText({ html, tag: Tag = 'span', className }) {
  if (!html) return null;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// Numero do capitulo: primeira parte normal, segunda em italico (ex: "0" + <em>"1"</em>)
function ChapterNum({ num }) {
  const s = String(num).padStart(2, '0').slice(0, 2);
  return <>{s.charAt(0)}<em>{s.charAt(1)}</em></>;
}

export default function DossieTemplate({ data, clientName: fbName, designerName: fbDesigner, dateStr }) {
  if (!data) return null;

  const colors = data.colors || {};
  const primary = colors.primary || data.palette?.[0]?.hex || '#2C5F9E';
  const secondary = colors.secondary || data.palette?.[1]?.hex || '#6BB04C';
  const neutral = colors.neutral || data.palette?.[2]?.hex || '#1A2B3C';
  const accent = colors.accent || data.palette?.[3]?.hex || '#F5F3EE';

  const styleVars = {
    '--c-primary': primary,
    '--c-secondary': secondary,
    '--c-neutral': neutral,
    '--c-accent': accent,
    '--c-primary-text': getContrastText(primary),
    '--c-secondary-text': getContrastText(secondary),
    '--c-neutral-text': getContrastText(neutral),
    '--c-accent-text': getContrastText(accent),
  };

  const clientName = data.clientName || fbName || 'Cliente';
  const nameRaw = data.nameRaw || (clientName || '').replace(/<[^>]+>/g, '');
  const designer = data.designer || fbDesigner || 'Designer';
  const date = data.date || dateStr || '';

  return (
    <div id="dossie-content" className="dossie-template" style={styleVars}>

      {/* COVER */}
      <section className="dt-cover">
        <div className="dt-cover-masthead">
          <div className="dt-masthead-l">
            <span className="dt-masthead-edition">DNA Visual &middot; {data.edition || 'VOL. 01'}</span>
            <span className="dt-masthead-issue">{data.issue || 'NO. 0001'} &middot; {date}</span>
          </div>
          <div className="dt-masthead-r">Brand Foundation Document<br /><em>An editorial dossier by V4 Ruston &amp; Co.</em></div>
        </div>
        <div className="dt-cover-main">
          <div className="dt-cover-eyebrow">Dossi&ecirc; de Identidade</div>
          <HtmlText html={clientName} tag="h1" className="dt-cover-name" />
          {data.tagline && <p className="dt-cover-tagline">{data.tagline}</p>}
        </div>
        <div className="dt-cover-footer">
          <div className="dt-meta-block"><span className="dt-meta-label">Cliente</span><span className="dt-meta-value">{nameRaw}</span></div>
          <div className="dt-meta-block"><span className="dt-meta-label">Segmento</span><span className="dt-meta-value">{data.segment || '—'}</span></div>
          <div className="dt-meta-block"><span className="dt-meta-label">Localiza&ccedil;&atilde;o</span><span className="dt-meta-value">{data.location || 'Brasil'}</span></div>
          <div className="dt-meta-block"><span className="dt-meta-label">Designer</span><span className="dt-meta-value">{designer}</span></div>
        </div>
      </section>

      {/* INDEX */}
      <section className="dt-index">
        <div className="dt-index-head">
          <div className="dt-index-mark">i.</div>
          <h2 className="dt-index-title">Oito cap&iacute;tulos para <em>guiar</em><br />do briefing &agrave; entrega.</h2>
        </div>
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
          ].map(([n, t], i) => (
            <div className="dt-index-item" key={n}>
              <span className="dt-index-num">{n}</span>
              <span className="dt-index-text">{t}</span>
              <span className="dt-index-pages">P. {(i + 1) * 4}</span>
              <span className="dt-index-arrow">&rarr;</span>
            </div>
          ))}
        </div>
      </section>

      {/* 01 IDENTIDADE */}
      <Chapter num="01" overline="Capítulo Um · Brand Identity" title={<>Identidade<br />da <em>Marca</em></>} intro="Quem é, o que defende, para quem fala e onde quer chegar. Os fundamentos que vão guiar toda decisão visual nos próximos capítulos.">
        {data.pullquote && (
          <div className="dt-pullquote">
            <p className="dt-pullquote-text">{data.pullquote}</p>
          </div>
        )}

        {(data.mission || data.vision || data.values) && (
          <div>
            <div className="dt-block-label">Os tr&ecirc;s pilares</div>
            <div className="dt-card-grid">
              {data.mission && <PillarCard roman="i." eyebrow="Missão" title="A razão de existir" text={data.mission} />}
              {data.vision && <PillarCard roman="ii." eyebrow="Visão" title="Onde quer chegar" text={data.vision} />}
              {data.values && <PillarCard roman="iii." eyebrow="Valores" title="O que defende" text={data.values} html />}
            </div>
          </div>
        )}

        {arr(data.personality).length > 0 && (
          <div>
            <div className="dt-block-label">Personalidade da marca</div>
            <div className="dt-personality">
              {arr(data.personality).map((p, i) => (
                <div className="dt-pers-cell" key={i}>
                  <div className="dt-pers-word">
                    {p.italic ? <em>{p.word}</em> : p.word}
                  </div>
                  <div className="dt-pers-meaning">{p.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.primaryAudience || data.secondaryAudience) && (
          <div className="dt-split">
            {data.primaryAudience && (
              <div>
                <div className="dt-block-label">P&uacute;blico prim&aacute;rio</div>
                <HtmlText html={data.primaryAudience} tag="p" className="dt-lead" />
              </div>
            )}
            {data.secondaryAudience && (
              <div>
                <div className="dt-block-label">P&uacute;blico secund&aacute;rio</div>
                <HtmlText html={data.secondaryAudience} tag="p" className="dt-lead" />
              </div>
            )}
          </div>
        )}

        <div className="dt-split-tight">
          {arr(data.wantTags).length > 0 && (
            <div>
              <div className="dt-block-label">Quero ser visto como <span className="dt-label-aside">— associa&ccedil;&otilde;es desejadas</span></div>
              <div className="dt-tag-row">
                {arr(data.wantTags).map((t, i) => <span className="dt-tag dt-tag-pos" key={i}>{t}</span>)}
              </div>
            </div>
          )}
          {arr(data.avoidTags).length > 0 && (
            <div>
              <div className="dt-block-label">Nunca quero parecer <span className="dt-label-aside">— associa&ccedil;&otilde;es a evitar</span></div>
              <div className="dt-tag-row">
                {arr(data.avoidTags).map((t, i) => <span className="dt-tag dt-tag-neg" key={i}>{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </Chapter>

      {/* 02 DIRETRIZES VISUAIS */}
      <Chapter num="02" overline="Capítulo Dois · Visual Guidelines" title={<>Diretrizes<br /><em>Visuais</em></>} intro="A paleta, a tipografia e o estilo que traduzem a marca em cada peça. Tudo com aplicação prática — pense no designer abrindo o Figma amanhã." modifier="dt-chapter-alt">
        {arr(data.palette).length > 0 && (
          <div className="dt-palette-block">
            <div className="dt-block-label">Paleta crom&aacute;tica</div>
            <div className="dt-palette">
              {arr(data.palette).map((color, i) => (
                <div
                  className="dt-swatch"
                  key={i}
                  style={{ background: color.hex, color: getContrastText(color.hex) }}
                >
                  <div className="dt-swatch-name">
                    {color.name} {color.italicPart && <em>{color.italicPart}</em>}
                  </div>
                  <div className="dt-swatch-hex">{color.hex}</div>
                  <div className="dt-swatch-role">{color.role}</div>
                  <div className="dt-swatch-meta">
                    <div className="dt-swatch-usage">{color.usage}</div>
                  </div>
                </div>
              ))}
            </div>
            {arr(data.palette).some(c => c.proportion) && (
              <div className="dt-ratio-block">
                <div className="dt-ratio-bar">
                  {arr(data.palette).map((color, i) => (
                    <div className="dt-ratio-segment" key={i} style={{ background: color.hex, width: `${color.proportion || 0}%` }} />
                  ))}
                </div>
                <div className="dt-ratio-legend">
                  {arr(data.palette).map((color, i) => (
                    <div className="dt-ratio-legend-item" key={i}>
                      <span className="dt-ratio-dot" style={{ background: color.hex }} />
                      <span>{color.name} {color.proportion}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {arr(data.typography).length > 0 && (
          <div>
            <div className="dt-block-label">Tipografia</div>
            {arr(data.typography).map((t, i) => (
              <div className="dt-specimen" key={i}>
                <div className="dt-specimen-mark">{i === 0 ? 'Display · Headline' : 'Body · UI'}</div>
                <div
                  className="dt-specimen-display"
                  style={{ fontFamily: `'${t.family}', ${t.isSerif ? 'serif' : 'sans-serif'}` }}
                  dangerouslySetInnerHTML={{ __html: t.display }}
                />
                <div className="dt-specimen-meta">
                  <div className="dt-spec-item"><span className="dt-spec-label">Fam&iacute;lia</span><span className="dt-spec-value">{t.family}</span></div>
                  <div className="dt-spec-item"><span className="dt-spec-label">Peso</span><span className="dt-spec-value">{t.weight}</span></div>
                  <div className="dt-spec-item"><span className="dt-spec-label">Uso</span><span className="dt-spec-value">{t.usage}</span></div>
                  <div className="dt-spec-item"><span className="dt-spec-label">Status</span><span className="dt-spec-value">{t.status}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {arr(data.visualStyle).length > 0 && (
          <div>
            <div className="dt-block-label">Estilo visual</div>
            <div className="dt-card-grid">
              {arr(data.visualStyle).map((s, i) => (
                <PillarCard key={i} roman={['i.', 'ii.', 'iii.', 'iv.'][i] || `${i+1}.`} eyebrow={`Princípio ${i + 1}`} title={s.adjective} text={s.description} />
              ))}
            </div>
          </div>
        )}

        {arr(data.visualDontDo).length > 0 && (
          <div>
            <div className="dt-block-label">O que evitar <span className="dt-label-aside">— restri&ccedil;&otilde;es visuais</span></div>
            <div className="dt-tag-row">
              {arr(data.visualDontDo).map((t, i) => <span className="dt-tag dt-tag-neg" key={i}>{t}</span>)}
            </div>
          </div>
        )}
      </Chapter>

      {/* 03 TOM DE VOZ */}
      <Chapter num="03" overline="Capítulo Três · Voice & Tone" title={<>Tom de <em>Voz</em></>} intro="Como a marca fala, escreve e responde — em qualquer canal, em qualquer hora. Exemplos concretos de copy ON e OFF brand.">
        {data.voiceQuote && (
          <div className="dt-pullquote">
            <p className="dt-pullquote-text">{data.voiceQuote}</p>
          </div>
        )}

        {(arr(data.copyOnBrand).length > 0 || arr(data.copyOffBrand).length > 0) && (
          <div>
            <div className="dt-block-label">Como falamos <span className="dt-label-aside">vs. como N&Atilde;O falamos</span></div>
            <div className="dt-copy-frame">
              {arr(data.copyOnBrand).length > 0 && (
                <div className="dt-copy-side">
                  <div className="dt-copy-side-h">
                    <div className="dt-copy-mark dt-copy-mark-on">&#10003;</div>
                    <span className="dt-copy-side-t">ON-Brand</span>
                  </div>
                  <div className="dt-copy-list">
                    {arr(data.copyOnBrand).map((c, i) => <div className="dt-copy-item dt-copy-on" key={i}>"{c}"</div>)}
                  </div>
                </div>
              )}
              {arr(data.copyOffBrand).length > 0 && (
                <div className="dt-copy-side">
                  <div className="dt-copy-side-h">
                    <div className="dt-copy-mark dt-copy-mark-off">&times;</div>
                    <span className="dt-copy-side-t">OFF-Brand</span>
                  </div>
                  <div className="dt-copy-list">
                    {arr(data.copyOffBrand).map((c, i) => <div className="dt-copy-item dt-copy-off" key={i}>"{c}"</div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="dt-split-tight">
          {arr(data.alwaysWords).length > 0 && (
            <div>
              <div className="dt-block-label">Sempre usar</div>
              <div className="dt-tag-row">
                {arr(data.alwaysWords).map((w, i) => <span className="dt-tag dt-tag-pos" key={i}>{w}</span>)}
              </div>
            </div>
          )}
          {arr(data.neverWords).length > 0 && (
            <div>
              <div className="dt-block-label">Nunca usar</div>
              <div className="dt-tag-row">
                {arr(data.neverWords).map((w, i) => <span className="dt-tag dt-tag-neg" key={i}>{w}</span>)}
              </div>
            </div>
          )}
        </div>
      </Chapter>

      {/* 04 CONCORRENTES */}
      <Chapter num="04" overline="Capítulo Quatro · Competitive Mapping" title={<>Concorrentes &amp;<br /><em>Refer&ecirc;ncias</em></>} intro="O que o mercado faz, o que o cliente faz diferente. Análise dos concorrentes mais relevantes — com ângulo prático para o designer." modifier="dt-chapter-alt">
        {arr(data.competitors).map((comp, i) => (
          <div className="dt-competitor" key={i}>
            <div className="dt-competitor-h">
              <div className="dt-competitor-info">
                <h3 className="dt-competitor-name">{comp.name}</h3>
                {comp.tagline && <span className="dt-competitor-tag">{comp.tagline}</span>}
              </div>
              {comp.badge && <span className="dt-competitor-badge">{comp.badge}</span>}
            </div>
            <div className="dt-competitor-body">
              <div className="dt-competitor-cell">
                <div className="dt-competitor-cell-l">Faz Bem</div>
                <p className="dt-competitor-cell-t">{comp.doWell}</p>
              </div>
              <div className="dt-competitor-cell">
                <div className="dt-competitor-cell-l">Faz Mal</div>
                <p className="dt-competitor-cell-t">{comp.doBad}</p>
              </div>
              <div className="dt-competitor-cell">
                <div className="dt-competitor-cell-l">Como Diferenciamos</div>
                <p className="dt-competitor-cell-t">{comp.diff || comp.differentiation}</p>
              </div>
            </div>
          </div>
        ))}
      </Chapter>

      {/* 05 MATERIAIS */}
      <Chapter num="05" overline="Capítulo Cinco · Assets & Materials" title={<>Materiais &amp;<br /><em>Ativos</em></>} intro="O que o cliente já tem. O que precisa ser criado. Em que ordem. O designer vê isso e sabe por onde começar amanhã.">
        {arr(data.existingAssets).length > 0 && (
          <div>
            <div className="dt-block-label">J&aacute; existe</div>
            <div className="dt-assets">
              {arr(data.existingAssets).map((a, i) => (
                <div className="dt-asset" key={i}>
                  <div className="dt-asset-icon dt-asset-icon-has">&#10003;</div>
                  <div className="dt-asset-content">
                    <div className="dt-asset-name">{a.name}</div>
                    <div className="dt-asset-detail">{a.detail || a.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {arr(data.assetsToCreate).length > 0 && (
          <div>
            <div className="dt-block-label">Precisa ser criado <span className="dt-label-aside">— por prioridade</span></div>
            <div className="dt-assets">
              {arr(data.assetsToCreate).map((a, i) => {
                const p = (a.priority || '').toLowerCase();
                const ic = p === 'high' || p === 'alta' ? 'dt-asset-icon-high' : p === 'mid' || p === 'média' || p === 'media' ? 'dt-asset-icon-mid' : 'dt-asset-icon-low';
                const tg = p === 'high' || p === 'alta' ? 'dt-asset-tag-high' : p === 'mid' || p === 'média' || p === 'media' ? 'dt-asset-tag-mid' : 'dt-asset-tag-low';
                const tt = p === 'high' || p === 'alta' ? 'Alta' : p === 'mid' || p === 'média' || p === 'media' ? 'Média' : 'Baixa';
                const sym = p === 'high' || p === 'alta' ? '↑' : p === 'mid' || p === 'média' || p === 'media' ? '→' : '·';
                return (
                  <div className="dt-asset" key={i}>
                    <div className={`dt-asset-icon ${ic}`}>{sym}</div>
                    <div className="dt-asset-content">
                      <div className="dt-asset-name">{a.name}</div>
                      <div className="dt-asset-detail">{a.detail || a.details}</div>
                    </div>
                    <span className={`dt-asset-tag ${tg}`}>{tt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Chapter>

      {/* 06 HISTORICO */}
      <Chapter num="06" overline="Capítulo Seis · Lessons Learned" title={<>Hist&oacute;rico &amp;<br /><em>Aprendizados</em></>} intro="O que já foi tentado, o que funcionou, o que falhou — e por quê. Aprendizados que evitam repetir erro do passado." modifier="dt-chapter-ink">
        {(data.whatWorked || data.whatFailed) && (
          <div className="dt-history-frame">
            {data.whatWorked && (
              <div className="dt-history-cell dt-history-success">
                <div className="dt-history-l">Funcionou</div>
                <h3 className="dt-history-what">"{data.whatWorked.what}"</h3>
                <p className="dt-history-why">{data.whatWorked.why}</p>
              </div>
            )}
            {data.whatFailed && (
              <div className="dt-history-cell dt-history-fail">
                <div className="dt-history-l">N&atilde;o Funcionou</div>
                <h3 className="dt-history-what">"{data.whatFailed.what}"</h3>
                <p className="dt-history-why">{data.whatFailed.why}</p>
              </div>
            )}
          </div>
        )}

        {data.strategicNote && (
          <div className="dt-callout">
            <div className="dt-callout-l">Nota Estrat&eacute;gica</div>
            <HtmlText html={data.strategicNote} tag="p" className="dt-callout-t" />
          </div>
        )}
      </Chapter>

      {/* 07 ENTREGAS */}
      <Chapter num="07" overline="Capítulo Sete · Delivery Direction" title={<>Direcionamento<br />por <em>Entrega</em></>} intro="Como aplicar a marca em cada formato — sem perder coerência. Especificações práticas para o designer começar.">
        {arr(data.deliveries).map((d, i) => (
          <div className="dt-delivery" key={i}>
            <div className="dt-delivery-h">
              <span className="dt-delivery-type">{d.type}</span>
              {d.meta && <span className="dt-delivery-prio">{d.meta}</span>}
            </div>
            <div className="dt-delivery-body">
              <div className="dt-delivery-cell">
                <div className="dt-delivery-cell-l">Objetivo</div>
                <p className="dt-delivery-cell-t">{d.objective}</p>
              </div>
              <div className="dt-delivery-cell">
                <div className="dt-delivery-cell-l">Dire&ccedil;&atilde;o Visual</div>
                <p className="dt-delivery-cell-t">{d.visual || d.visualDirection}</p>
              </div>
              <div className="dt-delivery-cell">
                <div className="dt-delivery-cell-l">Evitar</div>
                <p className="dt-delivery-cell-t">{d.avoid}</p>
              </div>
            </div>
          </div>
        ))}
      </Chapter>

      {/* 08 CHECKLIST */}
      <Chapter num="08" overline="Capítulo Oito · Designer Checklist" title={<>Checklist do<br /><em>Designer</em></>} intro="O que pode começar hoje. O que está pendente. O que precisa ser perguntado antes de produzir." modifier="dt-chapter-alt">
        {arr(data.immediateActions).length > 0 && (
          <div>
            <div className="dt-block-label">A&ccedil;&otilde;es imediatas</div>
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
            <div className="dt-block-label">Pend&ecirc;ncias operacionais <span className="dt-label-aside">— n&atilde;o &eacute; design, mas afeta</span></div>
            <div className="dt-callout dt-callout-warn">
              <div className="dt-callout-l">Aten&ccedil;&atilde;o</div>
              <p className="dt-callout-t">{data.operationalNote}</p>
            </div>
          </div>
        )}

        {arr(data.pendingQuestions).length > 0 && (
          <div>
            <div className="dt-block-label">Perguntas para o cliente</div>
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
      </Chapter>

      {/* FINAL SUMMARY */}
      {data.finalSummary && (
        <div className="dt-final">
          <div className="dt-final-content">
            <div className="dt-final-mark">S&iacute;ntese para o designer</div>
            <div className="dt-final-quote-mark">"</div>
            <p className="dt-final-text">{data.finalSummary}</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="dt-doc-footer">
        <span className="dt-footer-block">DNA Visual &middot; V4 Ruston &amp; Co.</span>
        <span className="dt-footer-block">{data.edition || 'VOL. 01'} &middot; {data.issue || 'NO. 0001'}</span>
        <span className="dt-footer-block">{date} &middot; {designer}</span>
      </footer>
    </div>
  );
}

function Chapter({ num, overline, title, intro, modifier = '', children }) {
  return (
    <section className={`dt-chapter ${modifier}`}>
      <div className="dt-ch-header">
        <div>
          <div className="dt-ch-num-ribbon">
            <div className="dt-ch-num"><ChapterNum num={num} /></div>
            <div className="dt-ch-overline">{overline}</div>
          </div>
          <h2 className="dt-ch-title">{title}</h2>
        </div>
      </div>
      {intro && <p className="dt-ch-intro">{intro}</p>}
      <div className="dt-ch-content">{children}</div>
    </section>
  );
}

function PillarCard({ roman, eyebrow, title, text, html }) {
  return (
    <div className="dt-card">
      <div className="dt-card-roman">{roman}</div>
      <div className="dt-card-eyebrow">{eyebrow}</div>
      <h3 className="dt-card-title">{title}</h3>
      {html
        ? <p className="dt-card-text" dangerouslySetInnerHTML={{ __html: (text || '').replace(/\n/g, '<br/>') }} />
        : <p className="dt-card-text">{text}</p>}
    </div>
  );
}
