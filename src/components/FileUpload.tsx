import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    e.target.value = '';
  };

  const validateAndSelect = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'xlsx' || ext === 'csv' || ext === 'xls') {
      onFileSelect(file);
    }
  };

  return (
    <div
      onClick={() => !isProcessing && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-200 select-none
        ${isDragging
          ? 'border-blue-400 bg-blue-50 scale-[1.01]'
          : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40'
        }
        ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleInputChange}
        className="hidden"
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          ${isDragging ? 'bg-blue-100' : 'bg-white shadow-sm'}
          transition-all duration-200
        `}>
          {isDragging
            ? <FileSpreadsheet className="w-8 h-8 text-blue-500" />
            : <Upload className="w-8 h-8 text-gray-400" />
          }
        </div>
        <div>
          <p className="text-base font-medium text-gray-700">
            {isDragging ? '松开即可上传' : '点击或拖拽文件到此处'}
          </p>
          <p className="text-sm text-gray-400 mt-1">支持 .xlsx、.xls、.csv 格式</p>
        </div>
      </div>
    </div>
  );
}
