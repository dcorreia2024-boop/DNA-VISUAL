import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import SECTIONS from '../data/sections';
import './Result.css';

// analysisData vem do sessionStorage em formato flat: { fieldKey: { found, content } }
function isFound(analysisData, fieldKey) {
  const item = analysisData?.[fieldKey];
  return !!(item && item.found && (item.content || '').trim());
}

function getContent(analysisData, fieldKey) {
  const item = analysisData?.[fieldKey];
  return item && item.found ? (item.content || '').trim() : '';
}

export default function Result() {
  const navigate = useNavigate();
  const { updateField } = useForm();
  const [manualData, setManualData] = useState({});
  const [clientName, setClientName] = useState('');

  // Le analise direto do sessionStorage — NAO do FormContext
  const [analysisData] = useState(() => {
    const saved = sessionStorage.getItem('dna_analysis_result');
    return saved ? JSON.parse(saved) : {};
  });

  const apiUnavailable = sessionStorage.getItem('analysisApiUnavailable') === '1';
  const extractedText = sessionStorage.getItem('extractedDocumentText') || '';

  const updateManual = useCallback((key, value) => {
    setManualData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // "GERAR DOSSIE COM O QUE TENHO" — NAO toca no FormContext.
  // Monta payload temporario e passa via sessionStorage + route state.
  const handleGenerate = () => {
    const tempData = {};
    SECTIONS.forEach(sec => {
      sec.fields.forEach(f => {
        const manual = (manualData[f.key] || '').trim();
        const found = getContent(analysisData, f.key);
        if (manual) tempData[f.key] = manual;
        else if (found) tempData[f.key] = found;
      });
    });
    tempData.clientName = clientName.trim() || 'Cliente (via an\u00e1lise)';
    tempData.designerName = 'Designer';

    sessionStorage.setItem('dna_temp_output_data', JSON.stringify(tempData));
    navigate('/output', { state: { fromAnalysis: true } });
  };

  // "COMPLETAR O QUE FALTA" — AQUI sim faz merge no FormContext
  const handleComplete = () => {
    SECTIONS.forEach(sec => {
      sec.fields.forEach(f => {
        const manual = (manualData[f.key] || '').trim();
        const found = getContent(analysisData, f.key);
        if (manual) updateField(f.key, manual);
        else if (found) updateField(f.key, found);
      });
    });
    if (clientName.trim()) updateField('clientName', clientName.trim());
    // Limpa os dados temporarios da analise — agora estao no formData
    sessionStorage.removeItem('dna_analysis_result');
    sessionStorage.removeItem('dna_temp_output_data');
    sessionStorage.removeItem('extractedDocumentText');
    sessionStorage.removeItem('analysisApiUnavailable');
    requestAnimationFrame(() => navigate('/form'));
  };

  return (
    <div className="res-screen">
      <div className="res-top">
        <button className="btn-back" onClick={() => navigate('/upload')}>&larr; VOLTAR</button>
        <span style={{ fontSize: 13, color: 'var(--text-secondary, #AAA)' }}>Resultado da An&aacute;lise</span>
        <button className="btn-back" onClick={() => navigate('/')} style={{ marginLeft: 'auto' }}>HOME</button>
      </div>

      {apiUnavailable && (
        <div style={{
          background: 'rgba(192, 57, 43, 0.08)',
          border: '1px solid rgba(192, 57, 43, 0.3)',
          borderLeft: '3px solid var(--red, #C0392B)',
          padding: '12px 20px',
          margin: '70px 32px 0 32px',
          fontSize: 13,
          color: 'var(--text-secondary, #AAA)'
        }}>
          <strong style={{ color: 'var(--red, #C0392B)', textTransform: 'uppercase', letterSpacing: 1, fontSize: 11, display: 'block', marginBottom: 4 }}>An&aacute;lise autom&aacute;tica indispon&iacute;vel</strong>
          A IA n&atilde;o est&aacute; dispon&iacute;vel no momento. Use o formul&aacute;rio ao lado para preencher os campos manualmente com base no conte&uacute;do do documento.
        </div>
      )}

      <div className="res-cols" style={apiUnavailable ? { marginTop: 20 } : {}}>
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
          {apiUnavailable && extractedText && (
            <div style={{ marginBottom: 20 }}>
              <div className="res-ct" style={{ fontSize: 16 }}>CONTE&Uacute;DO DO DOCUMENTO</div>
              <div style={{
                maxHeight: 300,
                overflowY: 'auto',
                fontSize: 12,
                color: 'var(--text-tertiary, #888)',
                lineHeight: 1.6,
                background: 'var(--bg-input, #111)',
                padding: 16,
                border: '1px solid var(--border-default, #1A1A1A)',
                whiteSpace: 'pre-wrap'
              }}>
                {extractedText.slice(0, 3000)}
                {extractedText.length > 3000 && '\n\n[... texto truncado ...]'}
              </div>
            </div>
          )}
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
