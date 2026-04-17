import React from "react";
import type { KpiCardConfig } from "./KpiCard.config";
import "./KpiCard.css";

interface KpiCardProps {
  config: KpiCardConfig;
}

function TrendIndicator({ trend, label }: { trend: number; label?: string }) {
  const isPositive = trend >= 0;
  const arrow = isPositive ? "▲" : "▼";
  const className = `kpi-trend ${isPositive ? "kpi-trend--up" : "kpi-trend--down"}`;

  return (
    <div className={className}>
      <span className="kpi-trend__arrow">{arrow}</span>
      <span className="kpi-trend__value">
        {Math.abs(trend)}%{label ? ` ${label}` : ""}
      </span>
    </div>
  );
}

export function KpiCard({ config }: KpiCardProps) {
  const { title, value, unit, trend, trendLabel, backgroundColor, textColor } = config;

  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div
      className="kpi-card"
      style={{ backgroundColor: backgroundColor ?? "#ffffff", color: textColor ?? "#1a1a1a" }}
    >
      <div className="kpi-card__header">
        <span className="kpi-card__title">{title}</span>
      </div>
      <div className="kpi-card__body">
        <span className="kpi-card__value">{formattedValue}</span>
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className="kpi-card__footer">
          <TrendIndicator trend={trend} label={trendLabel} />
        </div>
      )}
    </div>
  );
}
