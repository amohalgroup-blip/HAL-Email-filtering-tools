import { useState } from 'react';
import { Mail, AlertCircle, Loader2 } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ResultPanel } from './components/ResultPanel';
import { parseFile, exportToExcel } from './utils/fileUtils';
import { filterEmails } from './utils/emailUtils';

const EMAIL_COLUMN = '邮箱地址';

type AppState = 'idle' | 'processing' | 'done' | 'error';

interface FilterResult {
  fileName: string;
  totalCount: number;
  keptCount: number;
  removedCount: number;
  keptRows: Record<string, string>[];
  removedEmails: string[];
}

function App() {
  const [state, setState] = useState<AppState>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<FilterResult | null>(null);

  const handleFileSelect = async (file: File) => {
    setState('processing');
    setError('');
    setResult(null);

    const parsed = await parseFile(file);

    if (parsed.error) {
      setError(parsed.error);
      setState('error');
      return;
    }

    if (!parsed.headers.includes(EMAIL_COLUMN)) {
      setError(`未找到列名"${EMAIL_COLUMN}"，请确保文件中包含该列。\n当前列名：${parsed.headers.join('、')}`);
      setState('error');
      return;
    }

    const { kept, removed } = filterEmails(parsed.rows, EMAIL_COLUMN);

    setResult({
      fileName: file.name,
      totalCount: parsed.rows.length,
      keptCount: kept.length,
      removedCount: removed.length,
      keptRows: kept,
      removedEmails: removed.map((r) => r[EMAIL_COLUMN] ?? ''),
    });
    setState('done');
  };

  const handleDownload = () => {
    if (!result) return;
    const baseName = result.fileName.replace(/\.(xlsx|xls|csv)$/i, '');
    exportToExcel(result.keptRows, `${baseName}_已过滤.xlsx`);
  };

  const handleReset = () => {
    setState('idle');
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Header />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
          {state === 'idle' && (
            <FileUpload onFileSelect={handleFileSelect} isProcessing={false} />
          )}

          {state === 'processing' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-gray-500 text-sm">正在解析文件…</p>
            </div>
          )}

          {state === 'error' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">处理失败</p>
                  <p className="text-sm text-red-500 mt-0.5 whitespace-pre-line">{error}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 px-6 bg-white hover:bg-gray-50 text-gray-600 font-medium rounded-xl border border-gray-200 transition-colors duration-150 text-sm"
              >
                重新上传
              </button>
            </div>
          )}

          {state === 'done' && result && (
            <ResultPanel
              fileName={result.fileName}
              totalCount={result.totalCount}
              keptCount={result.keptCount}
              removedCount={result.removedCount}
              removedEmails={result.removedEmails}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}
        </div>

        <RuleHint />
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-md mb-4">
        <Mail className="w-7 h-7 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">邮箱过滤工具</h1>
      <p className="text-gray-500 text-sm mt-1.5">自动过滤缩写邮箱，保留包含点前缀的有效邮箱</p>
    </div>
  );
}

function RuleHint() {
  return (
    <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
      <p className="text-xs font-medium text-amber-700 mb-1.5">过滤规则说明</p>
      <div className="flex flex-col gap-1">
        <RuleRow type="keep" text="john.doe@example.com — @ 前含点，保留" />
        <RuleRow type="keep" text="li.ming@company.cn — @ 前含点，保留" />
        <RuleRow type="remove" text="sg@example.com — @ 前无点，删除" />
        <RuleRow type="remove" text="cheryl@domain.com — @ 前无点，删除" />
      </div>
    </div>
  );
}

function RuleRow({ type, text }: { type: 'keep' | 'remove'; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold w-4 shrink-0 ${type === 'keep' ? 'text-green-500' : 'text-red-400'}`}>
        {type === 'keep' ? '✓' : '✕'}
      </span>
      <span className="text-xs text-amber-600 font-mono">{text}</span>
    </div>
  );
}

function Footer() {
  return (
    <p className="text-center text-xs text-gray-400 mt-4">
      文件在浏览器本地处理，不会上传至任何服务器
    </p>
  );
}

export default App;
