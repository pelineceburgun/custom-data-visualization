import { useState } from 'react';
import { BarChart2, UploadCloud, TableIcon, RefreshCcw } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import ChartBuilder from './components/ChartBuilder';
import ChartCard from './components/ChartCard';
import SummaryStats from './components/SummaryStats';
import { parseFile } from './utils/parseFile';
import type { AppState, ChartConfig } from './types';

type Tab = 'table' | 'dashboard';

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('table');

  const handleFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const { data, columns } = await parseFile(file);
      if (data.length === 0) throw new Error('The file appears to be empty.');
      setState({ data, columns, fileName: file.name, charts: [] });
      setTab('table');
    } catch (e: any) {
      setError(e.message ?? 'Failed to parse file.');
    } finally {
      setLoading(false);
    }
  };

  const addChart = (cfg: ChartConfig) => {
    setState((prev) => prev ? { ...prev, charts: [...prev.charts, cfg] } : prev);
    setTab('dashboard');
  };

  const removeChart = (id: string) => {
    setState((prev) => prev ? { ...prev, charts: prev.charts.filter((c) => c.id !== id) } : prev);
  };

  const reset = () => { setState(null); setError(null); };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">DataViz</span>
            {state && (
              <span className="hidden sm:inline text-sm text-slate-400 border-l border-slate-200 pl-3 ml-1">
                {state.fileName}
              </span>
            )}
          </div>
          {state && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> New file
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!state ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
                <UploadCloud className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Business Data Visualizer</h1>
              <p className="text-slate-500 mt-2 text-base">
                Upload an Excel or CSV file to instantly explore, analyze, and chart your business data.
              </p>
            </div>
            <FileUpload onFile={handleFile} loading={loading} />
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-slate-500">
              {[
                { icon: '📊', label: '5 chart types', desc: 'Bar, Line, Area, Pie, Scatter' },
                { icon: '⚡', label: 'Instant preview', desc: 'Paginated table view' },
                { icon: '🔒', label: '100% local', desc: 'Data never leaves your browser' },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="font-semibold text-slate-700">{f.label}</div>
                  <div className="text-xs mt-0.5">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <SummaryStats data={state.data} columns={state.columns} />

            <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 w-fit">
              {([
                { id: 'table' as Tab, label: 'Data Table', icon: <TableIcon className="w-3.5 h-3.5" /> },
                { id: 'dashboard' as Tab, label: `Dashboard (${state.charts.length})`, icon: <BarChart2 className="w-3.5 h-3.5" /> },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {tab === 'table' && (
              <DataTable data={state.data} columns={state.columns} />
            )}

            {tab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <ChartBuilder columns={state.columns} data={state.data} onAdd={addChart} />
                </div>
                <div className="lg:col-span-3">
                  {state.charts.length === 0 ? (
                    <div className="h-64 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <BarChart2 className="w-10 h-10 mb-3 opacity-30" />
                      <p className="font-medium">No charts yet</p>
                      <p className="text-sm mt-1">Configure a chart on the left and click "Add to Dashboard"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                      {state.charts.map((chart) => (
                        <ChartCard
                          key={chart.id}
                          config={chart}
                          data={state.data}
                          onRemove={() => removeChart(chart.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
