import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export const FileUpload: React.FC<{
  onFileSelect?: (file: File) => void;
  accept?: string;
  className?: string;
}> = ({ onFileSelect, accept = '.js,.ts,.tsx,.py,.cpp,.pdf,.zip', className }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-xl p-6 text-center transition-colors bg-slate-900/50 light:bg-slate-50 light:border-slate-300',
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
      />

      {selectedFile ? (
        <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 light:bg-white light:border-slate-200">
          <div className="flex items-center gap-3">
            <FileCode className="w-6 h-6 text-indigo-400" />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-200 light:text-slate-800">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="z-20 p-1 text-slate-400 hover:text-rose-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full bg-slate-800 text-indigo-400 mb-3 border border-slate-700 light:bg-indigo-50">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-200 light:text-slate-800">
            Drag & Drop project code or homework solution
          </p>
          <p className="text-xs text-slate-400 mt-1">Supports JS, TS, Python, C++, PDF or ZIP up to 25MB</p>
        </div>
      )}
    </div>
  );
};
