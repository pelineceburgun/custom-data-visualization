import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartConfig, DataRow } from '../types';
import { RemoveButton } from './ChartBuilder';

interface Props {
  config: ChartConfig;
  data: DataRow[];
  onRemove: () => void;
}

const RADIAN = Math.PI / 180;
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ChartCard({ config, data, onRemove }: Props) {
  const { title, type, xKey, yKeys, colors } = config;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 20, left: 0, bottom: 5 },
    };

    if (type === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {yKeys.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[i]} strokeWidth={2} dot={{ r: 3 }} />
          ))}
        </LineChart>
      );
    }

    if (type === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            {yKeys.map((key, i) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[i]} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          {yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {yKeys.map((key, i) => (
            <Area key={key} type="monotone" dataKey={key} stroke={colors[i]} strokeWidth={2} fill={`url(#grad-${key})`} />
          ))}
        </AreaChart>
      );
    }

    if (type === 'pie') {
      const pieData = data.map((row) => ({
        name: String(row[xKey]),
        value: Number(row[yKeys[0]]) || 0,
      }));
      return (
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%" labelLine={false} label={renderPieLabel}>
            {pieData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length] ?? `hsl(${i * 45}, 70%, 55%)`} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      );
    }

    if (type === 'scatter') {
      return (
        <ScatterChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xKey} name={xKey} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis dataKey={yKeys[0]} name={yKeys[0]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <ZAxis range={[40, 40]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Scatter data={data} fill={colors[0]} fillOpacity={0.75} />
        </ScatterChart>
      );
    }

    return null;
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <RemoveButton onRemove={onRemove} />
      <h4 className="text-sm font-semibold text-slate-700 mb-4 pr-8">{title}</h4>
      <ResponsiveContainer width="100%" height={280}>
        {renderChart() as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
