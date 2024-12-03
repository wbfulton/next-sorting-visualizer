export interface ChartData {
  label: string;
  value: number;
  fill?: string;
}

export interface GeneratorData {
  value: ChartData[];
  description?: string;
}
