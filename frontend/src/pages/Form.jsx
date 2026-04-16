import { useRef, useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { useAutoResize } from '../hooks/useAutoResize';
import SECTIONS from '../data/sections';
import './Form.css';

export default function Form() {
  const navigate = useNavigate();
  const { formData, updateField, resetForm } = useForm();
  const autoResize = useAutoResize();
  const mainRef = useRef(null);
  const [activeSection, setActiveSection] = useState('business');
  const [pulseSections, setPulseSections] = useState([]);
  const [cardOpen, setCardOpen] = useState(false);

  const baseSection = SECTIONS.find(s => s.block === 'dados-base');
  const reuniaoSections = SECTIONS.filter(s => s.block === 'reuniao');

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

    const requiredReuniao = reuniaoSections.filter(s => s.required);
    const missing = requiredReuniao.filter(s => !s.fields.some(f => (formData[f.key] || '').trim()));
    if (missing.length > 0) {
      setPulseSections(missing.map(s => s.id));
      navTo(missing[0].id);
      setTimeout(() => setPulseSections([]), 3000);
      return;
    }

    const partial = requiredReuniao.filter(s => {
      const filled = s.fields.filter(f => (formData[f.key] || '').trim()).length;
      return filled > 0 && filled < s.fields.length;
    });
    if (partial.length) {
      const names = partial.map(s => `${s.num}. ${s.title}`).join(', ');
      if (!confirm(`As se\u00e7\u00f5es ${names} t\u00eam campos vazios. Deseja gerar mesmo assim?`)) return;
    }

    navigate('/output');
  };

  const handleInput = (key, value, el) => {
    updateField(key, value);
    autoResize(el);
  };

  const pct = getProgress();

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

        {/* Card de Dados Base - sempre visivel entre header e perguntas */}
        <div className={`client-card ${cardOpen ? 'open' : ''}`}>
          <div className="client-card-header">
            <span className="client-card-title">DADOS DO CLIENTE</span>
            <button
              className="client-card-toggle"
              onClick={() => setCardOpen(!cardOpen)}
            >
              {cardOpen ? '\u2713 Salvar' : '\u270E Editar'}
            </button>
          </div>

          {cardOpen ? (
            /* Estado ABERTO — inputs editaveis */
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
            /* Estado FECHADO — dados resumidos */
            <div className="client-card-summary">
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Empresa</span>
                  <span className="client-card-value">{formData.clientCompany || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Nicho</span>
                  <span className="client-card-value">{formData.clientNiche || '\u2014'}</span>
                </div>
              </div>
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Cidade</span>
                  <span className="client-card-value">{formData.clientCity || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Site</span>
                  <span className="client-card-value">{formData.clientWebsite || '\u2014'}</span>
                </div>
              </div>
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Instagram</span>
                  <span className="client-card-value">{formData.clientInstagram || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Redes</span>
                  <span className="client-card-value">{formData.clientOtherSocial || '\u2014'}</span>
                </div>
              </div>
              <div className="client-card-row">
                <div className="client-card-item">
                  <span className="client-card-label">Concorrente 1</span>
                  <span className="client-card-value">{formData.competitor1 || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Concorrente 2</span>
                  <span className="client-card-value">{formData.competitor2 || '\u2014'}</span>
                </div>
                <div className="client-card-item">
                  <span className="client-card-label">Concorrente 3</span>
                  <span className="client-card-value">{formData.competitor3 || '\u2014'}</span>
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
