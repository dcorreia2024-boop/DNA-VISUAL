import { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useTheme } from '../context/ThemeContext';
import { useAutoResize } from '../hooks/useAutoResize';
import SECTIONS from '../data/sections';
import './Form.css';

export default function Form() {
  const navigate = useNavigate();
  const { formData, updateField, resetForm } = useForm();
  const { theme, toggleTheme } = useTheme();
  const autoResize = useAutoResize();
  const mainRef = useRef(null);
  const baseSection = SECTIONS.find(s => s.block === 'dados-base');
  const reuniaoSections = SECTIONS.filter(s => s.block === 'reuniao');
  const [activeSection, setActiveSection] = useState(reuniaoSections[0]?.id || '');
  const [pulseSections, setPulseSections] = useState([]);
  const [cardOpen, setCardOpen] = useState(false);

  const getSectionState = useCallback((sec) => {
    const filled = sec.fields.filter(f => (formData[f.key] || '').trim()).length;
    if (filled === 0) return '';
    if (filled < sec.fields.length) return 'partial';
    return 'filled';
  }, [formData]);

  const getProgress = useCallback(() => {
    const cn = (formData.clientName || '').trim();
    const dn = (formData.designerName || '').trim();
    let total = 2, filled = (cn ? 1 : 0) + (dn ? 1 : 0);
    SECTIONS.forEach(sec => sec.fields.forEach(f => {
      total++;
      if ((formData[f.key] || '').trim()) filled++;
    }));
    return total ? Math.round((filled / total) * 100) : 0;
  }, [formData]);

  const navTo = useCallback((id) => {
    const el = document.getElementById(id);
    const main = mainRef.current;
    if (!el || !main) return;
    const top = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - main.querySelector('.fhead').offsetHeight - 20;
    main.scrollTop = top;
  }, []);

  // Scroll spy — only reuniao sections
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { root: main, rootMargin: '-20% 0px -60% 0px' }
    );
    reuniaoSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleGenerate = () => {
    const clientName = (formData.clientName || '').trim();
    if (!clientName) { alert('Preencha o nome do cliente.'); return; }

    const clientCompany = (formData.clientCompany || '').trim();
    if (!clientCompany) { alert('Preencha o nome da empresa nos Dados do Cliente.'); setCardOpen(true); return; }

    // Avisa (nao bloqueia) se secoes obrigatorias estao incompletas
    const requiredReuniao = reuniaoSections.filter(s => s.required);
    const incomplete = requiredReuniao.filter(s => {
      const filled = s.fields.filter(f => (formData[f.key] || '').trim()).length;
      return filled < s.fields.length;
    });

    if (incomplete.length > 0) {
      const names = incomplete.map(s => `${s.num}. ${s.title}`).join(', ');
      setPulseSections(incomplete.map(s => s.id));
      setTimeout(() => setPulseSections([]), 3000);
      if (!confirm(`Algumas se\u00e7\u00f5es est\u00e3o incompletas:\n\n${names}\n\nDeseja gerar o dossi\u00ea mesmo assim?`)) {
        navTo(incomplete[0].id);
        return;
      }
    }

    navigate('/output');
  };

  const handleInput = (key, value, el) => {
    updateField(key, value);
    autoResize(el);
  };

  const pct = getProgress();

  // Card summary: check if any base field has value
  const baseHasData = baseSection.fields.some(f => (formData[f.key] || '').trim());

  return (
    <div className="form-screen">
      <aside className="fsb">
        <div className="fsb-top">
          <button className="btn-back" onClick={() => navigate('/')}>&larr; HOME</button>
          <div className="fsb-brand">
            <div className="v4 v4s">V4</div>
            <div className="brand">
              <div className="brand-n" style={{ fontSize: 13 }}>DNA Visual</div>
              <div className="brand-s" style={{ fontSize: 10 }}>by V4 Ruston &amp; Co.</div>
            </div>
          </div>
        </div>
        <nav className="fsb-nav">
          <div className="fsb-block-label fsb-block-reuniao">REUNI&Atilde;O COM O CLIENTE</div>
          {reuniaoSections.map((s) => (
            <div
              key={s.id}
              className={`fnav${activeSection === s.id ? ' on' : ''} ${getSectionState(s)}${pulseSections.includes(s.id) ? ' pulse' : ''}`}
              onClick={() => navTo(s.id)}
            >
              <span className="fnav-n">{s.num}</span>
              <span className="fnav-l">{s.title}</span>
              <span className="fnav-d" />
            </div>
          ))}
        </nav>
        <div className="fsb-ft">
          <div className="fsb-pl"><span>Progresso</span><span>{pct}%</span></div>
          <div className="fsb-pb"><div className="fsb-pf" style={{ width: `${pct}%` }} /></div>
          <button className="fsb-reset" onClick={() => {
            if (confirm('Limpar todos os dados e come\u00e7ar um novo cliente?')) resetForm();
          }}>Novo Cliente</button>
          <div className="theme-toggle" onClick={toggleTheme}>
            <div className={`theme-toggle-track ${theme === 'light' ? 'active' : ''}`}>
              <div className="theme-toggle-thumb" />
            </div>
            <span className="theme-toggle-label">
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </span>
          </div>
        </div>
      </aside>

      <div className="fmain" ref={mainRef}>
        {/* Mobile nav */}
        <div className="mnav">
          {reuniaoSections.map(s => (
            <div
              key={s.id}
              className={`mnav-i${activeSection === s.id ? ' on' : ''} ${getSectionState(s)}`}
              onClick={() => navTo(s.id)}
            >{s.num}</div>
          ))}
          <div className="mprog">
            <span>{pct}%</span>
            <div className="mprog-b"><div className="mprog-f" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>

        <div className="fhead">
          <div className="fd">
            <label>Nome do Cliente</label>
            <input
              className="inp"
              type="text"
              value={formData.clientName || ''}
              onChange={(e) => updateField('clientName', e.target.value)}
              placeholder="Ex: Studio Bella Decor"
            />
          </div>
          <div className="fd">
            <label>Nome do Designer</label>
            <input
              className="inp"
              type="text"
              value={formData.designerName || ''}
              onChange={(e) => updateField('designerName', e.target.value)}
              placeholder="Seu nome"
            />
          </div>
        </div>

        {/* Card de Dados Base */}
        <div className={`client-card ${cardOpen ? 'open' : ''}`}>
          <div className="client-card-header">
            <div className="client-card-title-wrap">
              <span className="client-card-title">DADOS DO CLIENTE</span>
              <span className="client-card-badge">IA PESQUISA</span>
            </div>
            <button
              className="client-card-toggle"
              onClick={() => setCardOpen(!cardOpen)}
            >
              {cardOpen ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg> Salvar</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editar</>
              )}
            </button>
          </div>

          {cardOpen ? (
            <div className="client-card-form">
              <div className="client-card-grid-2">
                {baseSection.fields.slice(0, 6).map((f) => (
                  <div className="client-card-field" key={f.key}>
                    <label>{f.label.split('(')[0].trim()}</label>
                    <input
                      className="inp"
                      type="text"
                      value={formData[f.key] || ''}
                      onChange={(e) => updateField(f.key, e.target.value)}
                      placeholder={f.placeholder || 'Digite aqui...'}
                    />
                  </div>
                ))}
              </div>
              <div className="client-card-grid-3">
                {baseSection.fields.slice(6, 9).map((f) => (
                  <div className="client-card-field" key={f.key}>
                    <label>{f.label.split('\u2014')[0].trim()}</label>
                    <input
                      className="inp"
                      type="text"
                      value={formData[f.key] || ''}
                      onChange={(e) => updateField(f.key, e.target.value)}
                      placeholder="Nome + @ ou site"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="client-card-summary">
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Empresa</span>
                  <span className={`client-card-value ${formData.clientCompany ? 'filled' : 'empty'}`}>{formData.clientCompany || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Nicho</span>
                  <span className={`client-card-value ${formData.clientNiche ? 'filled' : 'empty'}`}>{formData.clientNiche || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Cidade</span>
                  <span className={`client-card-value ${formData.clientCity ? 'filled' : 'empty'}`}>{formData.clientCity || '\u2014'}</span>
                </div>
              </div>
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Site</span>
                  <span className={`client-card-value ${formData.clientWebsite ? 'filled' : 'empty'}`}>{formData.clientWebsite || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Instagram</span>
                  <span className={`client-card-value ${formData.clientInstagram ? 'filled' : 'empty'}`}>{formData.clientInstagram || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Redes</span>
                  <span className={`client-card-value ${formData.clientOtherSocial ? 'filled' : 'empty'}`}>{formData.clientOtherSocial || '\u2014'}</span>
                </div>
              </div>
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Concorrente 1</span>
                  <span className={`client-card-value ${formData.competitor1 ? 'filled' : 'empty'}`}>{formData.competitor1 || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Concorrente 2</span>
                  <span className={`client-card-value ${formData.competitor2 ? 'filled' : 'empty'}`}>{formData.competitor2 || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Concorrente 3</span>
                  <span className={`client-card-value ${formData.competitor3 ? 'filled' : 'empty'}`}>{formData.competitor3 || '\u2014'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fcontent">
          {reuniaoSections.map((sec) => (
            <div key={sec.id}>
              <div className="fsec" id={sec.id}>
                <div className="fsec-bg">{sec.num}</div>
                <div className="fsec-head">
                  <div className="fsec-t">{sec.num}. {sec.title.toUpperCase()}</div>
                  <div className="fsec-line" />
                  {!sec.required && (
                    <div className="section-subtitle">Se&ccedil;&atilde;o opcional &mdash; preencha se tiver a informa&ccedil;&atilde;o</div>
                  )}
                </div>
                <div className="ffields">
                  {sec.fields.map((f) => (
                    <div className="ffield" key={f.key}>
                      <label>
                        {f.label}
                        {f.optional && <span className="opt-tag">Opcional</span>}
                      </label>
                      {f.type === 'input' ? (
                        <input
                          className="inp"
                          type="text"
                          value={formData[f.key] || ''}
                          onChange={(e) => updateField(f.key, e.target.value)}
                          placeholder={f.placeholder || 'Digite aqui...'}
                        />
                      ) : (
                        <textarea
                          className="txa"
                          value={formData[f.key] || ''}
                          onChange={(e) => handleInput(f.key, e.target.value, e.target)}
                          placeholder="Digite aqui..."
                          rows={1}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ffoot">
        <button className="btn btn-r" onClick={handleGenerate}>
          GERAR DOSSI&Ecirc; DE IDENTIDADE VISUAL
        </button>
      </div>
    </div>
  );
}
