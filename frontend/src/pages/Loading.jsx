import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SECTIONS from '../data/sections';
import './Loading.css';

// Retorna analysis vazia (todos os campos found:false) para usar quando a API falha
function emptyAnalysis() {
  const flat = {};
  SECTIONS.forEach(sec => {
    sec.fields.forEach(f => {
      flat[f.key] = { found: false, content: '' };
    });
  });
  return flat;
}

export default function Loading() {
  const navigate = useNavigate();
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

    const analyzeDocument = async () => {
      const fileBase64 = sessionStorage.getItem('uploadedFileBase64') || '';
      const fileName = sessionStorage.getItem('uploadedFileName') || '';
      const legacyContent = sessionStorage.getItem('uploadedFileContent') || '';

      let analysis = null;
      let extractedText = legacyContent;
      let apiUnavailable = false;

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

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.mode === 'api' && data.analysis) {
          analysis = data.analysis;
        } else {
          apiUnavailable = true;
        }
        if (data.extractedText) extractedText = data.extractedText;
        else if (data.content) extractedText = data.content;
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('[Loading] API erro:', err.message);
        apiUnavailable = true;
      }

      if (aborted.current) return;

      // Se API falhou, usa analysis vazia + guarda o texto extraido pro Result mostrar como referencia
      if (!analysis) {
        analysis = emptyAnalysis();
      }

      // Guarda em sessionStorage (NAO no FormContext — analise fica isolada
      // ate o designer decidir explicitamente se quer mesclar com o form)
      sessionStorage.setItem('dna_analysis_result', JSON.stringify(analysis));
      sessionStorage.setItem('analysisApiUnavailable', apiUnavailable ? '1' : '0');
      if (extractedText) sessionStorage.setItem('extractedDocumentText', extractedText);

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
  }, [navigate]);

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
