import { useState, useEffect } from "react";
import type { MsalConfig } from "./PowerBiEmbed.config";

const POWERBI_SCOPE = "https://analysis.windows.net/powerbi/api/.default";

export type AuthState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; token: string }
  | { status: "error"; message: string };

/** Acquires an AAD token via MSAL silent flow, falling back to a redirect. */
export function useMsalToken(msalConfig: MsalConfig | undefined): AuthState {
  const [state, setState] = useState<AuthState>({ status: "idle" });

  useEffect(() => {
    if (!msalConfig) return;

    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const { PublicClientApplication } = await import("@azure/msal-browser");

        const pca = new PublicClientApplication({
          auth: {
            clientId: msalConfig.clientId,
            authority: `https://login.microsoftonline.com/${msalConfig.tenantId}`,
            redirectUri: msalConfig.redirectUri ?? window.location.origin,
          },
          cache: { cacheLocation: "sessionStorage" },
        });

        await pca.initialize();

        const accounts = pca.getAllAccounts();
        if (accounts.length === 0) {
          // No cached session — trigger redirect login
          await pca.loginRedirect({ scopes: [POWERBI_SCOPE] });
          return;
        }

        const result = await pca.acquireTokenSilent({
          scopes: [POWERBI_SCOPE],
          account: accounts[0],
        });

        if (!cancelled) setState({ status: "ready", token: result.accessToken });
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "MSAL token acquisition failed",
          });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [msalConfig?.clientId, msalConfig?.tenantId, msalConfig?.redirectUri]);

  return state;
}
