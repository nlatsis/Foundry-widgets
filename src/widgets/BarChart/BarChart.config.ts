export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartConfig {
  title?: string;
  data: BarChartDataPoint[];
  orientation?: "vertical" | "horizontal";
  showValues?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barColor?: string;
  valueFormat?: "number" | "currency" | "percent";
}

export const defaultConfig: BarChartConfig = {
  title: "",
  data: [],
  orientation: "vertical",
  showValues: true,
  showGrid: true,
  xAxisLabel: "",
  yAxisLabel: "",
  barColor: "#6366f1",
  valueFormat: "number",
};
