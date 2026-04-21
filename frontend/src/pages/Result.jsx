import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import './Result.css';

// analysisData agora eh flat: { fieldKey: { found, content } }
function isFound(analysisData, fieldKey) {
  const item = analysisData[fieldKey];
  return !!(item && item.found && (item.content || '').trim());
}

function getContent(analysisData, fieldKey) {
  const item = analysisData[fieldKey];
  return item && item.found ? (item.content || '').trim() : '';
}

export default function Result() {
  const navigate = useNavigate();
  const { analysisData, formData, updateField, dispatch } = useForm();
  const [manualData, setManualData] = useState({});
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const found = Object.values(analysisData).filter(v => v && v.found).length;
    console.log('[Result] Total fields found:', found, '/', Object.keys(analysisData).length);
  }, [analysisData]);

  const updateManual = useCallback((key, value) => {
    setManualData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const mergeAll = useCallback(() => {
    SECTIONS.forEach((sec) => {
      sec.fields.forEach((f) => {
        const manual = (manualData[f.key] || '').trim();
        const found = getContent(analysisData, f.key);
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
        <span style={{ fontSize: 13, color: 'var(--text-secondary, #AAA)' }}>Resultado da An&aacute;lise</span>
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
            const filledFields = sec.fields.filter((f) => isFound(analysisData, f.key));
            const emptyFields = sec.fields.filter((f) => !isFound(analysisData, f.key));
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
                  <div className="res-field-block" key={f.key}>
                    <div className="res-field-label">{f.label.split('?')[0].split('\u2014')[0].trim()}</div>
                    <div className="res-txt">{getContent(analysisData, f.key)}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="res-col res-miss">
          <div className="res-ct">O QUE EST&Aacute; FALTANDO</div>
          {SECTIONS.map((sec) => {
            const emptyFields = sec.fields.filter((f) => !isFound(analysisData, f.key));
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
