import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { useGetScanStats } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Search, Brain, Users, ShieldCheck, Wallet, FileWarning, Trophy,
  Coins, Lock, Zap, ArrowRight, Radar, Network, Sparkles, Rocket, Download,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoMark from "@assets/gagaga_(77)_1783422691110.png";

export default function Home() {
  const { data: stats, isLoading } = useGetScanStats();

  return (
    <Layout>
      <div className="flex flex-col">
        {/* 1. Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid bg-grid-fade -z-10" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-primary/10 blur-3xl -z-10" />

          <div className="container mx-auto px-4 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2.5 animate-pulse" />
                  Web3 Security Layer for Solana
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.95] mb-6">
                  Protect
                  <br />
                  Before You
                  <br />
                  Connect<span className="text-primary">.</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg mb-9 leading-relaxed">
                  The security layer that empowers you with real-time{" "}
                  <span className="text-foreground font-semibold">onchain threat detection</span>,
                  AI risk analysis, and community verified signals — before your wallet gets drained.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Link
                    href="/scan"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold h-12 px-7 shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
                  >
                    Start Scanning <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`${import.meta.env.BASE_URL}nodus-shield-extension.zip`}
                    download="nodus-shield-extension.zip"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary text-secondary-foreground font-semibold h-12 px-7 border border-border hover:bg-muted transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download Extension
                  </a>
                </div>

                <TokenStatus />
              </div>

              <HeroVisual />
            </div>
          </div>
        </section>

        {/* 2. Stats */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/70">
              <StatCard title="Total Threats" value={stats?.totalThreats} loading={isLoading} />
              <StatCard title="Community Reports" value={stats?.totalReports} loading={isLoading} />
              <StatCard title="Scams Detected" value={stats?.scamCount} loading={isLoading} />
              <StatCard title="Active Guardians" value={stats?.totalGuardians} loading={isLoading} />
            </div>
          </div>
        </section>

        {/* 3. Features — Three pillars */}
        <section className="py-24 container mx-auto px-4">
          <Reveal className="max-w-2xl mb-14">
            <SectionEyebrow>The Security Stack</SectionEyebrow>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Three pillars of protection</h2>
            <p className="text-muted-foreground text-lg">
              We combine real-time threat intelligence with community consensus to keep your assets
              safe at every step.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <PillarCard index="01" icon={<Search className="w-6 h-6" />} title="Multi-Source Scanning" description="Check URLs, wallets, and smart contracts against the VirusTotal and GoPlus threat databases instantly." cta="How scanning works" href="/scan" />
            </Reveal>
            <Reveal delay={100}>
              <PillarCard index="02" icon={<Brain className="w-6 h-6" />} title="Nodus AI Analysis" description="An advanced AI model that reads complex threat patterns and turns them into recommendations anyone can understand." cta="Meet Nodus AI" href="/ai" />
            </Reveal>
            <Reveal delay={200}>
              <PillarCard index="03" icon={<Users className="w-6 h-6" />} title="Guardian Network" description="A decentralized community that reports and verifies threats. Earn on-chain reputation by protecting others." cta="Join the network" href="/dashboard" />
            </Reveal>
          </div>
        </section>

        {/* 4. How It Works */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <Reveal className="max-w-2xl mb-14">
              <SectionEyebrow>How It Works</SectionEyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Verify safety in three steps</h2>
              <p className="text-muted-foreground text-lg">
                A simple flow to confirm safety before you interact with any protocol, token, or contract.
              </p>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <Reveal delay={0}>
                  <ShowcaseStep step="01" icon={<Search className="w-5 h-5" />} title="Paste & Scan" description="Enter a website URL, wallet address, or smart contract. Nodus instantly gathers intelligence from multiple trusted sources." />
                </Reveal>
                <Reveal delay={100}>
                  <ShowcaseStep step="02" icon={<Brain className="w-5 h-5" />} title="AI Analysis" description="Nodus AI fuses VirusTotal, GoPlus, and community reports into one clear verdict: safe, caution, or danger." />
                </Reveal>
                <Reveal delay={200}>
                  <ShowcaseStep step="03" icon={<ShieldCheck className="w-5 h-5" />} title="Decide Safely" description="Get actionable recommendations you can apply right away before signing a transaction or connecting your wallet." />
                </Reveal>
              </div>

              {/* Illustrative example of a scan verdict (not live data) */}
              <Reveal delay={150}>
                <div className="rounded-2xl border border-border bg-background shadow-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                    <span className="w-3 h-3 rounded-full bg-destructive/60" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                    <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-3 text-xs font-mono text-muted-foreground">nodus.scan</span>
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                      Example
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-sm text-muted-foreground truncate">https://free-airdrop-sol.xyz</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive font-bold border border-destructive/20 shrink-0">DANGER</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[12%] bg-destructive rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><FileWarning className="w-4 h-4 text-destructive" /> VirusTotal: 8 detections</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-yellow-500" /> 14 community reports</div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      <span className="text-foreground font-semibold">Nodus AI:</span> This site shows a classic airdrop-scam pattern that requests full approval of your wallet. Do not connect.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 5. About — Billions lost */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <SectionEyebrow>Why Nodus</SectionEyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.05]">
                Billions are lost to Web3 scams every year.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                Wallet drainers, phishing sites, malicious approvals, and rug pulls cost the Solana
                community enormous sums. Most victims never had a way to check whether a link or
                contract was safe — until it was too late.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Nodus Protocol is the security layer that sits between you and the on-chain world. We
                turn fragmented threat data into a single, human-readable verdict, backed by a
                community with real skin in the game.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                <AboutPoint icon={<Radar className="w-5 h-5" />} title="Real intelligence" description="No mock data — every verdict is built from live threat sources." />
                <AboutPoint icon={<Network className="w-5 h-5" />} title="Decentralized" description="Threats are verified by an incentivized Guardian network." />
                <AboutPoint icon={<Sparkles className="w-5 h-5" />} title="AI-native" description="Complex risk explained in plain language, instantly." />
                <AboutPoint icon={<ShieldCheck className="w-5 h-5" />} title="Proactive" description="Catch threats before you sign, not after you're drained." />
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-10 shadow-2xl">
                <div className="absolute inset-0 bg-grid opacity-[0.06]" />
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
                <img src={logoMark} alt="" className="absolute -bottom-8 -right-8 w-44 opacity-[0.06] brightness-0 invert" />
                <div className="relative">
                  <p className="text-xs uppercase tracking-wider text-background/50 font-bold mb-2">
                    Built for real protection
                  </p>
                  <p className="text-lg text-background/80 mb-8 max-w-xs leading-relaxed">
                    Everything below describes how Nodus actually works — no vanity metrics, no fake data.
                  </p>
                  <div className="grid grid-cols-2 gap-px bg-background/10 rounded-2xl overflow-hidden border border-background/10">
                    <DarkMetric value="4+" label="Threat sources fused" />
                    <DarkMetric value="3" label="Risk verdict levels" />
                    <DarkMetric value="100%" label="Real, no-mock data" />
                    <DarkMetric value="24/7" label="Community coverage" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 6. Guardian Network */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-14">
                <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
                <div className="relative grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <div className="inline-flex items-center rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
                      <Trophy className="w-4 h-4 mr-2 text-primary" /> Become a Guardian
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Protect the community, build your reputation.</h2>
                    <p className="text-background/70 mb-8 leading-relaxed">
                      Guardians are the backbone of Nodus. Report threats, verify findings, and rise
                      from <span className="text-background font-semibold">Guardian</span> to{" "}
                      <span className="text-background font-semibold">Sentinel</span>. Every verified
                      contribution earns you on-chain reputation points.
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold h-12 px-7 hover:bg-primary/90 transition-colors"
                    >
                      <Wallet className="w-4 h-4" /> Start as a Guardian
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <GuardianTierRow tier="Sentinel" range="1000+ reputation" highlight />
                    <GuardianTierRow tier="Protector" range="500 - 999 reputation" />
                    <GuardianTierRow tier="Guardian" range="0 - 499 reputation" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. Token / Staking */}
        <section className="py-24 container mx-auto px-4">
          <Reveal className="max-w-2xl mb-14">
            <SectionEyebrow>Powered by $NDS</SectionEyebrow>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Security you can stake on</h2>
            <p className="text-muted-foreground text-lg">
              The NDS token aligns the network. Stake to secure Nodus, earn yield, and unlock advanced
              Guardian capabilities.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Reveal delay={0}>
              <TokenFeature icon={<Lock className="w-6 h-6" />} title="Stake & Secure" description="Lock NDS to help secure the network and earn a share of protocol rewards." />
            </Reveal>
            <Reveal delay={100}>
              <TokenFeature icon={<Coins className="w-6 h-6" />} title="Earn Yield" description="Tiered rewards for long-term stakers, from Guardian all the way to Core." />
            </Reveal>
            <Reveal delay={200}>
              <TokenFeature icon={<Zap className="w-6 h-6" />} title="Governance" description="Stakers shape protocol policy and funding through reputation-weighted voting." />
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-indigo-700 text-white p-8 md:p-12">
              <div className="absolute inset-0 bg-grid opacity-10" />
              <div className="absolute -right-16 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-4">
                    Preview · Launching soon
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Ready to stake $NDS?</h3>
                  <p className="text-white/80 max-w-md">
                    Token launching soon on Pump.fun. Explore the staking tiers and rewards ahead of launch.
                  </p>
                </div>
                <Link
                  href="/staking"
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-white text-primary font-bold h-12 px-8 hover:bg-white/90 transition-colors"
                >
                  Explore staking <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 8. Roadmap */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <Reveal className="max-w-2xl mb-16">
              <SectionEyebrow>Roadmap</SectionEyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Our path forward</h2>
              <p className="text-muted-foreground text-lg">Our vision for making Web3 safe for everyone.</p>
            </Reveal>

            <div className="relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
              <div className="hidden md:block absolute top-8 left-[12.5%] w-1/4 h-0.5 bg-primary" />
              <div className="grid md:grid-cols-4 gap-x-6 gap-y-10">
                <Reveal delay={0}>
                  <RoadmapNode icon={<ShieldCheck className="w-6 h-6" />} phase="Phase 1" title="Security Foundation" description="Multi-source scanning engine, Nodus AI analysis, and a real-time community threat feed." status="done" />
                </Reveal>
                <Reveal delay={100}>
                  <RoadmapNode icon={<Users className="w-6 h-6" />} phase="Phase 2" title="Guardian Network" description="On-chain reputation system, leaderboards, and wallet-signed report verification." status="active" />
                </Reveal>
                <Reveal delay={200}>
                  <RoadmapNode icon={<Radar className="w-6 h-6" />} phase="Phase 3" title="Proactive Protection" description="A browser extension that blocks malicious sites automatically and warns on risky transactions." status="upcoming" />
                </Reveal>
                <Reveal delay={300}>
                  <RoadmapNode icon={<Network className="w-6 h-6" />} phase="Phase 4" title="Decentralized Governance" description="Guardians decide protocol policy and funding through reputation-based governance." status="upcoming" />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* 9. FAQ */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <Reveal>
              <SectionEyebrow>FAQ</SectionEyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Frequently asked questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know about how Nodus keeps you safe.</p>
            </Reveal>

            <Reveal>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1">
                  <AccordionTrigger>What can I scan with Nodus?</AccordionTrigger>
                  <AccordionContent>Websites, wallet addresses, smart contracts, tokens, and social accounts. Nodus checks each against multiple real threat-intelligence sources and the community database.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Where does the threat data come from?</AccordionTrigger>
                  <AccordionContent>We aggregate live data from sources like VirusTotal and GoPlus, combined with verified reports from the Guardian network. Nothing is mocked — every verdict reflects real intelligence.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Do I need a wallet to use Nodus?</AccordionTrigger>
                  <AccordionContent>No. Anyone can scan targets and read the threat feed for free. A Solana wallet is only required to become a Guardian, submit reports, and track your reputation.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>Is submitting a report safe and free?</AccordionTrigger>
                  <AccordionContent>Yes. Reports are signed with your wallet to prove identity and prevent spam. Signing is gasless and costs nothing — it never moves your funds or grants any approval.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q5">
                  <AccordionTrigger>How does Guardian reputation work?</AccordionTrigger>
                  <AccordionContent>Every verified contribution earns on-chain reputation points that raise your tier from Guardian to Sentinel, unlocking greater influence over the network over time.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className="pb-24 px-4">
          <Reveal className="container mx-auto">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[hsl(222,47%,7%)] via-[hsl(224,55%,11%)] to-[hsl(226,70%,20%)] text-white p-12 md:p-20 text-center">
              <div className="absolute inset-0 bg-grid opacity-[0.08]" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
              <img src={logoMark} alt="" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] max-w-[80%] opacity-[0.04] brightness-0 invert" />
              <div className="relative">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-8">
                  <ShieldCheck className="w-4 h-4 mr-2 text-primary" /> Protect Before You Connect
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5 max-w-3xl mx-auto leading-[1.02]">
                  Don't connect blind.{" "}
                  <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Scan first.</span>
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-9 text-lg">
                  Join the community protecting their assets with Nodus Protocol. It only takes a few seconds.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/scan"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[hsl(222,47%,7%)] font-bold h-12 px-8 hover:bg-white/90 transition-colors"
                  >
                    Start Scanning Now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/threats"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 text-white font-semibold h-12 px-8 hover:bg-white/10 transition-colors"
                  >
                    View Threat Feed
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </Layout>
  );
}

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="relative w-full max-w-md aspect-square">
        {/* concentric rings */}
        <div className="absolute inset-0 rounded-full border border-primary/15" />
        <div className="absolute inset-[13%] rounded-full border border-primary/10" />
        <div className="absolute inset-[26%] rounded-full border border-primary/[0.08]" />
        {/* glow */}
        <div className="absolute inset-[18%] rounded-full bg-primary/20 blur-3xl" />

        {/* central logo tile */}
        <div className="absolute inset-[24%] rounded-[2rem] bg-gradient-to-br from-foreground to-[hsl(226,55%,16%)] shadow-2xl flex items-center justify-center animate-floaty">
          <div className="absolute inset-0 rounded-[2rem] bg-grid opacity-10" />
          <img
            src={logoMark}
            alt="Nodus"
            className="relative w-1/2 brightness-0 invert drop-shadow-[0_0_28px_rgba(59,91,255,0.55)]"
          />
        </div>

        {/* floating chips */}
        <FloatChip className="top-1 left-2" label="VirusTotal" />
        <FloatChip className="top-10 right-0" label="GoPlus" />
        <FloatChip className="bottom-12 left-0" label="Nodus AI" />
        <FloatChip className="bottom-2 right-8" label="Guardian" />
      </div>
    </div>
  );
}

