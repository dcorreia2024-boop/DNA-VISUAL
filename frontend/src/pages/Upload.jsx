import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const dragCounter = useRef(0);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. M\u00e1ximo 10MB.');
      return;
    }
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['docx', 'doc', 'txt'].includes(ext)) {
      alert('Formato n\u00e3o suportado. Use DOCX ou TXT.');
      return;
    }
    setFileName(file.name);
    sessionStorage.setItem('uploadedFileName', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target.result || '';
      if (content.startsWith('PK') || content.includes('word/document.xml')) {
        content = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      sessionStorage.setItem('uploadedFileContent', content);
    };
    reader.readAsText(file);
  };

  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current++; setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragOver(false); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = () => {
    if (!fileName) return;
    navigate('/loading');
  };

  return (
    <div className="up-screen">
      <div className="up-top">
        <button className="btn-back" onClick={() => navigate('/')}>&larr; HOME</button>
      </div>
      <div className="up-c">
        <div
          className={`dz${dragOver ? ' over' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="dz-icon" />
          <div className="dz-t">Arraste o arquivo aqui ou clique para selecionar</div>
          <div className="dz-s">Aceita DOCX ou TXT (m&aacute;x. 10MB) &mdash; TXT recomendado</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".docx,.doc,.txt"
          onChange={(e) => { if (e.target.files.length) handleFile(e.target.files[0]); e.target.value = ''; }}
        />
        <div className={`fi${fileName ? ' on' : ''}`}>
          <span>Arquivo:</span><span className="fn">{fileName}</span>
        </div>
        <button className={`btn btn-r ub${fileName ? ' on' : ''}`} onClick={handleAnalyze}>
          ANALISAR DOCUMENTO
        </button>
      </div>
    </div>
  );
}
