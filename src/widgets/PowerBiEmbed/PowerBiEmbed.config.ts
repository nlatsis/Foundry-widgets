export type FilterOperator = "In" | "NotIn" | "All";
export type PageView = "fitToWidth" | "actualSize" | "oneColumn";
export type AuthMode = "aad-token" | "msal";

export interface PowerBiFilter {
  /** Power BI table name, e.g. "Sales" */
  table: string;
  /** Column name within that table, e.g. "Region" */
  column: string;
  /** Filter values driven by Workshop variables */
  values: (string | number | boolean)[];
  operator?: FilterOperator;
}

export interface MsalConfig {
  /** Azure AD tenant ID */
  tenantId: string;
  /** App registration client ID */
  clientId: string;
  /** Redirect URI registered in Azure AD */
  redirectUri?: string;
}

export interface PowerBiEmbedConfig {
  /** Power BI report GUID */
  reportId: string;
  /** Power BI workspace (group) GUID */
  workspaceId: string;

  /**
   * How to obtain the AAD access token.
   * - "aad-token": supply a pre-obtained token via `accessToken`
   * - "msal": widget acquires the token itself using `msalConfig`
   */
  authMode: AuthMode;

  /** Pre-obtained Azure AD access token (required when authMode = "aad-token") */
  accessToken?: string;

  /** MSAL app config (required when authMode = "msal") */
  msalConfig?: MsalConfig;

  /** Optional widget heading */
  title?: string;

  /** Show Power BI's built-in filter pane */
  showFilterPane?: boolean;

  /** Show Power BI's report navigation/page pane */
  showNavPane?: boolean;

  /** Show the widget's own toolbar (refresh, fullscreen, filter toggle) */
  showToolbar?: boolean;

  /**
   * Filters to apply programmatically — map Workshop variable values here.
   * Updated filters are applied to the live report without a full reload.
   */
  filters?: PowerBiFilter[];

  /** How the report page is sized inside the iframe */
  pageView?: PageView;

  /** Power BI locale string, e.g. "en-US" */
  locale?: string;
}

export const defaultConfig: PowerBiEmbedConfig = {
  reportId: "",
  workspaceId: "",
  authMode: "aad-token",
  accessToken: "",
  title: "",
  showFilterPane: false,
  showNavPane: false,
  showToolbar: true,
  filters: [],
  pageView: "fitToWidth",
  locale: "en-US",
};
