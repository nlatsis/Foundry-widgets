import React, { useState, useMemo } from "react";
import type { DataTableConfig, ColumnDef } from "./DataTable.config";
import "./DataTable.css";

interface DataTableProps {
  config: DataTableConfig;
}

function formatCell(value: unknown, format: ColumnDef["format"]): string {
  if (value === null || value === undefined) return "—";
  switch (format) {
    case "number":
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "currency":
      return typeof value === "number"
        ? value.toLocaleString("en-US", { style: "currency", currency: "USD" })
        : String(value);
    case "percent":
      return typeof value === "number" ? `${value.toFixed(2)}%` : String(value);
    case "date":
      return value instanceof Date
        ? value.toLocaleDateString()
        : new Date(String(value)).toLocaleDateString();
    default:
      return String(value);
  }
}

export function DataTable({ config }: DataTableProps) {
  const { columns, rows, title, pageSize = 10, striped = true, stickyHeader = true } = config;
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av! < bv! ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const pagedRows = sortedRows.slice(page * pageSize, (page + 1) * pageSize);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <div className="data-table-widget">
      {title && <div className="data-table-widget__title">{title}</div>}
      <div className="data-table-wrapper">
        <table className={`data-table ${striped ? "data-table--striped" : ""}`}>
          <thead className={stickyHeader ? "data-table__head--sticky" : ""}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`data-table__th data-table__th--${col.align ?? "left"}`}
                  style={{ width: col.width }}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="data-table__th-content">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="data-table__sort-icon">
                        {sortDir === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  No data available
                </td>
              </tr>
            ) : (
              pagedRows.map((row, i) => (
                <tr key={i} className="data-table__row">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`data-table__td data-table__td--${col.align ?? "left"}`}
                    >
                      {formatCell(row[col.key], col.format)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="data-table__pagination">
          <button
            className="data-table__page-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ‹ Prev
          </button>
          <span className="data-table__page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="data-table__page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
