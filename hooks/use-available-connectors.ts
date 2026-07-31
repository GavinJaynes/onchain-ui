"use client";

import { useEffect, useState } from "react";
import { useConnectors } from "wagmi";

/**
 * Filters the configured connectors down to the ones that can actually connect.
 *
 * `useConnectors()` always includes the generic `injected()` fallback even when
 * no wallet is installed, and connecting with it throws ProviderNotFoundError.
 * Probing `getProvider()` is the only reliable way to know before the user
 * clicks, and it is async, hence the state rather than a plain filter.
 *
 * The return type is inferred on purpose. Apps that augment wagmi's `Register`
 * get `useConnectors()` narrowed to their own connector union, which is not
 * assignable to the generic `Connector`; annotating this as `Connector[]` would
 * compile here and break in those apps.
 */
export function useAvailableConnectors() {
  const connectors = useConnectors();
  const [probed, setProbed] = useState<{
    key: string;
    connectors: Array<(typeof connectors)[number]>;
  } | null>(null);

  // Connector identity, not array identity: wagmi may hand back a new array on
  // any store update, and probing on every render would loop.
  const connectorKey = connectors.map((connector) => connector.uid).join(",");

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      connectors.map(async (connector) => {
        try {
          return (await connector.getProvider()) ? connector : null;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (cancelled) return;

      const found = results.filter((connector) => connector !== null);

      // EIP-6963 announces wallets by name; the generic "Injected" fallback
      // points at the same provider, so drop it when a named one exists.
      const named = found.filter((connector) => connector.id !== "injected");

      setProbed({
        key: connectorKey,
        connectors: named.length > 0 ? named : found,
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorKey]);

  // Keying the result rather than tracking a separate flag means a connector
  // change reports "probing" again instead of serving the previous browser's
  // wallet list for a frame.
  const isCurrent = probed?.key === connectorKey;

  return {
    connectors: isCurrent ? probed.connectors : [],
    isProbing: !isCurrent,
  };
}
