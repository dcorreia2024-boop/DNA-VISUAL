import './DossieTemplate.css';

const safe = (v, fallback = '') => (v == null || v === '' ? fallback : v);
const arr = (v) => (Array.isArray(v) ? v : []);

export default function DossieTemplate({ data, clientName, designerName, dateStr }) {
  if (!data) return null;

  const primary = data.colors?.[0]?.hex || '#C0392B';
  const secondary = data.colors?.[1]?.hex || '#F2EAD3';
  const neutral = data.colors?.[2]?.hex || '#2C1A0E';

  const headingFont = data.typography?.[0]?.family || 'Playfair Display';
  const bodyFont = data.typography?.[1]?.family || 'Inter';

  return (
    <div
      className="dt"
      style={{
        '--c-primary': primary,
        '--c-secondary': secondary,
        '--c-neutral': neutral,
        '--c-heading-font': `'${headingFont}', serif`,
        '--c-body-font': `'${bodyFont}', sans-serif`,
      }}
    >
      {/* CAPA */}
      <header className="dt-capa">
        <div className="dt-capa-tag">Dossi&ecirc; de Identidade Visual</div>
        <h1 className="dt-capa-title">{safe(data.clientName, clientName)}</h1>
        <div className="dt-capa-sub">{safe(data.segment, '')}{data.city ? ` | ${data.city}` : ''}</div>
        <div className="dt-capa-meta">
          {data.status && (<div><strong>CONTEXTO</strong><span>{data.status}</span></div>)}
          <div><strong>DATA</strong><span>{dateStr}</span></div>
          <div><strong>DESIGNER</strong><span>{designerName || '-'}</span></div>
          <div><strong>AG&Ecirc;NCIA</strong><span>V4 Ruston &amp; Co.</span></div>
        </div>
      </header>

      {/* INDICE */}
      <nav className="dt-indice">
        <h2>&Iacute;ndice</h2>
        <div className="dt-indice-grid">
          <a href="#sec-1" className="dt-indice-item"><span className="dt-indice-num">01</span>Identidade da Marca</a>
          <a href="#sec-2" className="dt-indice-item"><span className="dt-indice-num">02</span>Diretrizes Visuais</a>
          <a href="#sec-3" className="dt-indice-item"><span className="dt-indice-num">03</span>Tom de Voz</a>
          <a href="#sec-4" className="dt-indice-item"><span className="dt-indice-num">04</span>Concorrentes &amp; Refer&ecirc;ncias</a>
          <a href="#sec-5" className="dt-indice-item"><span className="dt-indice-num">05</span>Materiais e Ativos</a>
          <a href="#sec-6" className="dt-indice-item"><span className="dt-indice-num">06</span>Hist&oacute;rico</a>
          <a href="#sec-7" className="dt-indice-item"><span className="dt-indice-num">07</span>Direcionamento por Entrega</a>
          <a href="#sec-8" className="dt-indice-item"><span className="dt-indice-num">08</span>Checklist do Designer</a>
        </div>
      </nav>

      {/* 01 IDENTIDADE */}
      <section className="dt-sec" id="sec-1">
        <div className="dt-sec-header">
          <span className="dt-sec-num">01</span>
          <div>
            <h2>Identidade da Marca</h2>
            <p>O que a marca &eacute;, o que defende, para quem fala.</p>
          </div>
        </div>

        {data.positioning && (
          <div className="dt-destaque">{data.positioning}</div>
        )}

        <div className="dt-grid-3">
          {data.mission && (
            <div className="dt-card">
              <div className="dt-card-titulo">Miss&atilde;o</div>
              <p>{data.mission}</p>
            </div>
          )}
          {data.vision && (
            <div className="dt-card">
              <div className="dt-card-titulo">Vis&atilde;o</div>
              <p>{data.vision}</p>
            </div>
          )}
          {data.values && (
            <div className="dt-card">
              <div className="dt-card-titulo">Valores</div>
              <p style={{ whiteSpace: 'pre-line' }}>{data.values}</p>
            </div>
          )}
        </div>

        {data.slogan && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Slogan / Manifesto</div>
            <p><em>"{data.slogan}"</em></p>
          </div>
        )}

        {arr(data.personality).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Personalidade</div>
            <div className="dt-personality-grid">
              {arr(data.personality).map((p, i) => (
                <div className="dt-personality" key={i}>{p}</div>
              ))}
            </div>
          </div>
        )}

        {(data.targetAge || data.targetBehavior || data.targetPain || data.targetClass) && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">P&uacute;blico-alvo</div>
            <div className="dt-grid-2">
              <div className="dt-card">
                <div className="dt-card-titulo">Perfil Demogr&aacute;fico</div>
                <p>
                  {data.targetAge && <><strong>Idade:</strong> {data.targetAge}<br /></>}
                  {data.targetGender && <><strong>G&ecirc;nero:</strong> {data.targetGender}<br /></>}
                  {data.targetClass && <><strong>Classe:</strong> {data.targetClass}<br /></>}
                  {data.targetLocation && <><strong>Local:</strong> {data.targetLocation}</>}
                </p>
              </div>
              <div className="dt-card">
                <div className="dt-card-titulo">Comportamento e Dor</div>
                <p>
                  {data.targetBehavior && <>{data.targetBehavior}<br /><br /></>}
                  {data.targetPain && <><strong>Dor principal:</strong> {data.targetPain}</>}
                </p>
              </div>
            </div>
          </div>
        )}

        {data.valueProposition && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Proposta de valor &uacute;nica</div>
            <div className="dt-card dt-card-dark">
              <p>{data.valueProposition}</p>
            </div>
          </div>
        )}

        <div className="dt-grid-2">
          {arr(data.wantAssociations).length > 0 && (
            <div className="dt-bloco">
              <div className="dt-bloco-label">Queremos ser associados a</div>
              <div className="dt-tags">
                {arr(data.wantAssociations).map((t, i) => (
                  <span className="dt-tag dt-tag-verde" key={i}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {arr(data.avoidAssociations).length > 0 && (
            <div className="dt-bloco">
              <div className="dt-bloco-label">Evitar associa&ccedil;&otilde;es com</div>
              <div className="dt-tags">
                {arr(data.avoidAssociations).map((t, i) => (
                  <span className="dt-tag dt-tag-vermelho" key={i}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 02 DIRETRIZES VISUAIS */}
      <section className="dt-sec" id="sec-2">
        <div className="dt-sec-header">
          <span className="dt-sec-num">02</span>
          <div>
            <h2>Diretrizes Visuais</h2>
            <p>Paleta, tipografia e estilo. O que o designer precisa pra criar qualquer pe&ccedil;a.</p>
          </div>
        </div>

        {arr(data.colors).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Paleta de cores</div>
            <div className="dt-paleta-grid">
              {arr(data.colors).map((c, i) => (
                <div className="dt-paleta-item" key={i}>
                  <div className="dt-paleta-cor" style={{ background: c.hex }} />
                  <div className="dt-paleta-info">
                    <strong>{c.name}</strong>
                    <small>{c.hex} &middot; {c.role}</small>
                    <span className="dt-paleta-uso">{c.usage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {arr(data.typography).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Tipografia</div>
            {arr(data.typography).map((t, i) => (
              <div className="dt-tipo-bloco" key={i}>
                <div className="dt-tipo-preview" style={{ fontFamily: `'${t.family}', sans-serif`, fontSize: i === 0 ? 36 : 18 }}>
                  {t.family}
                </div>
                <div className="dt-tipo-info">
                  <div className="dt-tipo-detalhe"><strong>Fam&iacute;lia</strong>{t.family}</div>
                  <div className="dt-tipo-detalhe"><strong>Peso</strong>{t.weight}</div>
                  <div className="dt-tipo-detalhe"><strong>Uso</strong>{t.usage}</div>
                  <div className="dt-tipo-detalhe"><strong>Status</strong>{t.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {arr(data.visualStyle).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Estilo visual</div>
            <div className="dt-grid-3">
              {arr(data.visualStyle).map((s, i) => (
                <div className="dt-card" key={i}>
                  <div className="dt-card-titulo">{s.adjective}</div>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dt-grid-2">
          {arr(data.graphicElements).length > 0 && (
            <div className="dt-bloco">
              <div className="dt-bloco-label">Elementos gr&aacute;ficos</div>
              <ul className="dt-lista">
                {arr(data.graphicElements).map((e, i) => (<li key={i}>{e}</li>))}
              </ul>
            </div>
          )}
          {arr(data.visualDontDo).length > 0 && (
            <div className="dt-bloco">
              <div className="dt-bloco-label">O que N&Atilde;O fazer</div>
              <ul className="dt-lista dt-lista-dont">
                {arr(data.visualDontDo).map((e, i) => (<li key={i}>{e}</li>))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 03 TOM DE VOZ */}
      <section className="dt-sec" id="sec-3">
        <div className="dt-sec-header">
          <span className="dt-sec-num">03</span>
          <div>
            <h2>Tom de Voz e Comunica&ccedil;&atilde;o</h2>
            <p>Como a marca fala. O que usar e o que evitar.</p>
          </div>
        </div>

        {arr(data.voiceAdjectives).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">3 adjetivos que definem a voz</div>
            <div className="dt-grid-3">
              {arr(data.voiceAdjectives).map((v, i) => (
                <div className="dt-card" key={i}>
                  <div className="dt-card-titulo">{v.word}</div>
                  <p>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.communicationPersona && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Persona de comunica&ccedil;&atilde;o</div>
            <div className="dt-card dt-card-dark">
              <p>{data.communicationPersona}</p>
            </div>
          </div>
        )}

        <div className="dt-grid-2">
          {arr(data.copyOnBrand).length > 0 && (
            <div className="dt-bloco">
              <h4 className="dt-copy-h4">Copy ON-BRAND</h4>
              {arr(data.copyOnBrand).map((c, i) => (
                <div className="dt-copy-linha dt-copy-on" key={i}>
                  <span className="dt-copy-icone">&#10003;</span>
                  <span className="dt-copy-texto">{c}</span>
                </div>
              ))}
            </div>
          )}
          {arr(data.copyOffBrand).length > 0 && (
            <div className="dt-bloco">
              <h4 className="dt-copy-h4">Copy OFF-BRAND</h4>
              {arr(data.copyOffBrand).map((c, i) => (
                <div className="dt-copy-linha dt-copy-off" key={i}>
                  <span className="dt-copy-icone">&#10007;</span>
                  <span className="dt-copy-texto">{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dt-grid-2">
          {arr(data.alwaysUseWords).length > 0 && (
            <div className="dt-bloco">
              <div className="dt-bloco-label">Sempre usar</div>
              <div className="dt-tags">
                {arr(data.alwaysUseWords).map((w, i) => (
                  <span className="dt-tag dt-tag-verde" key={i}>{w}</span>
                ))}
              </div>
            </div>
          )}
          {arr(data.neverUseWords).length > 0 && (
            <div className="dt-bloco">
              <div className="dt-bloco-label">Nunca usar</div>
              <div className="dt-tags">
                {arr(data.neverUseWords).map((w, i) => (
                  <span className="dt-tag dt-tag-vermelho" key={i}>{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {arr(data.platformGuidelines).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Por plataforma</div>
            {arr(data.platformGuidelines).map((p, i) => (
              <div className="dt-platform" key={i}>
                <strong>{p.platform}</strong>
                <span>{p.guideline}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 04 CONCORRENTES */}
      <section className="dt-sec" id="sec-4">
        <div className="dt-sec-header">
          <span className="dt-sec-num">04</span>
          <div>
            <h2>Concorrentes e Refer&ecirc;ncias</h2>
            <p>O que j&aacute; existe no mercado e o que admiramos.</p>
          </div>
        </div>

        {arr(data.competitors).length > 0 && arr(data.competitors).map((c, i) => (
          <div className="dt-concorrente" key={i}>
            <div className="dt-concorrente-header">
              <span>{c.name} {c.handle && <small>{c.handle}</small>}</span>
              {c.location && <span className="dt-concorrente-loc">{c.location}</span>}
            </div>
            <div className="dt-concorrente-body">
              <div className="dt-concorrente-col dt-bom">
                <h5>Faz bem</h5>
                <p>{c.doWell}</p>
              </div>
              <div className="dt-concorrente-col dt-ruim">
                <h5>Faz mal</h5>
                <p>{c.doBad}</p>
              </div>
              <div className="dt-concorrente-col dt-dif">
                <h5>Nossa diferencia&ccedil;&atilde;o</h5>
                <p>{c.differentiation}</p>
              </div>
            </div>
          </div>
        ))}

        {arr(data.visualReferences).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Refer&ecirc;ncias visuais</div>
            <div className="dt-grid-2">
              {arr(data.visualReferences).map((r, i) => (
                <div className="dt-card" key={i}>
                  <div className="dt-card-titulo">{r.name}</div>
                  <p>{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 05 MATERIAIS */}
      <section className="dt-sec" id="sec-5">
        <div className="dt-sec-header">
          <span className="dt-sec-num">05</span>
          <div>
            <h2>Materiais e Ativos</h2>
            <p>O que o cliente tem e o que precisa ser criado.</p>
          </div>
        </div>

        {arr(data.existingAssets).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">J&aacute; existe</div>
            {arr(data.existingAssets).map((a, i) => (
              <div className="dt-ativo" key={i}>
                <div className="dt-ativo-icone dt-tem">&#10003;</div>
                <div className="dt-ativo-info">
                  <strong>{a.name}</strong>
                  <p>{a.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {arr(data.assetsToCreate).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Precisa ser criado</div>
            {arr(data.assetsToCreate).map((a, i) => {
              const prio = (a.priority || '').toLowerCase();
              const iconClass = prio === 'alta' ? 'dt-urgente' : 'dt-criar';
              return (
                <div className="dt-ativo" key={i}>
                  <div className={`dt-ativo-icone ${iconClass}`}>&#9679;</div>
                  <div className="dt-ativo-info">
                    <strong>{a.name} <span className={`dt-prio dt-prio-${prio}`}>{a.priority}</span></strong>
                    <p>{a.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 06 HISTORICO */}
      <section className="dt-sec" id="sec-6">
        <div className="dt-sec-header">
          <span className="dt-sec-num">06</span>
          <div>
            <h2>Hist&oacute;rico e Aprendizados</h2>
            <p>O que j&aacute; foi testado. O que ensinou.</p>
          </div>
        </div>

        <div className="dt-grid-2">
          {data.whatWorked && (
            <div className="dt-card">
              <div className="dt-card-titulo" style={{ color: '#2e7d32' }}>&#10003; O que funcionou</div>
              <p><strong>{safe(data.whatWorked.description)}</strong></p>
              {data.whatWorked.why && <p style={{ marginTop: 8 }}><em>Por qu&ecirc;: {data.whatWorked.why}</em></p>}
            </div>
          )}
          {data.whatFailed && (
            <div className="dt-card">
              <div className="dt-card-titulo" style={{ color: '#c62828' }}>&#10007; O que falhou</div>
              <p><strong>{safe(data.whatFailed.description)}</strong></p>
              {data.whatFailed.why && <p style={{ marginTop: 8 }}><em>Por qu&ecirc;: {data.whatFailed.why}</em></p>}
            </div>
          )}
        </div>

        {data.currentMotivation && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Motiva&ccedil;&atilde;o atual</div>
            <div className="dt-card dt-card-dark">
              <p>{data.currentMotivation}</p>
            </div>
          </div>
        )}

        {data.strategicNotes && (
          <div className="dt-alerta">
            <div className="dt-alerta-titulo">&#9888; Nota estrat&eacute;gica</div>
            <p>{data.strategicNotes}</p>
          </div>
        )}
      </section>

      {/* 07 ENTREGAS */}
      <section className="dt-sec" id="sec-7">
        <div className="dt-sec-header">
          <span className="dt-sec-num">07</span>
          <div>
            <h2>Direcionamento por Tipo de Entrega</h2>
            <p>Guia pr&aacute;tico pra cada formato.</p>
          </div>
        </div>

        {arr(data.deliveryGuidelines).map((d, i) => (
          <div className="dt-entrega" key={i}>
            <div className="dt-entrega-header">
              <span className="dt-entrega-tipo">{d.type}</span>
            </div>
            <div className="dt-entrega-body">
              <div className="dt-entrega-col">
                <h5>Objetivo</h5>
                <p>{d.objective}</p>
              </div>
              <div className="dt-entrega-col">
                <h5>Dire&ccedil;&atilde;o Visual</h5>
                <p>{d.visualDirection}</p>
              </div>
              <div className="dt-entrega-col">
                <h5>Evitar</h5>
                <p>{d.avoid}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 08 CHECKLIST */}
      <section className="dt-sec" id="sec-8">
        <div className="dt-sec-header">
          <span className="dt-sec-num">08</span>
          <div>
            <h2>Checklist do Designer</h2>
            <p>A&ccedil;&otilde;es imediatas, pend&ecirc;ncias e perguntas.</p>
          </div>
        </div>

        {arr(data.immediateActions).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">A&ccedil;&otilde;es imediatas</div>
            {arr(data.immediateActions).map((a, i) => (
              <div className="dt-check-item" key={i}>
                <div className="dt-check-box" />
                <span>{a}</span>
              </div>
            ))}
          </div>
        )}

        {arr(data.pendingItems).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Pend&ecirc;ncias</div>
            {arr(data.pendingItems).map((p, i) => (
              <div className="dt-pendente" key={i}>
                <strong>{p.item}</strong>
                <span>{p.details}</span>
              </div>
            ))}
          </div>
        )}

        {arr(data.pendingQuestions).length > 0 && (
          <div className="dt-bloco">
            <div className="dt-bloco-label">Perguntas pendentes para o cliente</div>
            <ul className="dt-lista dt-lista-q">
              {arr(data.pendingQuestions).map((q, i) => (<li key={i}>{q}</li>))}
            </ul>
          </div>
        )}

        {data.designerSummary && (
          <div className="dt-destaque">
            <strong>Resumo:</strong> {data.designerSummary}
          </div>
        )}
      </section>

      <footer className="dt-footer">
        <strong>{safe(data.clientName, clientName)}</strong> &middot; Dossi&ecirc; de Identidade Visual<br />
        Gerado pela V4 Ruston &amp; Co. em {dateStr}
      </footer>
    </div>
  );
}
