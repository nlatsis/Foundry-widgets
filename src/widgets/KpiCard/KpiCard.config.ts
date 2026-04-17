export interface KpiCardConfig {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const defaultConfig: KpiCardConfig = {
  title: "Metric",
  value: 0,
  unit: "",
  trend: undefined,
  trendLabel: "",
  backgroundColor: "#ffffff",
  textColor: "#1a1a1a",
};
