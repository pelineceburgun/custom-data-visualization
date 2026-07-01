import type { DataRow } from '../types';
import { TrendingUp, Hash, BarChart2, FileText } from 'lucide-react';

interface Props {
  data: DataRow[];
  columns: string[];
}

function isNumeric(col: string, data: DataRow[]) {
  return data.some((row) => typeof row[col] === 'number' && !isNaN(row[col] as number));
}

function colStats(col: string, data: DataRow[]) {
  const nums = data.map((r) => Number(r[col])).filter((n) => !isNaN(n));
  if (nums.length === 0) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  return {
    sum: sum.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    avg: (sum / nums.length).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    min: Math.min(...nums).toLocaleString(undefined, { maximumFractionDigits: 2 }),
    max: Math.max(...nums).toLocaleString(undefined, { maximumFractionDigits: 2 }),
  };
}

export default function SummaryStats({ data, columns }: Props) {
  const numericCols = columns.filter((c) => isNumeric(c, data));
  const stats = numericCols.slice(0, 4).map((col) => ({ col, ...colStats(col, data)! })).filter(Boolean);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={<FileText className="w-5 h-5 text-indigo-600" />} label="Total Rows" value={data.length.toLocaleString()} bg="bg-indigo-50" />
      <StatCard icon={<Hash className="w-5 h-5 text-emerald-600" />} label="Columns" value={columns.length.toString()} bg="bg-emerald-50" />
      {stats[0] && (
        <>
          <StatCard icon={<TrendingUp className="w-5 h-5 text-amber-600" />} label={`${stats[0].col} — Sum`} value={stats[0].sum} bg="bg-amber-50" />
          <StatCard icon={<BarChart2 className="w-5 h-5 text-rose-600" />} label={`${stats[0].col} — Avg`} value={stats[0].avg} bg="bg-rose-50" />
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex items-start gap-3`}>
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
