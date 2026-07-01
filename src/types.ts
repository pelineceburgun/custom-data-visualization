export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter';

export interface DataRow {
  [key: string]: string | number;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  xKey: string;
  yKeys: string[];
  colors: string[];
}

export interface AppState {
  data: DataRow[];
  columns: string[];
  fileName: string;
  charts: ChartConfig[];
}
