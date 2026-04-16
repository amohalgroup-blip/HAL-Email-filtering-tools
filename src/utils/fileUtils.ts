import * as XLSX from 'xlsx';

export interface ParseResult {
  rows: Record<string, string>[];
  headers: string[];
  error?: string;
}

export function parseFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
          defval: '',
          raw: false,
        });

        if (jsonData.length === 0) {
          resolve({ rows: [], headers: [], error: '文件内容为空' });
          return;
        }

        const headers = Object.keys(jsonData[0]);
        resolve({ rows: jsonData, headers });
      } catch {
        resolve({ rows: [], headers: [], error: '文件解析失败，请检查文件格式' });
      }
    };
    reader.onerror = () => {
      resolve({ rows: [], headers: [], error: '文件读取失败' });
    };
    reader.readAsBinaryString(file);
  });
}

export function exportToExcel(rows: Record<string, string>[], filename: string): void {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '过滤结果');
  XLSX.writeFile(workbook, filename);
}
