import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { simAnalysis } from '../services/analyzer';
import SECTIONS from '../data/sections';
import './Loading.css';

// Converte simAnalysis (formato aninhado {secId:{fieldKey:texto}}) para formato
// flat {fieldKey:{found,content}} — mesmo formato que a API OpenRouter retorna
function simAnalysisToFlat(content) {
  const nested = simAnalysis(content);
  const flat = {};
  SECTIONS.forEach(sec => {
    sec.fields.forEach(f => {
      const text = (nested[sec.id]?.[f.key] || '').trim();
      flat[f.key] = { found: !!text, content: text };
    });
  });
  return flat;
}

export default function Loading() {
  const navigate = useNavigate();
  const { dispatch } = useForm();
  const [visibleItems, setVisibleItems] = useState([]);
  const [showCancel, setShowCancel] = useState(false);
  const [statusText, setStatusText] = useState('Analisando o documento...');
  const [slowWarning, setSlowWarning] = useState(false);
  const aborted = useRef(false);
  const abortController = useRef(null);

  useEffect(() => {
    aborted.current = false;
    abortController.current = new AbortController();

    // Animacao sequencial das secoes
    const timers = SECTIONS.map((_, i) =>
      setTimeout(() => {
        if (!aborted.current) setVisibleItems((prev) => [...prev, i]);
      }, 200 + i * 300)
    );

    // Botao cancelar aparece depois de 1.5s
    const cancelTimer = setTimeout(() => {
      if (!aborted.current) setShowCancel(true);
    }, 1500);

    // Mensagens de status evolutivas (transparencia de espera)
    const statusTimer1 = setTimeout(() => {
      if (!aborted.current) setStatusText('A IA est\u00e1 lendo o conte\u00fado...');
    }, 5000);
    const statusTimer2 = setTimeout(() => {
      if (!aborted.current) setStatusText('Quase l\u00e1... extraindo informa\u00e7\u00f5es');
    }, 20000);
    const slowTimer = setTimeout(() => {
      if (!aborted.current) setSlowWarning(true);
    }, 60000);

    // Analise assincrona: API primeiro, simAnalysis como fallback
    const analyzeDocument = async () => {
      const fileBase64 = sessionStorage.getItem('uploadedFileBase64') || '';
      const fileName = sessionStorage.getItem('uploadedFileName') || '';
      const legacyContent = sessionStorage.getItem('uploadedFileContent') || '';

      let analysis = null;
      let textForFallback = legacyContent;

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
        console.log('[Loading] API mode:', data.mode, '| analysis keys:', data.analysis ? Object.keys(data.analysis).length : 0);

        if (data.mode === 'api' && data.analysis) {
          // Usa o formato flat da IA direto — { fieldKey: { found, content } }
          analysis = data.analysis;
        }
        // Texto extraido pelo backend (mammoth) tambem vem de volta para fallback
        if (data.extractedText) textForFallback = data.extractedText;
        else if (data.content) textForFallback = data.content;
      } catch (err) {
        if (err.name === 'AbortError') { console.log('[Loading] Abortado'); return; }
        console.error('[Loading] API erro:', err.message);
      }

      if (aborted.current) return;

      // Fallback local se API nao retornou analysis
      if (!analysis) {
        console.log('[Loading] Usando simAnalysis local (fallback)');
        analysis = simAnalysisToFlat(textForFallback);
      }

      const foundCount = Object.values(analysis).filter(v => v && v.found).length;
      console.log('[Loading] Total encontrados:', foundCount, '/', Object.keys(analysis).length);

      dispatch({ type: 'LOAD_ANALYSIS', payload: analysis });
      navigate('/result', { replace: true });
    };

    analyzeDocument();

    return () => {
      aborted.current = true;
      abortController.current?.abort();
      timers.forEach(clearTimeout);
      clearTimeout(cancelTimer);
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);
      clearTimeout(slowTimer);
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
      {slowWarning && (
        <div style={{ fontSize: 12, color: 'var(--text-muted, #888)', marginTop: -24, marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
          Est&aacute; demorando mais que o normal. Voc&ecirc; pode cancelar e tentar de novo.
        </div>
      )}
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
