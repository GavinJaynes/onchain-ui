import { NetworkLogo } from "@/registry/onchain-ui/network-logo";

export function NetworkLogoDemo() {
  return <NetworkLogo chainId={8453} showTooltip />;
}

export function NetworkLogoDemoNetworks() {
  return (
    <div className="flex items-center gap-3">
      <NetworkLogo chainId={1} />
      <NetworkLogo chainId={8453} />
      <NetworkLogo chainId={10} />
      <NetworkLogo chainId={42161} />
      <NetworkLogo chainId={137} />
    </div>
  );
}

export function NetworkLogoDemoSizes() {
  return (
    <div className="flex items-center gap-3">
      <NetworkLogo chainId={8453} size="xs" />
      <NetworkLogo chainId={8453} size="sm" />
      <NetworkLogo chainId={8453} size="md" />
      <NetworkLogo chainId={8453} size="lg" />
      <NetworkLogo chainId={8453} size="xl" />
    </div>
  );
}

export function NetworkLogoDemoCustom() {
  return (
    <NetworkLogo
      name="Zora"
      symbol="ZORA"
      fallback="Z"
      className="border-foreground/20 bg-foreground text-background"
      showTooltip
    />
  );
}
