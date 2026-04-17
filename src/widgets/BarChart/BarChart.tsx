import React, { useMemo } from "react";
import type { BarChartConfig } from "./BarChart.config";
import "./BarChart.css";

interface BarChartProps {
  config: BarChartConfig;
}

function formatValue(value: number, format: BarChartConfig["valueFormat"]): string {
  switch (format) {
    case "currency":
      return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    case "percent":
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString();
  }
}

const CHART_HEIGHT = 200;
const CHART_WIDTH = 400;
const PADDING = { top: 20, right: 20, bottom: 48, left: 56 };

export function BarChart({ config }: BarChartProps) {
  const {
    title,
    data,
    orientation = "vertical",
    showValues = true,
    showGrid = true,
    xAxisLabel,
    yAxisLabel,
    barColor = "#6366f1",
    valueFormat = "number",
  } = config;

  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 0), [data]);
  const gridLines = useMemo(() => {
    const step = maxValue === 0 ? 1 : Math.ceil(maxValue / 4);
    return Array.from({ length: 5 }, (_, i) => i * step);
  }, [maxValue]);

  if (data.length === 0) {
    return (
      <div className="bar-chart-widget">
        {title && <div className="bar-chart-widget__title">{title}</div>}
        <div className="bar-chart__empty">No data to display</div>
      </div>
    );
  }

  const innerW = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barGap = 8;
  const barW = Math.max(8, (innerW - barGap * (data.length - 1)) / data.length);

  function yScale(value: number): number {
    return innerH - (maxValue === 0 ? 0 : (value / maxValue) * innerH);
  }

  return (
    <div className="bar-chart-widget">
      {title && <div className="bar-chart-widget__title">{title}</div>}
      <div className="bar-chart-container">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="bar-chart-svg"
          aria-label={title ?? "Bar chart"}
          role="img"
        >
          <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
            {/* Grid lines */}
            {showGrid &&
              gridLines.map((val) => {
                const y = yScale(val);
                return (
                  <g key={val}>
                    <line
                      x1={0}
                      y1={y}
                      x2={innerW}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth={1}
                      strokeDasharray="4 2"
                    />
                    <text
                      x={-8}
                      y={y + 4}
                      textAnchor="end"
                      className="bar-chart__axis-label"
                    >
                      {formatValue(val, valueFormat)}
                    </text>
                  </g>
                );
              })}

            {/* Bars */}
            {data.map((d, i) => {
              const barHeight = maxValue === 0 ? 0 : (d.value / maxValue) * innerH;
              const x = i * (barW + barGap);
              const y = yScale(d.value);
              const color = d.color ?? barColor;

              return (
                <g key={d.label}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={barHeight}
                    fill={color}
                    rx={3}
                    className="bar-chart__bar"
                  >
                    <title>{`${d.label}: ${formatValue(d.value, valueFormat)}`}</title>
                  </rect>
                  {showValues && barHeight > 16 && (
                    <text
                      x={x + barW / 2}
                      y={y + 14}
                      textAnchor="middle"
                      className="bar-chart__value-label"
                    >
                      {formatValue(d.value, valueFormat)}
                    </text>
                  )}
                  <text
                    x={x + barW / 2}
                    y={innerH + 16}
                    textAnchor="middle"
                    className="bar-chart__x-label"
                  >
                    {d.label.length > 8 ? d.label.slice(0, 8) + "…" : d.label}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={0} y1={0} x2={0} y2={innerH} stroke="#d1d5db" strokeWidth={1} />
            <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#d1d5db" strokeWidth={1} />

            {/* Axis labels */}
            {yAxisLabel && (
              <text
                transform={`translate(-40, ${innerH / 2}) rotate(-90)`}
                textAnchor="middle"
                className="bar-chart__axis-title"
              >
                {yAxisLabel}
              </text>
            )}
            {xAxisLabel && (
              <text
                x={innerW / 2}
                y={innerH + 40}
                textAnchor="middle"
                className="bar-chart__axis-title"
              >
                {xAxisLabel}
              </text>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
