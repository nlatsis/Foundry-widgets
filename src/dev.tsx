import React from "react";
import { createRoot } from "react-dom/client";
import { KpiCard } from "./widgets/KpiCard";
import { DataTable } from "./widgets/DataTable";
import { BarChart } from "./widgets/BarChart";
import "./styles/global.css";

const kpiConfigs = [
  { title: "Total Revenue", value: 1284500, unit: "USD", trend: 12.4, trendLabel: "vs last month" },
  { title: "Active Users", value: 43821, trend: -2.1, trendLabel: "vs last week" },
  { title: "Avg. Response Time", value: "142", unit: "ms", trend: 5.3, trendLabel: "improvement" },
];

const tableConfig = {
  title: "Top Products",
  columns: [
    { key: "product", label: "Product", format: "text" as const },
    { key: "category", label: "Category", format: "text" as const },
    { key: "revenue", label: "Revenue", format: "currency" as const, align: "right" as const },
    { key: "units", label: "Units Sold", format: "number" as const, align: "right" as const },
    { key: "growth", label: "Growth", format: "percent" as const, align: "right" as const },
  ],
  rows: [
    { product: "Widget Pro", category: "Software", revenue: 245000, units: 1200, growth: 18.5 },
    { product: "Databridge", category: "Integration", revenue: 189000, units: 890, growth: 9.2 },
    { product: "Analytics Suite", category: "Analytics", revenue: 320000, units: 450, growth: 34.1 },
    { product: "Connector SDK", category: "Developer", revenue: 98000, units: 2100, growth: -3.4 },
    { product: "Pipeline Builder", category: "ETL", revenue: 175000, units: 310, growth: 22.7 },
    { product: "ML Workbench", category: "AI/ML", revenue: 412000, units: 180, growth: 51.3 },
  ],
  striped: true,
  stickyHeader: true,
  pageSize: 5,
};

const chartConfig = {
  title: "Revenue by Category",
  data: [
    { label: "Software", value: 245000, color: "#6366f1" },
    { label: "Integration", value: 189000, color: "#8b5cf6" },
    { label: "Analytics", value: 320000, color: "#06b6d4" },
    { label: "Developer", value: 98000, color: "#10b981" },
    { label: "ETL", value: 175000, color: "#f59e0b" },
    { label: "AI/ML", value: 412000, color: "#ef4444" },
  ],
  showValues: true,
  showGrid: true,
  yAxisLabel: "Revenue (USD)",
  valueFormat: "currency" as const,
};

function DevApp() {
  return (
    <div className="dev-app">
      <header className="dev-header">
        <h1>Foundry Widgets — Dev Preview</h1>
      </header>

      <section className="dev-section">
        <h2>KPI Card</h2>
        <div className="kpi-grid">
          {kpiConfigs.map((cfg) => (
            <KpiCard key={cfg.title} config={cfg} />
          ))}
        </div>
      </section>

      <section className="dev-section">
        <h2>Bar Chart</h2>
        <div className="chart-container">
          <BarChart config={chartConfig} />
        </div>
      </section>

      <section className="dev-section">
        <h2>Data Table</h2>
        <div className="table-container">
          <DataTable config={tableConfig} />
        </div>
      </section>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<DevApp />);
