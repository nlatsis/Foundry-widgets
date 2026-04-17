import { useEffect, useRef, useState, useCallback } from "react";
import type { Report } from "powerbi-client";
import type { PowerBiEmbedConfig, PowerBiFilter } from "./PowerBiEmbed.config";

export type EmbedStatus = "idle" | "loading" | "ready" | "error";

interface UsePowerBiReportResult {
  containerRef: React.RefObject<HTMLDivElement>;
  status: EmbedStatus;
  error: string | null;
  refresh: () => void;
  toggleFullscreen: () => void;
  toggleFilterPane: () => Promise<void>;
  filterPaneVisible: boolean;
}

function buildEmbedUrl(reportId: string, workspaceId: string): string {
  return `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`;
}

function buildPbiFilters(filters: PowerBiFilter[]) {
  return filters
    .filter((f) => f.values.length > 0)
    .map((f) => ({
      $schema: "http://powerbi.com/product/schema#basic",
      target: { table: f.table, column: f.column },
      operator: f.operator ?? "In",
      values: f.values,
      filterType: 1, // models.FilterType.Basic
    }));
}

export function usePowerBiReport(
  config: PowerBiEmbedConfig,
  accessToken: string | undefined
): UsePowerBiReportResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<Report | null>(null);
  const [status, setStatus] = useState<EmbedStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [filterPaneVisible, setFilterPaneVisible] = useState(config.showFilterPane ?? false);

  useEffect(() => {
    if (!containerRef.current || !accessToken || !config.reportId || !config.workspaceId) return;

    let destroyed = false;
    setStatus("loading");
    setError(null);

    (async () => {
      try {
        const { service, models } = await import("powerbi-client");
        const powerbi = new service.Service(
          (await import("powerbi-client")).factories.hpmFactory,
          (await import("powerbi-client")).factories.wpmpFactory,
          (await import("powerbi-client")).factories.routerFactory,
        );

        const embedConfig: object = {
          type: "report",
          id: config.reportId,
          embedUrl: buildEmbedUrl(config.reportId, config.workspaceId),
          accessToken,
          tokenType: models.TokenType.Aad,
          settings: {
            filterPaneEnabled: filterPaneVisible,
            navContentPaneEnabled: config.showNavPane ?? false,
            layoutType:
              config.pageView === "oneColumn"
                ? models.LayoutType.MobilePortrait
                : models.LayoutType.Custom,
            customLayout: {
              displayOption:
                config.pageView === "actualSize"
                  ? models.DisplayOption.ActualSize
                  : models.DisplayOption.FitToWidth,
            },
            localeSettings: { language: config.locale ?? "en-US" },
          },
          filters: buildPbiFilters(config.filters ?? []),
        };

        if (!containerRef.current || destroyed) return;

        const report = powerbi.embed(containerRef.current, embedConfig) as Report;
        reportRef.current = report;

        report.on("loaded", () => {
          if (!destroyed) setStatus("ready");
        });

        report.on("error", (event) => {
          if (!destroyed) {
            const detail = (event.detail as { message?: string } | undefined)?.message ?? "Unknown Power BI error";
            setError(detail);
            setStatus("error");
          }
        });
      } catch (err) {
        if (!destroyed) {
          setError(err instanceof Error ? err.message : "Failed to load Power BI client");
          setStatus("error");
        }
      }
    })();

    return () => {
      destroyed = true;
      if (reportRef.current) {
        // powerbi-client doesn't expose a typed destroy on Report, cast to any
        (reportRef.current as unknown as { destroy: () => void }).destroy?.();
        reportRef.current = null;
      }
    };
    // Re-embed when credentials or report identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, config.reportId, config.workspaceId]);

  // Apply filter changes without full re-embed
  useEffect(() => {
    if (!reportRef.current || status !== "ready") return;
    const pbiFilters = buildPbiFilters(config.filters ?? []);
    reportRef.current.setFilters(pbiFilters).catch(() => {});
  }, [config.filters, status]);

  // Sync nav pane setting
  useEffect(() => {
    if (!reportRef.current || status !== "ready") return;
    reportRef.current
      .updateSettings({ navContentPaneEnabled: config.showNavPane ?? false })
      .catch(() => {});
  }, [config.showNavPane, status]);

  const refresh = useCallback(() => {
    reportRef.current?.refresh().catch(() => {});
  }, []);

  const toggleFullscreen = useCallback(() => {
    reportRef.current?.fullscreen().catch(() => {});
  }, []);

  const toggleFilterPane = useCallback(async () => {
    if (!reportRef.current) return;
    const next = !filterPaneVisible;
    await reportRef.current.updateSettings({ filterPaneEnabled: next });
    setFilterPaneVisible(next);
  }, [filterPaneVisible]);

  return { containerRef, status, error, refresh, toggleFullscreen, toggleFilterPane, filterPaneVisible };
}
