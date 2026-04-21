import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

// Converte ArrayBuffer para base64 sem estourar a stack em arquivos grandes
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isReading, setIsReading] = useState(false);
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
    setIsReady(false);
    setIsReading(true);
    sessionStorage.setItem('uploadedFileName', file.name);
    sessionStorage.removeItem('uploadedFileBase64');
    sessionStorage.removeItem('uploadedFileContent');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const base64 = arrayBufferToBase64(buffer);
        sessionStorage.setItem('uploadedFileBase64', base64);
        setIsReady(true);
      } catch (err) {
        console.error('[Upload] Erro ao ler arquivo:', err);
        alert('Erro ao processar o arquivo: ' + err.message);
        setFileName('');
      }
      setIsReading(false);
    };
    reader.onerror = () => {
      console.error('[Upload] FileReader error');
      alert('Erro ao ler o arquivo.');
      setIsReading(false);
      setFileName('');
    };
    reader.readAsArrayBuffer(file);
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
    if (!isReady) return;
    const base64 = sessionStorage.getItem('uploadedFileBase64');
    if (!base64) {
      alert('O arquivo ainda n\u00e3o foi processado. Tente novamente.');
      return;
    }
    navigate('/loading');
  };

  const buttonLabel = isReading ? 'PROCESSANDO ARQUIVO...' : 'ANALISAR DOCUMENTO';

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
          <div className="dz-s">Aceita DOCX ou TXT (m&aacute;x. 10MB)</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".docx,.doc,.txt"
          onChange={(e) => { if (e.target.files.length) handleFile(e.target.files[0]); e.target.value = ''; }}
        />
        <div className={`fi${fileName ? ' on' : ''}`}>
          <span>Arquivo:</span><span className="fn">{fileName}</span>
          {isReading && <span style={{ color: 'var(--red)', fontSize: 11 }}>&middot; lendo...</span>}
          {isReady && <span style={{ color: '#27AE60', fontSize: 11 }}>&middot; pronto</span>}
        </div>
        <button
          className={`btn btn-r ub${fileName && isReady ? ' on' : ''}`}
          onClick={handleAnalyze}
          disabled={!isReady}
          style={{ opacity: !isReady && fileName ? 0.5 : 1 }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
