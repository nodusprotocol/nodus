import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useSubmitReport, ReportInputTargetType, ReportInputThreatType } from "@workspace/api-client-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import bs58 from "bs58";
import { Loader2, ShieldAlert, Wallet, PenLine, ShieldCheck, Award } from "lucide-react";
import { useLocation } from "wouter";
import logoMark from "@assets/gagaga_(77)_1783422691110.png";

export default function Report() {
  const { publicKey, signMessage, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const submitMutation = useSubmitReport();

  const [target, setTarget] = useState("");
  const [targetType, setTargetType] = useState<ReportInputTargetType>("website");
  const [threatType, setThreatType] = useState<ReportInputThreatType>("phishing");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connected || !publicKey) {
      toast({ title: "Wallet Not Connected", description: "Please connect your Phantom wallet first.", variant: "destructive" });
      setVisible(true);
      return;
    }

    if (!signMessage) {
      toast({ title: "Unsupported Feature", description: "Your wallet does not support message signing.", variant: "destructive" });
      return;
    }

    if (!target) {
      toast({ title: "Incomplete Form", description: "The target is required.", variant: "destructive" });
      return;
    }

    try {
      const walletAddress = publicKey.toBase58();
      const timestamp = Date.now();

      const message = `Nodus Protocol
Action: submit_report
Wallet: ${walletAddress}
Target: ${target}
TargetType: ${targetType}
ThreatType: ${threatType}
Timestamp: ${timestamp}`;

      const enc = new TextEncoder().encode(message);
      const sigBytes = await signMessage(enc);
      const signature = bs58.encode(sigBytes);

      submitMutation.mutate(
        {
          data: {
            reporterWallet: walletAddress,
            target,
            targetType,
            threatType,
            description: description || undefined,
            evidenceUrl: evidenceUrl || undefined,
            message,
            signature,
          },
        },
        {
          onSuccess: () => {
            toast({ title: "Report Submitted", description: "Thank you, Guardian. Your report is being verified." });
            setLocation("/dashboard");
          },
          onError: (error: any) => {
            const errMsg = error?.response?.data?.error || "Something went wrong.";
            toast({ title: "Failed to Submit Report", description: errMsg, variant: "destructive" });
          },
        }
      );
    } catch (err: any) {
      toast({ title: "Signature Failed", description: err.message || "Failed to sign the message with your wallet.", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-80" />
        <div className="container mx-auto px-4 py-14 max-w-5xl">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Persuasive panel */}
            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <span className="inline-block text-xs font-bold text-primary uppercase tracking-[0.15em] mb-3">Guardian Network</span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Report a threat</h1>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Help protect the community. Verified reports strengthen the network and grow your Guardian reputation.
              </p>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] text-background p-7">
                <div className="absolute inset-0 bg-grid opacity-[0.06]" />
                <img src={logoMark} alt="" className="absolute -right-6 -bottom-8 w-36 opacity-[0.07] brightness-0 invert" />
                <div className="relative space-y-6">
                  {[
                    { icon: <PenLine className="w-4 h-4" />, title: "Submit intelligence", body: "Flag a malicious site, wallet, token, or contract." },
                    { icon: <ShieldCheck className="w-4 h-4" />, title: "Sign to verify", body: "A gas-free wallet signature proves your identity." },
                    { icon: <Award className="w-4 h-4" />, title: "Earn reputation", body: "Approved reports boost your Guardian tier." },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/15 text-background">{step.icon}</div>
                      <div>
                        <p className="font-bold text-sm mb-0.5">{step.title}</p>
                        <p className="text-sm text-background/60 leading-snug">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {!connected ? (
                <div className="rounded-3xl border border-border bg-card text-center py-16 px-8">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Connect your wallet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">Connect your Solana wallet to cryptographically sign your report.</p>
                  <Button onClick={() => setVisible(true)} size="lg" className="gap-2 rounded-full px-8">
                    <Wallet className="w-4 h-4" /> Connect Phantom
                  </Button>
                </div>
              ) : (
                <div className="rounded-3xl border border-border bg-card overflow-hidden">
                  <div className="border-b border-border p-6">
                    <h2 className="text-lg font-bold">Threat Intelligence Form</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Every report requires a wallet signature to prevent spam.</p>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="targetType">Target Type</Label>
                          <Select value={targetType} onValueChange={(v) => setTargetType(v as ReportInputTargetType)}>
                            <SelectTrigger id="targetType" className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="wallet">Wallet</SelectItem>
                              <SelectItem value="contract">Smart Contract</SelectItem>
                              <SelectItem value="token">Token</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="threatType">Threat Type</Label>
                          <Select value={threatType} onValueChange={(v) => setThreatType(v as ReportInputThreatType)}>
                            <SelectTrigger id="threatType" className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="phishing">Phishing</SelectItem>
                              <SelectItem value="drainer">Drainer</SelectItem>
                              <SelectItem value="scam">Scam</SelectItem>
                              <SelectItem value="rugpull">Rugpull</SelectItem>
                              <SelectItem value="fake_token">Fake Token</SelectItem>
                              <SelectItem value="fake_social">Fake Account</SelectItem>
                              <SelectItem value="malicious_contract">Malicious Contract</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="target">Target (URL/Address)</Label>
                        <Input id="target" className="rounded-xl" placeholder="Enter the malicious address..." value={target} onChange={(e) => setTarget(e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="evidenceUrl">Evidence URL (Optional)</Label>
                        <Input id="evidenceUrl" className="rounded-xl" placeholder="Link to a screenshot or analysis..." value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Threat Description (Optional)</Label>
                        <Textarea id="description" className="rounded-xl min-h-[110px]" placeholder="Describe how this threat works..." value={description} onChange={(e) => setDescription(e.target.value)} />
                      </div>

                      <div className="flex gap-3 rounded-2xl bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground">
                        <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
                        <p>Submitting will prompt a signature request in your wallet. It's free (no gas fee) and only used to prove your Guardian identity.</p>
                      </div>

                      <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitMutation.isPending}>
                        {submitMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PenLine className="w-4 h-4 mr-2" />}
                        Sign &amp; Submit Report
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
