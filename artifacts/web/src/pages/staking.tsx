import { Layout } from "@/components/layout";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Lock, Coins, TrendingUp, ShieldCheck, Zap, Info, Check } from "lucide-react";
import logoMark from "@assets/gagaga_(77)_1783422691110.png";

const tiers = [
  { name: "Guardian", min: 100, apy: 12, benefits: "Basic access, community voting" },
  { name: "Senior", min: 5000, apy: 18, benefits: "2x vote weight, priority API" },
  { name: "Validator", min: 25000, apy: 25, benefits: "Report validation, fee-free" },
  { name: "Core", min: 100000, apy: 35, benefits: "5x vote weight, revenue share" },
];

const allocation = [
  { label: "Community — staking & report rewards", pct: 40 },
  { label: "Ecosystem & development", pct: 25 },
  { label: "Team & advisors", pct: 20 },
  { label: "Liquidity & treasury", pct: 15 },
];

export default function Staking() {
  const [amount, setAmount] = useState<number>(1000);

  const currentTier = tiers.slice().reverse().find((t) => amount >= t.min) || tiers[0];
  const estimatedMonthly = Math.floor((amount * (currentTier.apy / 100)) / 12);

  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-80" />
        <div className="container mx-auto px-4 py-14 max-w-5xl">
          {/* Preview banner */}
          <div className="mx-auto mb-8 flex max-w-fit items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wide">Preview · $NDS launching soon on Pump.fun</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold text-primary uppercase tracking-[0.15em] mb-3">Powered by $NDS</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Security you can stake on</h1>
            <p className="text-lg text-muted-foreground">
              Lock your NDS tokens to secure the network, earn yield, and unlock advanced Guardian capabilities.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Simulator */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-border bg-card overflow-hidden">
                <div className="p-6 md:p-8 border-b border-border">
                  <h2 className="text-xl font-bold mb-1">Staking Simulator</h2>
                  <p className="text-sm text-muted-foreground">Estimate your potential yield based on your tier.</p>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-semibold text-muted-foreground">NDS Amount</span>
                      <span className="text-3xl font-black tracking-tighter font-mono text-primary">{amount.toLocaleString("en-US")}</span>
                    </div>
                    <Slider value={[amount]} onValueChange={(v) => setAmount(v[0])} max={150000} step={100} className="py-3" />
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                      <span>100 NDS</span>
                      <span>150,000+ NDS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="rounded-2xl border border-border bg-background p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Current Tier</p>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="text-xl font-black tracking-tight">{currentTier.name}</span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-background p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Estimated APY</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-xl font-black tracking-tight text-green-600">{currentTier.apy}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result panel */}
                <div className="relative overflow-hidden bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] text-background p-6 md:p-8">
                  <div className="absolute inset-0 bg-grid opacity-[0.06]" />
                  <img src={logoMark} alt="" className="absolute -right-6 -bottom-8 w-40 opacity-[0.06] brightness-0 invert" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-background/50 mb-1">Estimated Monthly Rewards</p>
                      <p className="text-4xl font-black tracking-tighter font-mono">+{estimatedMonthly.toLocaleString("en-US")}<span className="text-lg text-background/60 ml-2">NDS</span></p>
                    </div>
                    <button
                      disabled
                      className="inline-flex items-center gap-2 rounded-full bg-background/15 border border-background/20 px-6 h-12 text-sm font-semibold text-background/70 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4" /> Lock Tokens (Soon)
                    </button>
                  </div>
                </div>
              </div>

              {/* Tiers */}
              <div className="grid sm:grid-cols-2 gap-4">
                {tiers.map((tier) => {
                  const active = currentTier.name === tier.name;
                  return (
                    <div
                      key={tier.name}
                      className={`rounded-2xl border p-5 transition-all ${active ? "border-primary bg-primary/[0.06] shadow-lg shadow-primary/5" : "border-border bg-card"}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{tier.name}</h3>
                          {active && <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 rounded-full px-2 py-0.5">You</span>}
                        </div>
                        <span className="font-mono text-sm font-bold text-green-600 border border-green-500/30 rounded-full px-2.5 py-0.5">{tier.apy}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Min. <span className="font-mono font-semibold text-foreground/80">{tier.min.toLocaleString("en-US")}</span> NDS</p>
                      <p className="text-xs text-foreground/70 leading-relaxed">{tier.benefits}</p>
                    </div>
                  );
                })}
              </div>

              <p className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed px-1">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Illustrative rates for the planned staking program. Not financial advice — final terms are subject to change at launch.
              </p>
            </div>

            {/* Tokenomics */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">Tokenomics</h3>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-muted-foreground bg-muted rounded-full px-2 py-0.5 border border-border">Planned</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Nodus Protocol is secured by NDS, its native utility and governance token.
                </p>

                <div className="rounded-2xl bg-accent/60 border border-border p-4 mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Supply</p>
                  <p className="text-2xl font-black tracking-tighter font-mono">1,000,000,000<span className="text-sm text-muted-foreground ml-2">NDS</span></p>
                </div>

                <div className="space-y-4">
                  {allocation.map((a) => (
                    <div key={a.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-foreground/80">{a.label}</span>
                        <span className="font-mono font-bold">{a.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${a.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="font-bold text-lg mb-4">Utility</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Stake to secure the network and earn rewards",
                    "Reputation-weighted governance voting",
                    "20% of API fees buy back and burn NDS",
                    "Unlock priority scanning and API access",
                  ].map((u) => (
                    <li key={u} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="w-3 h-3" />
                      </span>
                      <span className="text-foreground/80 leading-snug">{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
