import { useRef, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface Props {
  onFile: (file: File) => void;
  loading: boolean;
}

export default function FileUpload({ onFile, loading }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      alert('Please upload a .csv, .xlsx, or .xls file.');
      return;
    }
    onFile(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
        dragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handle(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
          {loading ? (
            <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-7 h-7 text-indigo-600" />
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-700">
            {loading ? 'Parsing file…' : 'Drop your file here or click to browse'}
          </p>
          <p className="text-sm text-slate-500 mt-1">Supports Excel (.xlsx, .xls) and CSV files</p>
        </div>
        <div className="flex gap-3 mt-2">
          {['.xlsx', '.xls', '.csv'].map((ext) => (
            <span key={ext} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono">
              <FileSpreadsheet className="w-3 h-3" /> {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
