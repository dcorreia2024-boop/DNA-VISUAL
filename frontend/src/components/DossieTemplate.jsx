import './DossieTemplate.css';

// ═══════════ HELPERS ═══════════

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(201,133,108,${alpha})`;
  const c = hex.replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(201,133,108,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

function getContrastText(hex) {
  if (!hex || typeof hex !== 'string') return '#FFFFFF';
  const c = hex.replace('#', '').padEnd(6, '0').slice(0, 6);
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#FFFFFF';
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#1A1410' : '#FFFFFF';
}

const arr = (v) => (Array.isArray(v) ? v : []);

// Carrega fontes do cliente dinamicamente (React 19 hoisting -> head)
function DossieFonts({ typography }) {
  const fonts = arr(typography).map(t => t?.family).filter(Boolean);
  if (!fonts.length) return null;

  const families = fonts.map(f =>
    `family=${f.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600`
  ).join('&');
  const url = `https://fonts.googleapis.com/css2?${families}&display=swap`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={url} />
    </>
  );
}

function HtmlText({ html, tag: Tag = 'span', className, style }) {
  if (!html) return null;
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

// ═══════════ MAIN COMPONENT ═══════════

export default function DossieTemplate({ data, clientName: fbName, designerName: fbDesigner, dateStr }) {
  if (!data) return null;

  const palette = data.colorPalette || {};
  const primary = palette.primary?.hex || '#C9856C';
  const secondary = palette.secondary?.hex || '#8A9E7B';
  const neutral = palette.neutral?.hex || '#F5EFE6';
  const dark = palette.dark?.hex || '#3D2B1F';
  const accent = palette.accent?.hex || '#D4AF7A';

  const displayFamily = data.typography?.[0]?.family || 'Cormorant Garamond';
  const textFamily = data.typography?.[1]?.family || 'DM Sans';

  const styleVars = {
    '--c-primary': primary,
    '--c-secondary': secondary,
    '--c-neutral': neutral,
    '--c-dark': dark,
    '--c-accent': accent,
    '--c-primary-text': getContrastText(primary),
    '--c-secondary-text': getContrastText(secondary),
    '--c-neutral-text': getContrastText(neutral),
    '--c-accent-text': getContrastText(accent),
    '--bg-primary-soft': hexToRgba(primary, 0.08),
    '--bg-primary-medium': hexToRgba(primary, 0.14),
    '--bg-secondary-soft': hexToRgba(secondary, 0.08),
    '--bg-secondary-medium': hexToRgba(secondary, 0.14),
    '--bg-accent-soft': hexToRgba(accent, 0.10),
    '--bg-neutral-deep': hexToRgba(primary, 0.05),
    '--f-display': `'${displayFamily}', Georgia, serif`,
    '--f-text': `'${textFamily}', 'Helvetica Neue', sans-serif`,
  };

  const clientName = data.clientName || fbName || 'Cliente';
  const designer = data.designerName || data.designer || fbDesigner || 'Designer';
  const edition = data.edition || 'VOL. 01';
  const issue = data.issue || 'NO. 0001';
  const segment = data.segment || '—';
  const location = data.location || 'Brasil';

  // Render personality cells (4 com cores rotativas)
  const personalities = arr(data.brandEssence?.personality).slice(0, 4);
  const personalityMeanings = arr(data.brandEssence?.personalityMeanings);

  // Mockups (com fallback se nao existirem)
  const mockups = data.typographyMockups || {};
  const mockInsta = mockups.instagram || {
    handle: `@${(clientName || 'cliente').toLowerCase().replace(/\s+/g, '')}`,
    title: data.brandEssence?.purpose || 'Cada detalhe importa',
    meta: 'Coleção 2026',
  };
  const mockTag = mockups.tag || {
    number: 'N° 001',
    name: clientName,
    message: data.toneOfVoice?.doSay?.[0] || 'Criado com intenção',
  };
  const mockHero = mockups.hero || {
    eyebrow: 'Coleção Permanente',
    title: data.brandEssence?.purpose?.split('.')[0] || 'Identidade autoral',
    cta: 'Saiba mais →',
  };

  return (
    <div id="dossie-content" className="dt-dossier" style={styleVars}>
      <DossieFonts typography={data.typography} />

      {/* HEADER INSTITUCIONAL */}
      <div className="dt-dossier-header">
        <div>DNA VISUAL · {edition}<br />{issue} · {(clientName || '').replace(/<[^>]+>/g, '').toUpperCase()}</div>
        <div style={{ textAlign: 'right' }}>
          <em>Brand Foundation Document</em><br />
          An editorial dossier by V4 Ruston &amp; Co.
        </div>
      </div>

      {/* COVER */}
      <section className="dt-cover dt-chapter">
        <div>
          <div className="dt-cover-eyebrow">
            <div className="dt-cover-eyebrow-line" />
            <div className="dt-label">Dossi&ecirc; de Identidade</div>
          </div>
          <HtmlText html={clientName} tag="h1" className="dt-display dt-cover-title" />
          {data.tagline && <p className="dt-cover-tagline">{data.tagline}</p>}
        </div>
        <div className="dt-cover-meta">
          <div className="dt-cover-meta-block">
            <div className="dt-label">Cliente</div>
            <div className="dt-cover-meta-value">{(clientName || '').replace(/<[^>]+>/g, '')}</div>
          </div>
          <div className="dt-cover-meta-block">
            <div className="dt-label">Segmento</div>
            <div className="dt-cover-meta-value">{segment}</div>
          </div>
          <div className="dt-cover-meta-block">
            <div className="dt-label">Localiza&ccedil;&atilde;o</div>
            <div className="dt-cover-meta-value">{location}</div>
          </div>
          <div className="dt-cover-meta-block">
            <div className="dt-label">Designer</div>
            <div className="dt-cover-meta-value">{designer}</div>
          </div>
        </div>
      </section>

      {/* SUMARIO */}
      <section className="dt-chapter dt-chapter--paper">
        <h2 className="dt-display dt-toc-title">
          <span className="dt-toc-numeral">i.</span>Oito cap&iacute;tulos para <em>guiar</em> do briefing &agrave; entrega.
        </h2>
        <div className="dt-toc-list">
          {[
            ['01', 'Identidade da Marca', 'P. 04'], ['02', 'Diretrizes Visuais', 'P. 08'],
            ['03', 'Tom de Voz', 'P. 12'], ['04', 'Concorrentes', 'P. 16'],
            ['05', 'Materiais e Ativos', 'P. 20'], ['06', 'Histórico e Aprendizados', 'P. 24'],
            ['07', 'Direcionamento por Entrega', 'P. 28'], ['08', 'Checklist do Designer', 'P. 32'],
          ].reduce((rows, item, i) => {
            if (i % 2 === 0) rows.push([item]); else rows[rows.length - 1].push(item);
            return rows;
          }, []).map((row, i) => (
            <div className="dt-toc-row" key={i}>
              <span className="dt-toc-num">{row[0][0]}</span>
              <span className="dt-toc-name">{row[0][1]}</span>
              <span className="dt-toc-page">{row[0][2]}</span>
              <span className="dt-toc-arrow">&rarr;</span>
              {row[1] && (<>
                <span className="dt-toc-num">{row[1][0]}</span>
                <span className="dt-toc-name">{row[1][1]}</span>
                <span className="dt-toc-page">{row[1][2]}</span>
              </>)}
            </div>
          ))}
        </div>
      </section>

      {/* CAP 01 — IDENTIDADE */}
      <section className="dt-chapter dt-chapter--primary-tint">
        <ChapterOpener num="01" meta="Capítulo Um · Brand Identity" title={<>Identidade da <em>Marca</em></>} lead="Quem é, o que defende, para quem fala e onde quer chegar. Os fundamentos que vão guiar toda decisão visual nos próximos capítulos." />

        {data.brandEssence?.purpose && (
          <div className="dt-purpose-quote">
            <p className="dt-display">{data.brandEssence.purpose}</p>
          </div>
        )}

        {(data.brandEssence?.mission || data.brandEssence?.vision || data.brandEssence?.values) && (
          <div className="dt-pillars">
            {data.brandEssence?.mission && (
              <div className="dt-pillar">
                <span className="dt-pillar-num">i.</span>
                <div className="dt-label">Missão</div>
                <h3 className="dt-pillar-title">A razão de existir</h3>
                <p className="dt-pillar-text">{data.brandEssence.mission}</p>
              </div>
            )}
            {data.brandEssence?.vision && (
              <div className="dt-pillar">
                <span className="dt-pillar-num">ii.</span>
                <div className="dt-label">Visão</div>
                <h3 className="dt-pillar-title">Onde quer chegar</h3>
                <p className="dt-pillar-text">{data.brandEssence.vision}</p>
              </div>
            )}
            {arr(data.brandEssence?.values).length > 0 && (
              <div className="dt-pillar">
                <span className="dt-pillar-num">iii.</span>
                <div className="dt-label">Valores</div>
                <h3 className="dt-pillar-title">O que defende</h3>
                <p className="dt-pillar-text">{arr(data.brandEssence.values).join(' · ')}</p>
              </div>
            )}
          </div>
        )}

        {personalities.length > 0 && (
          <div className="dt-personality">
            {personalities.map((p, i) => (
              <div className={`dt-persona dt-persona-${i + 1}`} key={i}>
                <div className="dt-persona-name">{p}</div>
                <div className="dt-persona-desc">{personalityMeanings[i] || ''}</div>
              </div>
            ))}
          </div>
        )}

        {(data.targetAudience?.primary || data.targetAudience?.secondary) && (
          <div className="dt-audiences">
            {data.targetAudience?.primary && (
              <div className="dt-aud-block">
                <div className="dt-label dt-label-strong">P&uacute;blico Prim&aacute;rio</div>
                <HtmlText html={data.targetAudience.primary.profile} tag="p" className="dt-body" />
                {arr(data.targetAudience.primary.desires).length > 0 && (
                  <div className="dt-aud-tags">
                    {arr(data.targetAudience.primary.desires).map((t, i) => <span className="dt-aud-tag" key={i}>{t}</span>)}
                  </div>
                )}
              </div>
            )}
            {data.targetAudience?.secondary && (
              <div className="dt-aud-block">
                <div className="dt-label dt-label-strong">P&uacute;blico Secund&aacute;rio</div>
                <HtmlText html={data.targetAudience.secondary.profile} tag="p" className="dt-body" />
                {arr(data.targetAudience.secondary.desires).length > 0 && (
                  <div className="dt-aud-tags">
                    {arr(data.targetAudience.secondary.desires).map((t, i) => <span className="dt-aud-tag dt-aud-tag-bad" key={i}>{t}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* CAP 02 — DIRETRIZES VISUAIS */}
      <section className="dt-chapter dt-chapter--neutral">
        <ChapterOpener num="02" meta="Capítulo Dois · Visual Guidelines" title={<>Diretrizes <em>Visuais</em></>} lead="A paleta, a tipografia e o estilo que traduzem a marca em cada peça. Tudo com aplicação prática — pense no designer abrindo o Figma amanhã." />

        <div className="dt-label" style={{ marginTop: 80 }}>&mdash; Paleta Crom&aacute;tica</div>
        <div className="dt-palette-grid">
          {['primary', 'secondary', 'neutral', 'dark'].map((key, i) => {
            const c = palette[key];
            if (!c) return null;
            const isLight = key === 'neutral';
            return (
              <div className={`dt-swatch dt-swatch-${i + 1} ${isLight ? 'dt-swatch--light' : ''}`} key={key}>
                <div className="dt-swatch-name">{c.name}</div>
                <div className="dt-swatch-hex">{c.hex}</div>
                <div className="dt-swatch-role">{key === 'primary' ? 'Primária' : key === 'secondary' ? 'Secundária' : key === 'neutral' ? 'Neutra' : 'Texto'}</div>
              </div>
            );
          })}
        </div>

        {/* Proporcao bar */}
        <div className="dt-proportion">
          {['primary', 'secondary', 'neutral', 'dark'].map((key) => {
            const c = palette[key];
            if (!c) return null;
            return <div key={key} style={{ flex: c.proportion || 10, background: c.hex, border: key === 'neutral' ? '1px solid var(--rule)' : 'none' }} />;
          })}
        </div>
        <div className="dt-proportion-labels">
          {['primary', 'secondary', 'neutral', 'dark'].map((key) => {
            const c = palette[key];
            if (!c) return null;
            return <span key={key}>{c.name?.split(' ')[0]} {c.proportion || 0}%</span>;
          })}
        </div>

        {/* SPECIMENS COMO MOCKUPS */}
        <div className="dt-specimens-section">
          <div className="dt-label">&mdash; Tipografia em Aplica&ccedil;&atilde;o</div>
          <div className="dt-specimens-grid">
            {/* Mockup Instagram */}
            <div className="dt-mockup-instagram">
              <div className="dt-mockup-instagram-header">
                <div className="dt-mockup-instagram-avatar" />
                <div className="dt-mockup-instagram-handle">{mockInsta.handle}</div>
              </div>
              <div className="dt-mockup-instagram-content">
                <HtmlText html={mockInsta.title} className="dt-mockup-instagram-title" />
                <div className="dt-mockup-instagram-meta">&mdash; {mockInsta.meta}</div>
              </div>
            </div>

            {/* Mockup Etiqueta */}
            <div className="dt-mockup-tag">
              <div className="dt-mockup-tag-num">{mockTag.number}</div>
              <HtmlText html={mockTag.name} tag="div" className="dt-mockup-tag-name" />
              <div className="dt-mockup-tag-rule" />
              <div className="dt-mockup-tag-msg">{mockTag.message}</div>
            </div>

            {/* Mockup Hero */}
            <div className="dt-mockup-hero">
              <div className="dt-mockup-hero-text">
                <div className="dt-mockup-hero-eyebrow">&mdash; {mockHero.eyebrow}</div>
                <HtmlText html={mockHero.title} className="dt-mockup-hero-title" />
                <div className="dt-mockup-hero-cta">{mockHero.cta}</div>
              </div>
              <div className="dt-mockup-hero-image" />
            </div>
          </div>

          {/* Specimen meta */}
          <div className="dt-specimen-meta">
            <div className="dt-specimen-meta-item">
              <div className="dt-label">Display</div>
              <div className="dt-val">{displayFamily}</div>
            </div>
            <div className="dt-specimen-meta-item">
              <div className="dt-label">Body / UI</div>
              <div className="dt-val">{textFamily}</div>
            </div>
            <div className="dt-specimen-meta-item">
              <div className="dt-label">Pesos usados</div>
              <div className="dt-val">{(data.typography?.[0]?.weights || ['400', '500']).join(' · ')}</div>
            </div>
            <div className="dt-specimen-meta-item">
              <div className="dt-label">Status</div>
              <div className="dt-val">Recomendada</div>
            </div>
          </div>
        </div>

        {/* Princípios visuais */}
        {arr(data.visualReferences?.principles).length > 0 && (
          <div style={{ marginTop: 60 }}>
            <div className="dt-label">&mdash; Estilo Visual</div>
            <div className="dt-principles">
              {arr(data.visualReferences.principles).slice(0, 3).map((p, i) => (
                <div className="dt-principle" key={i}>
                  <span className="dt-principle-num">{['i.', 'ii.', 'iii.'][i]}</span>
                  <h3 className="dt-principle-name">{p.name}</h3>
                  <p className="dt-principle-text">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {arr(data.visualReferences?.avoid).length > 0 && (
          <div className="dt-avoid">
            <div className="dt-label">&mdash; O que evitar <span style={{ color: 'var(--ink-faint)', fontWeight: 400, letterSpacing: 0 }}>&mdash; restri&ccedil;&otilde;es visuais</span></div>
            <div className="dt-avoid-tags">
              {arr(data.visualReferences.avoid).map((t, i) => <span className="dt-avoid-tag" key={i}>{t}</span>)}
            </div>
          </div>
        )}
      </section>

      {/* CAP 03 — TOM DE VOZ */}
      <section className="dt-chapter dt-chapter--paper">
        <ChapterOpener num="03" meta="Capítulo Três · Voice & Tone" title={<>Tom de <em>Voz</em></>} lead="Como a marca fala, escreve e responde — em qualquer canal, em qualquer hora. Exemplos concretos de copy ON e OFF brand." />

        {data.toneOfVoice?.quote && (
          <div className="dt-voice-quote">
            <p className="dt-display">{data.toneOfVoice.quote}</p>
          </div>
        )}

        {(arr(data.toneOfVoice?.doSay).length > 0 || arr(data.toneOfVoice?.dontSay).length > 0) && (
          <div className="dt-voice-table">
            <div className="dt-voice-col dt-voice-col-good">
              <div className="dt-voice-col-label">&#10003; ON-BRAND &middot; Como falamos</div>
              {arr(data.toneOfVoice.doSay).map((c, i) => <div className="dt-voice-line" key={i}>{c}</div>)}
            </div>
            <div className="dt-voice-col dt-voice-col-bad">
              <div className="dt-voice-col-label">&times; OFF-BRAND &middot; Como N&Atilde;O falamos</div>
              {arr(data.toneOfVoice.dontSay).map((c, i) => <div className="dt-voice-line" key={i}>{c}</div>)}
            </div>
          </div>
        )}

        <div className="dt-voice-words">
          {arr(data.toneOfVoice?.wordsToUse).length > 0 && (
            <div className="dt-voice-words-block">
              <div className="dt-label">&mdash; Sempre usar</div>
              <div className="dt-voice-words-tags">
                {arr(data.toneOfVoice.wordsToUse).map((w, i) => <span className="dt-word-tag dt-word-tag-yes" key={i}>{w}</span>)}
              </div>
            </div>
          )}
          {arr(data.toneOfVoice?.wordsToAvoid).length > 0 && (
            <div className="dt-voice-words-block">
              <div className="dt-label">&mdash; Nunca usar</div>
              <div className="dt-voice-words-tags">
                {arr(data.toneOfVoice.wordsToAvoid).map((w, i) => <span className="dt-word-tag dt-word-tag-no" key={i}>{w}</span>)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CAP 04 — CONCORRENTES */}
      <section className="dt-chapter dt-chapter--secondary-tint">
        <ChapterOpener num="04" meta="Capítulo Quatro · Competitive Mapping" title={<>Concorrentes &amp; <em>Refer&ecirc;ncias</em></>} lead="O que o mercado faz, o que o cliente faz diferente. Análise dos concorrentes mais relevantes — com ângulo prático para o designer." />

        <div style={{ marginTop: 60 }}>
          {arr(data.competitors).map((c, i) => (
            <div className="dt-competitor" key={i}>
              <div className="dt-competitor-head">
                <div>
                  <div className="dt-competitor-name">{c.name}</div>
                  {c.positioning && <div className="dt-competitor-pos">{c.positioning}</div>}
                </div>
                {c.type && <div className="dt-competitor-tag">{c.type}</div>}
              </div>
              <div className="dt-competitor-body">
                <div className="dt-competitor-cell">
                  <div className="dt-label">Faz bem</div>
                  <p className="dt-body">{c.strength}</p>
                </div>
                <div className="dt-competitor-cell">
                  <div className="dt-label">Faz mal</div>
                  <p className="dt-body">{c.weakness}</p>
                </div>
                <div className="dt-competitor-cell">
                  <div className="dt-label">Como diferenciamos</div>
                  <p className="dt-body">{c.differentiator}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAP 05 — MATERIAIS */}
      <section className="dt-chapter dt-chapter--paper">
        <ChapterOpener num="05" meta="Capítulo Cinco · Assets & Materials" title={<>Materiais &amp; <em>Ativos</em></>} lead="O que o cliente já tem. O que precisa ser criado. Em que ordem. O designer vê isso e sabe por onde começar amanhã." />

        <div className="dt-materials-grid">
          {arr(data.materials?.existing).length > 0 && (
            <div>
              <h3 className="dt-materials-col-title">J&aacute; <em>existe</em></h3>
              <div className="dt-materials-col-sub">&mdash; ativos dispon&iacute;veis hoje</div>
              {arr(data.materials.existing).map((m, i) => (
                <div className="dt-material-card" key={i}>
                  <div className="dt-material-card-content">
                    <div className="dt-material-card-title">
                      <span className="dt-material-icon dt-material-icon-check">&#10003;</span>{m.title}
                    </div>
                    <div className="dt-material-card-desc">{m.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {arr(data.materials?.toCreate).length > 0 && (
            <div>
              <h3 className="dt-materials-col-title">Precisa ser <em>criado</em></h3>
              <div className="dt-materials-col-sub">&mdash; por prioridade</div>
              {arr(data.materials.toCreate).map((m, i) => {
                const p = (m.priority || '').toLowerCase();
                const cls = p === 'alta' ? 'alta' : (p === 'media' || p === 'média') ? 'media' : 'baixa';
                const lbl = p === 'alta' ? 'Alta' : (p === 'media' || p === 'média') ? 'Média' : 'Baixa';
                return (
                  <div className="dt-material-card" key={i}>
                    <div className="dt-material-card-content">
                      <div className="dt-material-card-title">
                        <span className="dt-material-icon dt-material-icon-plus">+</span>{m.title}
                      </div>
                      <div className="dt-material-card-desc">{m.description}</div>
                    </div>
                    <span className={`dt-material-priority dt-material-priority-${cls}`}>{lbl}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CAP 06 — HISTÓRICO (BLACKOUT) */}
      <section className="dt-chapter dt-chapter--dark">
        <ChapterOpener num="06" meta="Capítulo Seis · Lessons Learned" title={<>Hist&oacute;rico &amp; <em>Aprendizados</em></>} lead="O que já foi tentado, o que funcionou, o que falhou — e por quê. Aprendizados que evitam repetir erro do passado." dark />

        {(data.history?.worked || data.history?.failed) && (
          <div className="dt-lessons">
            {data.history?.worked && (
              <div className="dt-lesson dt-lesson-good">
                <div className="dt-lesson-label">&uarr; Funcionou</div>
                <p className="dt-lesson-quote">"{data.history.worked.quote}"</p>
                <p className="dt-lesson-explain">{data.history.worked.explanation}</p>
              </div>
            )}
            {data.history?.failed && (
              <div className="dt-lesson dt-lesson-bad">
                <div className="dt-lesson-label">&darr; N&atilde;o funcionou</div>
                <p className="dt-lesson-quote">"{data.history.failed.quote}"</p>
                <p className="dt-lesson-explain">{data.history.failed.explanation}</p>
              </div>
            )}
          </div>
        )}

        {data.history?.benchmarks && (
          <div className="dt-benchmark-strip">
            <div className="dt-benchmark-label">&mdash; Nota estrat&eacute;gica</div>
            <HtmlText html={data.history.benchmarks} tag="p" className="dt-benchmark-text" />
          </div>
        )}
      </section>

      {/* CAP 07 — DIRECIONAMENTO POR ENTREGA */}
      <section className="dt-chapter dt-chapter--accent-tint">
        <ChapterOpener num="07" meta="Capítulo Sete · Delivery Direction" title={<>Direcionamento por <em>Entrega</em></>} lead="Como aplicar a marca em cada formato — sem perder coerência. Especificações práticas para o designer começar." />

        <div style={{ marginTop: 60 }}>
          {arr(data.deliveries).map((d, i) => (
            <div className="dt-delivery" key={i}>
              <div className="dt-delivery-head">
                <div className="dt-delivery-name">{d.name}</div>
                {d.priority && <div className="dt-delivery-prio">{d.priority}</div>}
              </div>
              <div className="dt-delivery-body">
                <div className="dt-delivery-cell">
                  <div className="dt-label">Objetivo</div>
                  <p className="dt-body">{d.objective}</p>
                </div>
                <div className="dt-delivery-cell">
                  <div className="dt-label">Dire&ccedil;&atilde;o visual</div>
                  <p className="dt-body">{d.direction}</p>
                </div>
                <div className="dt-delivery-cell">
                  <div className="dt-label">Evitar</div>
                  <p className="dt-body">{d.avoid}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAP 08 — CHECKLIST */}
      <section className="dt-chapter dt-chapter--paper">
        <ChapterOpener num="08" meta="Capítulo Oito · Designer Checklist" title={<>Checklist do <em>Designer</em></>} lead="O que pode começar hoje. O que está pendente. O que precisa ser perguntado antes de produzir." />

        {arr(data.designerChecklist?.immediate).length > 0 && (
          <div className="dt-check-section">
            <div className="dt-check-section-label"><span>&mdash; A&ccedil;&otilde;es imediatas</span><div className="dt-check-section-rule" /></div>
            {arr(data.designerChecklist.immediate).map((t, i) => (
              <div className="dt-check-item" key={i}><div className="dt-check-box" />{t}</div>
            ))}
          </div>
        )}

        {data.designerChecklist?.pending && (
          <div className="dt-check-section">
            <div className="dt-check-section-label"><span>&mdash; Pend&ecirc;ncias operacionais</span><div className="dt-check-section-rule" /></div>
            <div className="dt-attention-box">
              <div className="dt-attention-label">Aten&ccedil;&atilde;o</div>
              <p className="dt-attention-text">{data.designerChecklist.pending}</p>
            </div>
          </div>
        )}

        {arr(data.designerChecklist?.questions).length > 0 && (
          <div className="dt-check-section">
            <div className="dt-check-section-label"><span>&mdash; Perguntas para o cliente</span><div className="dt-check-section-rule" /></div>
            {arr(data.designerChecklist.questions).map((t, i) => (
              <div className="dt-check-item" key={i}><div className="dt-check-box" />{t}</div>
            ))}
          </div>
        )}
      </section>

      {/* SÍNTESE FINAL (BLACKOUT) */}
      {data.finalSummary && (
        <section className="dt-synthesis">
          <div className="dt-synthesis-eyebrow">&mdash; S&iacute;ntese para o designer</div>
          <HtmlText html={data.finalSummary.main} tag="h2" className="dt-synthesis-title" />

          <div className="dt-synthesis-takeaways">
            {arr(data.finalSummary.startHere).length > 0 && (
              <div className="dt-take">
                <div className="dt-take-num">i.</div>
                <div className="dt-take-title">Por onde come&ccedil;ar</div>
                <ul className="dt-take-list">
                  {arr(data.finalSummary.startHere).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
            {arr(data.finalSummary.defend).length > 0 && (
              <div className="dt-take">
                <div className="dt-take-num">ii.</div>
                <div className="dt-take-title">O que defender</div>
                <ul className="dt-take-list">
                  {arr(data.finalSummary.defend).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
            {arr(data.finalSummary.avoid).length > 0 && (
              <div className="dt-take">
                <div className="dt-take-num">iii.</div>
                <div className="dt-take-title">O que evitar</div>
                <ul className="dt-take-list">
                  {arr(data.finalSummary.avoid).map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div className="dt-synthesis-footer">
            <div>DNA Visual &middot; V4 Ruston &amp; Co.</div>
            <div><em>{edition} &middot; {issue} &middot; {(clientName || '').replace(/<[^>]+>/g, '')}</em></div>
            <div>{designer}</div>
          </div>
        </section>
      )}
    </div>
  );
}

function ChapterOpener({ num, meta, title, lead, dark }) {
  return (
    <>
      <div>
        <span className="dt-opener-num">{num}</span>
        <span className="dt-opener-meta" style={dark ? { color: 'rgba(250,246,238,0.5)' } : undefined}>{meta}</span>
      </div>
      <h2 className="dt-display dt-opener-title">{title}</h2>
      <p className="dt-lead dt-opener-lead" style={dark ? { color: 'rgba(250,246,238,0.7)' } : undefined}>{lead}</p>
    </>
  );
}