function FloatChip({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`absolute ${className} flex items-center gap-2 rounded-full border border-border bg-card/90 backdrop-blur px-3 py-1.5 text-xs font-semibold shadow-lg`}>
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {label}
    </div>
  );
}

function TokenStatus() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card pl-2 pr-4 py-2">
      <span className="flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5">
        <Rocket className="w-3.5 h-3.5" /> $NDS
      </span>
      <span className="text-sm text-muted-foreground font-medium">
        Token launching soon on Pump.fun
      </span>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <span className="inline-block text-xs font-bold text-primary uppercase tracking-[0.15em] mb-4">{children}</span>;
}

function StatCard({ title, value, loading }: { title: string; value?: number; loading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      {loading ? (
        <div className="h-10 w-24 bg-muted animate-pulse rounded mb-2" />
      ) : (
        <p className="text-4xl md:text-5xl font-black tracking-tighter mb-1">{value?.toLocaleString("en-US") || 0}</p>
      )}
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
    </div>
  );
}

function PillarCard({ index, icon, title, description, cta, href }: { index: string; icon: React.ReactNode; title: string; description: string; cta: string; href: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 h-full hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className="text-6xl font-black leading-none text-foreground/[0.06] group-hover:text-primary/10 transition-colors">{index}</span>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed mb-6 flex-1">{description}</p>
        <div className="h-px w-full bg-border mb-4" />
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
          {cta} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function TokenFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 h-full hover:border-primary/40 hover:shadow-lg transition-all duration-300">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function ShowcaseStep({ step, icon, title, description }: { step: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl border border-border bg-background hover:border-primary/40 transition-colors">
      <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary font-black">
        {step}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-primary">{icon}</span>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function AboutPoint({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">{icon}</div>
      <div>
        <h4 className="font-bold mb-0.5">{title}</h4>
        <p className="text-sm text-muted-foreground leading-snug">{description}</p>
      </div>
    </div>
  );
}

function DarkMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-foreground p-6 text-center">
      <p className="text-3xl md:text-4xl font-black tracking-tighter text-primary mb-1">{value}</p>
      <p className="text-xs text-background/60 font-medium">{label}</p>
    </div>
  );
}

function GuardianTierRow({ tier, range, highlight = false }: { tier: string; range: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${highlight ? "border-primary bg-primary/15" : "border-background/15 bg-background/5"}`}>
      <div className="flex items-center gap-3">
        <ShieldCheck className={`w-5 h-5 ${highlight ? "text-primary" : "text-background/60"}`} />
        <span className="font-bold">{tier}</span>
      </div>
      <span className="text-sm text-background/60 font-mono">{range}</span>
    </div>
  );
}

function RoadmapNode({ icon, phase, title, description, status }: { icon: React.ReactNode; phase: string; title: string; description: string; status: "done" | "active" | "upcoming" }) {
  const badge =
    status === "done"
      ? { label: "Completed", cls: "bg-primary/10 text-primary border-primary/20" }
      : status === "active"
      ? { label: "In Progress", cls: "bg-yellow-400/10 text-yellow-600 border-yellow-400/30" }
      : { label: "Upcoming", cls: "bg-muted text-muted-foreground border-border" };

  const nodeCls =
    status === "upcoming"
      ? "bg-card border-2 border-border text-muted-foreground"
      : "bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/30 border-2 border-primary";

  return (
    <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
      <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl mb-5 ${nodeCls}`}>
        {icon}
      </div>
      <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wide mb-3 ${badge.cls}`}>{badge.label}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{phase}</span>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
