import { Download, CheckCircle, XCircle, FileText, RefreshCw } from 'lucide-react';

interface ResultPanelProps {
  fileName: string;
  totalCount: number;
  keptCount: number;
  removedCount: number;
  onDownload: () => void;
  onReset: () => void;
  removedEmails: string[];
}

export function ResultPanel({
  fileName,
  totalCount,
  keptCount,
  removedCount,
  onDownload,
  onReset,
  removedEmails,
}: ResultPanelProps) {
  const keepRate = totalCount > 0 ? Math.round((keptCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800">处理完成</p>
          <p className="text-xs text-green-600 truncate mt-0.5">{fileName}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="总行数"
          value={totalCount}
          colorClass="text-gray-700"
          bgClass="bg-gray-50"
        />
        <StatCard
          label="保留"
          value={keptCount}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          sub={`${keepRate}%`}
        />
        <StatCard
          label="删除"
          value={removedCount}
          colorClass="text-red-500"
          bgClass="bg-red-50"
          sub={`${100 - keepRate}%`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl transition-colors duration-150"
        >
          <Download className="w-4 h-4" />
          下载过滤后的文件
        </button>
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 font-medium rounded-xl border border-gray-200 transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
          重新上传
        </button>
      </div>

      {removedEmails.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <p className="text-sm font-medium text-gray-600">被删除的邮箱（前 20 条）</p>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
            {removedEmails.slice(0, 20).map((email, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0"
              >
                <FileText className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <span className="text-sm text-gray-500 font-mono truncate">{email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
  sub?: string;
}

function StatCard({ label, value, colorClass, bgClass, sub }: StatCardProps) {
  return (
    <div className={`${bgClass} rounded-xl p-4 text-center`}>
      <p className={`text-2xl font-bold ${colorClass}`}>{value.toLocaleString()}</p>
      {sub && <p className={`text-xs font-medium ${colorClass} opacity-70 mt-0.5`}>{sub}</p>}
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
