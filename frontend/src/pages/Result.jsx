import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import './Result.css';

export default function Result() {
  const navigate = useNavigate();
  const { analysisData, formData, updateField, dispatch } = useForm();
  const [manualData, setManualData] = useState({});
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const summary = {};
    SECTIONS.forEach(sec => {
      const secData = analysisData[sec.id] || {};
      const filled = sec.fields.filter(f => (secData[f.key] || '').trim()).length;
      summary[sec.id] = filled + '/' + sec.fields.length;
    });
    console.log('[Result] analysisData sections:', Object.keys(analysisData));
    console.log('[Result] Campos por secao:', summary);
  }, [analysisData]);

  const updateManual = useCallback((key, value) => {
    setManualData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const mergeAll = useCallback(() => {
    SECTIONS.forEach((sec) => {
      const secData = analysisData[sec.id] || {};
      sec.fields.forEach((f) => {
        const manual = (manualData[f.key] || '').trim();
        const found = (secData[f.key] || '').trim();
        if (manual) updateField(f.key, manual);
        else if (found) updateField(f.key, found);
      });
    });
  }, [analysisData, manualData, updateField]);

  const handleGenerate = () => {
    mergeAll();
    if (clientName.trim()) updateField('clientName', clientName.trim());
    else if (!formData.clientName) updateField('clientName', 'Cliente (via an\u00e1lise)');
    if (!formData.designerName) updateField('designerName', 'Designer');
    setTimeout(() => navigate('/output'), 50);
  };

  const handleComplete = () => {
    mergeAll();
    if (clientName.trim()) updateField('clientName', clientName.trim());
    setTimeout(() => navigate('/form'), 50);
  };

  return (
    <div className="res-screen">
      <div className="res-top">
        <button className="btn-back" onClick={() => navigate('/upload')}>&larr; VOLTAR</button>
        <span style={{ fontSize: 13, color: 'var(--g300)' }}>Resultado da An&aacute;lise</span>
        <button className="btn-back" onClick={() => navigate('/')} style={{ marginLeft: 'auto' }}>HOME</button>
      </div>

      <div className="res-cols">
        <div className="res-col res-found">
          <div className="res-name">
            <label>Nome do Cliente:</label>
            <input
              className="inp"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Digite o nome do cliente"
            />
          </div>
          <div className="res-ct">O QUE FOI ENCONTRADO</div>
          {SECTIONS.map((sec) => {
            const secData = analysisData[sec.id] || {};
            const filledFields = sec.fields.filter((f) => (secData[f.key] || '').trim());
            const emptyFields = sec.fields.filter((f) => !(secData[f.key] || '').trim());
            if (filledFields.length === 0) return null;
            const status = emptyFields.length === 0 ? 'ok' : 'part';
            return (
              <div className="res-sec" key={sec.id}>
                <div className="res-sh">
                  <span className={`res-st ${status}`} />
                  <span className="res-sn">{sec.num}</span>
                  <span className="res-sl">{sec.title}</span>
                </div>
                {filledFields.map((f) => (
                  <div className="res-txt" key={f.key}>{secData[f.key]}</div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="res-col res-miss">
          <div className="res-ct">O QUE EST&Aacute; FALTANDO</div>
          {SECTIONS.map((sec) => {
            const secData = analysisData[sec.id] || {};
            const emptyFields = sec.fields.filter((f) => !(secData[f.key] || '').trim());
            if (emptyFields.length === 0) return null;
            return (
              <div className="res-sec" key={sec.id}>
                <div className="res-sh">
                  <span className="res-st no" />
                  <span className="res-sn">{sec.num}</span>
                  <span className="res-sl">{sec.title}</span>
                </div>
                {emptyFields.map((f) => (
                  <div className="res-miss-field" key={f.key}>
                    <label>{f.label}</label>
                    <textarea
                      className="txa"
                      value={manualData[f.key] || ''}
                      onChange={(e) => updateManual(f.key, e.target.value)}
                      placeholder="Preencha manualmente..."
                      rows={1}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="res-ft">
        <button className="btn btn-r" onClick={handleGenerate}>GERAR DOSSI&Ecirc; COM O QUE TENHO</button>
        <button className="btn btn-o" onClick={handleComplete}>COMPLETAR O QUE FALTA</button>
      </div>
    </div>
  );
}
