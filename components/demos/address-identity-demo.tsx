"use client";

import { AddressIdentity } from "@/registry/onchain-ui/address-identity";
import type { Address } from "viem";

const ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as Address;

export function AddressIdentityDemo() {
  return <AddressIdentity address={ADDRESS} />;
}

export function AddressIdentityDemoResolved() {
  return (
    <AddressIdentity
      address={ADDRESS}
      name="vitalik.eth"
      avatarUrl="https://metadata.ens.domains/mainnet/avatar/vitalik.eth"
    />
  );
}

export function AddressIdentityDemoFallback() {
  return <AddressIdentity address={ADDRESS} resolveIdentity={false} />;
}

export function AddressIdentityDemoNoAvatar() {
  return (
    <AddressIdentity address={ADDRESS} name="vitalik.eth" showAvatar={false} />
  );
}
