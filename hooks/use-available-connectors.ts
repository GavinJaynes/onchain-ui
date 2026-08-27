"use client";

import { useEffect, useState } from "react";
import { useConnectors } from "wagmi";

/**
 * Filters injected connectors down to wallets present in the browser while
 * preserving remote connectors such as MetaMask Connect and WalletConnect.
 *
 * `useConnectors()` always includes the generic `injected()` fallback even when
 * no wallet is installed, and connecting with it throws ProviderNotFoundError.
 * Only injected connectors should be probed: remote connectors create their
 * provider as part of connecting and are essential for mobile app deep links.
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
        if (connector.type !== "injected") return { connector, provider: null };

        try {
          const provider = await connector.getProvider();
          return provider ? { connector, provider } : null;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (cancelled) return;

      const found = results.filter((result) => result !== null);

      // EIP-6963 announces injected wallets by name; the generic "Injected"
      // fallback points at the same provider, so it is only kept when it is
      // the sole way to reach that wallet.
      const hasNamedInjected = found.some(
        ({ connector }) =>
          connector.type === "injected" && connector.id !== "injected"
      );

      // The MetaMask SDK connector replaces the extension's EIP-6963
      // announcement, so no named injected wallet is left to trigger the
      // dedupe above — yet the fallback still finds MetaMask's provider and
      // would list the same wallet twice.
      const hasMetaMaskConnector = found.some(
        ({ connector }) => connector.type === "metaMask"
      );

      const isDuplicateFallback = ({
        connector,
        provider,
      }: (typeof found)[number]) =>
        connector.id === "injected" &&
        (hasNamedInjected ||
          (hasMetaMaskConnector &&
            (provider as { isMetaMask?: boolean } | null)?.isMetaMask ===
              true));

      setProbed({
        key: connectorKey,
        connectors: found
          .filter((result) => !isDuplicateFallback(result))
          .map(({ connector }) => connector),
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
