import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { ChartConfig, ChartType, DataRow } from '../types';

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
];

const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

interface Props {
  columns: string[];
  data: DataRow[];
  onAdd: (cfg: ChartConfig) => void;
}

export default function ChartBuilder({ columns, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ChartType>('bar');
  const [xKey, setXKey] = useState(columns[0] ?? '');
  const [yKeys, setYKeys] = useState<string[]>(columns.length > 1 ? [columns[1]] : []);

  const toggleY = (col: string) => {
    setYKeys((prev) =>
      prev.includes(col) ? prev.filter((k) => k !== col) : [...prev, col]
    );
  };

  const submit = () => {
    if (!xKey || yKeys.length === 0) {
      alert('Please select an X axis column and at least one Y axis column.');
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim() || `${type} chart`,
      type,
      xKey,
      yKeys,
      colors: yKeys.map((_, i) => PALETTE[i % PALETTE.length]),
    });
    setTitle('');
    setYKeys(columns.length > 1 ? [columns[1]] : []);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <Plus className="w-4 h-4 text-indigo-600" /> Add Chart
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Chart Title</label>
          <input
            type="text"
            placeholder="e.g. Monthly Sales"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Chart Type</label>
          <div className="grid grid-cols-2 gap-2">
            {CHART_TYPES.map((ct) => (
              <button
                key={ct.value}
                onClick={() => setType(ct.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  type === ct.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            {type === 'pie' ? 'Category Column' : 'X Axis'}
          </label>
          <select
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {columns.map((col) => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            {type === 'pie' ? 'Value Column' : 'Y Axis (select one or more)'}
          </label>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {columns
              .filter((col) => col !== xKey)
              .map((col) => (
                <label key={col} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type={type === 'pie' ? 'radio' : 'checkbox'}
                    name="yKeys"
                    checked={yKeys.includes(col)}
                    onChange={() => type === 'pie' ? setYKeys([col]) : toggleY(col)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-indigo-600">{col}</span>
                </label>
              ))}
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add to Dashboard
        </button>
      </div>
    </div>
  );
}

interface RemoveButtonProps {
  onRemove: () => void;
}
export function RemoveButton({ onRemove }: RemoveButtonProps) {
  return (
    <button
      onClick={onRemove}
      className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-500 transition-colors"
      title="Remove chart"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  );
}
