import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        "kpi-card": resolve(__dirname, "src/widgets/KpiCard/index.ts"),
        "data-table": resolve(__dirname, "src/widgets/DataTable/index.ts"),
        "bar-chart": resolve(__dirname, "src/widgets/BarChart/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@osdk/widget-client", "@osdk/widget-client-react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
