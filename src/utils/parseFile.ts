import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { DataRow } from '../types';

export function parseExcel(file: File): Promise<{ data: DataRow[]; columns: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<DataRow>(ws, { defval: '' });
        const columns = json.length > 0 ? Object.keys(json[0]) : [];
        resolve({ data: json, columns });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function parseCsv(file: File): Promise<{ data: DataRow[]; columns: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<DataRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const columns = result.meta.fields ?? [];
        resolve({ data: result.data, columns });
      },
      error: reject,
    });
  });
}

export async function parseFile(file: File): Promise<{ data: DataRow[]; columns: string[] }> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'csv') return parseCsv(file);
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(file);
  throw new Error('Unsupported file type. Please upload .csv, .xlsx, or .xls files.');
}
