import { NetworkLogo } from "./network-logo";

export default function NetworkLogoDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center gap-4 p-8">
      <NetworkLogo chainId={1} size="lg" />
      <NetworkLogo chainId={8453} size="lg" />
      <NetworkLogo chainId={10} size="lg" />
    </div>
  );
}
