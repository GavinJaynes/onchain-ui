import { AddressIdentity } from "./address-identity";

export default function AddressIdentityDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <AddressIdentity
        address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        name="vitalik.eth"
        avatarUrl="https://metadata.ens.domains/mainnet/avatar/vitalik.eth"
      />
    </div>
  );
}
