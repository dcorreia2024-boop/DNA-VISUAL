import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { simAnalysis } from '../services/analyzer';
import SECTIONS from '../data/sections';
import './Loading.css';

export default function Loading() {
  const navigate = useNavigate();
  const { dispatch } = useForm();
  const [visibleItems, setVisibleItems] = useState([]);
  const [showCancel, setShowCancel] = useState(false);
  const aborted = useRef(false);

  useEffect(() => {
    aborted.current = false;

    const timers = SECTIONS.map((_, i) =>
      setTimeout(() => {
        if (!aborted.current) setVisibleItems((prev) => [...prev, i]);
      }, 200 + i * 300)
    );

    const cancelTimer = setTimeout(() => {
      if (!aborted.current) setShowCancel(true);
    }, 1000);

    const analysisTimer = setTimeout(() => {
      if (aborted.current) return;
      const content = sessionStorage.getItem('uploadedFileContent') || '';
      const result = simAnalysis(content);
      dispatch({ type: 'LOAD_ANALYSIS', payload: result });
      navigate('/result', { replace: true });
    }, SECTIONS.length * 300 + 800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(cancelTimer);
      clearTimeout(analysisTimer);
    };
  }, [dispatch, navigate]);

  const handleCancel = () => {
    aborted.current = true;
    navigate('/upload');
  };

  return (
    <div className="ld-screen">
      <div className="ld-t">Analisando o documento...</div>
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
