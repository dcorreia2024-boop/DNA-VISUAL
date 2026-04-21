import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { simAnalysis } from '../services/analyzer';
import SECTIONS from '../data/sections';
import './Loading.css';

// Map each field key to its section id (for normalizing API response)
const FIELD_TO_SECTION = {};
SECTIONS.forEach(sec => sec.fields.forEach(f => { FIELD_TO_SECTION[f.key] = sec.id; }));

// Convert API response { fieldKey: { found, content } } to
// simAnalysis format { sectionId: { fieldKey: content } }
function normalizeApiAnalysis(apiAnalysis) {
  const result = {};
  SECTIONS.forEach(sec => { result[sec.id] = {}; });
  Object.entries(apiAnalysis || {}).forEach(([fieldKey, data]) => {
    const secId = FIELD_TO_SECTION[fieldKey];
    if (!secId) return;
    const content = data && typeof data === 'object' && data.found ? (data.content || '') : '';
    result[secId][fieldKey] = content;
  });
  return result;
}

export default function Loading() {
  const navigate = useNavigate();
  const { dispatch } = useForm();
  const [visibleItems, setVisibleItems] = useState([]);
  const [showCancel, setShowCancel] = useState(false);
  const [statusText, setStatusText] = useState('Analisando o documento...');
  const aborted = useRef(false);
  const abortController = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
    aborted.current = false;
    abortController.current = new AbortController();

    // Animação sequencial de seções
    const timers = SECTIONS.map((_, i) =>
      setTimeout(() => {
        if (!aborted.current) setVisibleItems((prev) => [...prev, i]);
      }, 200 + i * 300)
    );

    const cancelTimer = setTimeout(() => {
      if (!aborted.current) setShowCancel(true);
    }, 1500);

    // Trocar mensagem depois de um tempo (transparência de espera)
    const statusTimer1 = setTimeout(() => {
      if (!aborted.current) setStatusText('A IA est\u00e1 lendo o conte\u00fado...');
    }, 4000);
    const statusTimer2 = setTimeout(() => {
      if (!aborted.current) setStatusText('Quase l\u00e1... extraindo informa\u00e7\u00f5es');
    }, 15000);

    // Analise assincrona (API com fallback local)
    const analyze = async () => {
      const fileBase64 = sessionStorage.getItem('uploadedFileBase64') || '';
      const fileName = sessionStorage.getItem('uploadedFileName') || '';
      // Fallback para fluxo antigo (content direto)
      const legacyContent = sessionStorage.getItem('uploadedFileContent') || '';
      let analysis = null;
      let extractedText = '';

      try {
        const body = fileBase64 && fileName
          ? { fileBase64, fileName }
          : { content: legacyContent };

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: abortController.current.signal
        });
        const data = await response.json();
        if (data.extractedText) extractedText = data.extractedText;
        if (data.mode === 'api' && data.analysis) {
          analysis = normalizeApiAnalysis(data.analysis);
        } else if (data.content) {
          // API retornou o texto extraido mesmo em fallback — usa no simAnalysis
          extractedText = data.content;
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.log('API indispon\u00edvel, usando an\u00e1lise local:', err.message);
      }

      if (aborted.current) return;

      // Fallback local se API falhou — usa texto extraido pelo backend se tiver, senao o content legado
      if (!analysis) {
        const textForLocal = extractedText || legacyContent;
        analysis = simAnalysis(textForLocal);
      }

      // Garante que a animacao rode pelo menos 2s para nao "piscar"
      const minDuration = SECTIONS.length * 300 + 800;
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (aborted.current) return;
        dispatch({ type: 'LOAD_ANALYSIS', payload: analysis });
        navigate('/result', { replace: true });
      }, remaining);
    };

    analyze();

    return () => {
      aborted.current = true;
      abortController.current?.abort();
      timers.forEach(clearTimeout);
      clearTimeout(cancelTimer);
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
    };
  }, [dispatch, navigate]);

  const handleCancel = () => {
    aborted.current = true;
    abortController.current?.abort();
    navigate('/upload');
  };

  return (
    <div className="ld-screen">
      <div className="ld-t">{statusText}</div>
      <div className="ld-secs">
        {SECTIONS.map((s, i) => (
          <div className={`ld-i${visibleItems.includes(i) ? ' vis' : ''}`} key={s.id}>
            <div className="ld-i-l"><span className="n">{s.num}</span> {s.title}</div>
            <div className="ld-bar"><div className="ld-fill" /></div>
          </div>
        ))}
      </div>
      {showCancel && (
        <button className="btn btn-o ld-cancel" onClick={handleCancel}>CANCELAR</button>
      )}
    </div>
  );
}
