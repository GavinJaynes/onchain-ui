import { AddressDisplay } from "./address-display";

export default function AddressDisplayDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <AddressDisplay address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" />
    </div>
  );
}
