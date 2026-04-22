import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

const VALID_EXTS = ['pdf', 'docx', 'doc', 'txt'];
const MAX_TOTAL = 10 * 1024 * 1024; // 10MB total

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

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(arrayBufferToBase64(e.target.result));
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.readAsArrayBuffer(file);
  });
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'PDF';
  if (['docx', 'doc'].includes(ext)) return 'DOC';
  if (ext === 'txt') return 'TXT';
  return 'FILE';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const dragCounter = useRef(0);

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles);
    const invalid = arr.find(f => !VALID_EXTS.includes(f.name.split('.').pop().toLowerCase()));
    if (invalid) {
      alert(`Formato n\u00e3o suportado: ${invalid.name}. Use PDF, DOCX ou TXT.`);
      return;
    }

    const currentTotal = files.reduce((acc, f) => acc + f.size, 0);
    const newTotal = currentTotal + arr.reduce((acc, f) => acc + f.size, 0);
    if (newTotal > MAX_TOTAL) {
      alert(`Tamanho total excede 10MB (atual: ${formatFileSize(newTotal)}).`);
      return;
    }

    setFiles(prev => [...prev, ...arr]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current++; setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); dragCounter.current--; if (dragCounter.current === 0) setDragOver(false); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert('Adicione pelo menos um documento.');
      return;
    }

    setIsReading(true);
    try {
      const payload = [];
      for (const file of files) {
        const base64 = await readAsBase64(file);
        payload.push({ name: file.name, base64 });
      }

      // Guarda array de arquivos no sessionStorage pro Loading enviar
      sessionStorage.setItem('uploadedFiles', JSON.stringify(payload));
      sessionStorage.setItem('uploadedFilesCount', String(files.length));

      // Backward compat: guarda tb o primeiro arquivo no formato antigo
      sessionStorage.setItem('uploadedFileName', files[0].name);
      sessionStorage.setItem('uploadedFileBase64', payload[0].base64);
      sessionStorage.removeItem('uploadedFileContent');

      navigate('/loading');
    } catch (err) {
      alert('Erro ao processar arquivos: ' + err.message);
      setIsReading(false);
    }
  };

  const buttonLabel = isReading
    ? 'PROCESSANDO ARQUIVOS...'
    : files.length === 0
      ? 'ANALISAR DOCUMENTO'
      : `ANALISAR ${files.length === 1 ? 'DOCUMENTO' : files.length + ' DOCUMENTOS'}`;

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
          <div className="dz-t">Arraste os arquivos aqui ou clique para selecionar</div>
          <div className="dz-s">PDF, DOCX ou TXT &mdash; at&eacute; 10MB no total &mdash; m&uacute;ltiplos arquivos aceitos</div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.docx,.doc,.txt"
          multiple
          onChange={(e) => { if (e.target.files.length) addFiles(e.target.files); e.target.value = ''; }}
        />

        {files.length > 0 && (
          <>
            <div className="file-list">
              {files.map((file, index) => (
                <div className="file-item" key={index}>
                  <span className="file-icon">{getFileIcon(file.name)}</span>
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                  <button className="file-remove" onClick={() => removeFile(index)} title="Remover">&times;</button>
                </div>
              ))}
            </div>
            <button className="btn-add-more" onClick={() => fileInputRef.current?.click()}>
              + Adicionar outro documento
            </button>
          </>
        )}

        <button
          className={`btn btn-r ub${files.length > 0 && !isReading ? ' on' : ''}`}
          onClick={handleAnalyze}
          disabled={files.length === 0 || isReading}
          style={{ opacity: files.length === 0 || isReading ? 0.5 : 1 }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
