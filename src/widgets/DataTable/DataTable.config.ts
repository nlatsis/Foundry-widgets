export interface ColumnDef {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  format?: "text" | "number" | "currency" | "percent" | "date";
}

export interface DataTableConfig {
  columns: ColumnDef[];
  rows: Record<string, unknown>[];
  title?: string;
  pageSize?: number;
  striped?: boolean;
  stickyHeader?: boolean;
}

export const defaultConfig: DataTableConfig = {
  columns: [
    { key: "name", label: "Name", format: "text" },
    { key: "value", label: "Value", format: "number", align: "right" },
  ],
  rows: [],
  title: "",
  pageSize: 10,
  striped: true,
  stickyHeader: true,
};
