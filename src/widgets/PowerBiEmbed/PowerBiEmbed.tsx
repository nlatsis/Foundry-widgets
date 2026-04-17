import React from "react";
import type { PowerBiEmbedConfig } from "./PowerBiEmbed.config";
import { useMsalToken } from "./usePowerBiAuth";
import { usePowerBiReport } from "./usePowerBiReport";
import "./PowerBiEmbed.css";

interface PowerBiEmbedProps {
  config: PowerBiEmbedConfig;
}

function Toolbar({
  onRefresh,
  onFullscreen,
  onToggleFilter,
  filterPaneVisible,
}: {
  onRefresh: () => void;
  onFullscreen: () => void;
  onToggleFilter: () => void;
  filterPaneVisible: boolean;
}) {
  return (
    <div className="pbi-toolbar">
      <button
        className={`pbi-toolbar__btn ${filterPaneVisible ? "pbi-toolbar__btn--active" : ""}`}
        onClick={onToggleFilter}
        title={filterPaneVisible ? "Hide filter pane" : "Show filter pane"}
        aria-pressed={filterPaneVisible}
      >
        <FilterIcon />
        <span>Filters</span>
      </button>
      <div className="pbi-toolbar__spacer" />
      <button className="pbi-toolbar__btn" onClick={onRefresh} title="Refresh report">
        <RefreshIcon />
      </button>
      <button className="pbi-toolbar__btn" onClick={onFullscreen} title="Fullscreen">
        <FullscreenIcon />
      </button>
    </div>
  );
}

function StatusOverlay({ status, error }: { status: string; error: string | null }) {
  if (status === "ready") return null;

  if (status === "error") {
    return (
      <div className="pbi-overlay pbi-overlay--error">
        <span className="pbi-overlay__icon">⚠</span>
        <span className="pbi-overlay__title">Failed to load report</span>
        <span className="pbi-overlay__detail">{error}</span>
      </div>
    );
  }

  return (
    <div className="pbi-overlay pbi-overlay--loading">
      <span className="pbi-spinner" aria-label="Loading" />
      <span className="pbi-overlay__title">
        {status === "idle" ? "Initialising…" : "Loading report…"}
      </span>
    </div>
  );
}

function MissingConfig({ field }: { field: string }) {
  return (
    <div className="pbi-overlay pbi-overlay--error">
      <span className="pbi-overlay__icon">⚙</span>
      <span className="pbi-overlay__title">Configuration required</span>
      <span className="pbi-overlay__detail">Please provide a valid {field}.</span>
    </div>
  );
}

export function PowerBiEmbed({ config }: PowerBiEmbedProps) {
  const {
    authMode,
    accessToken: configToken,
    msalConfig,
    showToolbar = true,
    title,
    reportId,
    workspaceId,
  } = config;

  // Resolve token — either from config or MSAL
  const msalAuth = useMsalToken(authMode === "msal" ? msalConfig : undefined);
  const resolvedToken =
    authMode === "aad-token"
      ? configToken
      : msalAuth.status === "ready"
      ? msalAuth.token
      : undefined;

  const msalError = msalAuth.status === "error" ? msalAuth.message : null;

  const { containerRef, status, error, refresh, toggleFullscreen, toggleFilterPane, filterPaneVisible } =
    usePowerBiReport(config, resolvedToken);

  if (!reportId) return <MissingConfig field="Report ID" />;
  if (!workspaceId) return <MissingConfig field="Workspace ID" />;
  if (authMode === "aad-token" && !configToken) return <MissingConfig field="Access Token" />;
  if (authMode === "msal" && !msalConfig?.clientId) return <MissingConfig field="MSAL Client ID" />;

  return (
    <div className="pbi-widget">
      {(title || showToolbar) && (
        <div className="pbi-header">
          {title && <span className="pbi-header__title">{title}</span>}
          {showToolbar && (
            <Toolbar
              onRefresh={refresh}
              onFullscreen={toggleFullscreen}
              onToggleFilter={toggleFilterPane}
              filterPaneVisible={filterPaneVisible}
            />
          )}
        </div>
      )}

      <div className="pbi-body">
        {(status !== "ready" || msalError) && (
          <StatusOverlay
            status={msalError ? "error" : status}
            error={msalError ?? error}
          />
        )}
        <div ref={containerRef} className="pbi-container" aria-label="Power BI report" />
      </div>
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}
