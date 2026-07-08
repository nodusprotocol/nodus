import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const base58 = publicKey.toBase58();
    const shortAddress = `${base58.slice(0, 4)}...${base58.slice(-4)}`;

    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => disconnect()}
        className="rounded-full font-mono text-xs gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
      >
        <Wallet className="w-3 h-3 text-primary" />
        {shortAddress}
      </Button>
    );
  }

  return (
    <Button 
      size="sm"
      onClick={() => setVisible(true)}
      className="rounded-full gap-2 font-semibold"
    >
      <Wallet className="w-3 h-3" />
      Connect Wallet
    </Button>
  );
}
