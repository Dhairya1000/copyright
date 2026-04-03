import { useState, useRef } from 'react';
import { UploadCloud, FileText, Send } from 'lucide-react';

export default function InputModule({ onResult, setLoading, isLoading }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !file) return;

    setLoading(true);
    
    try {
      const formData = new FormData();
      if (file) {
        formData.append('document', file);
      } else {
        formData.append('text', text);
      }

      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onResult(data.data);
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server. Make sure it's running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
      setFile(droppedFile);
      setText(''); // clear text if file uploaded
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* File Drop Zone */}
      <div 
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${file ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-700/30'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.txt"
          onChange={(e) => {
            if (e.target.files[0]) {
               setFile(e.target.files[0]);
               setText('');
            }
          }}
        />
        {file ? (
          <div className="flex flex-col items-center">
             <FileText className="w-8 h-8 text-indigo-400 mb-2" />
             <p className="text-sm text-indigo-200 font-medium truncate max-w-full px-4">{file.name}</p>
             <p className="text-xs text-indigo-400 mt-1 cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Remove file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-300">Drag & drop PDF or TXT</p>
            <p className="text-xs text-slate-500 mt-1">or click to browse</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px bg-slate-700 flex-1"></div>
        <span className="text-xs text-slate-500 font-semibold uppercase">OR PASTE TEXT</span>
        <div className="h-px bg-slate-700 flex-1"></div>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (file) setFile(null);
        }}
        placeholder="Paste your AI-generated text here..."
        className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all placeholder:text-slate-600"
        disabled={!!file}
      />

      <button 
        type="submit" 
        disabled={isLoading || (!text && !file)}
        className="w-full py-3 rounded-xl gradient-bg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
      >
        {isLoading ? 'Scanning IP...' : 'Analyze Safety'}
        {!isLoading && <Send className="w-4 h-4" />}
      </button>
    </form>
  )
}
