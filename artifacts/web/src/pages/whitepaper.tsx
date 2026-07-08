import { Layout } from "@/components/layout";
import { Link } from "wouter";
import {
  FileText,
  ShieldCheck,
  Radar,
  Brain,
  Users,
  Coins,
  Network,
  AlertTriangle,
  ArrowRight,
  Download,
} from "lucide-react";

const SECTIONS = [
  { id: "abstract", label: "Abstract" },
  { id: "problem", label: "The Problem" },
  { id: "architecture", label: "Architecture" },
  { id: "scanning", label: "Scan Engine" },
  { id: "guardians", label: "Guardian Network" },
  { id: "token", label: "$NDS Token" },
  { id: "roadmap", label: "Roadmap" },
  { id: "disclaimer", label: "Disclaimer" },
];

function Section({
  id,
  eyebrow,
  title,
  icon,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] mb-3">
        {icon} {eyebrow}
      </span>
      <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">{title}</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function Whitepaper() {
  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-72" />
        <div className="container mx-auto px-4 py-14 max-w-6xl">
          {/* Header */}
          <div className="mb-12 max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] mb-3">
              <FileText className="h-4 w-4" /> Whitepaper · v1.0
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-[1.02]">
              The Nodus Protocol Whitepaper
            </h1>
            <p className="text-muted-foreground text-lg">
              A decentralized Web3 security layer for Solana. This document describes how Nodus
              turns fragmented threat intelligence into a single, human-readable verdict —{" "}
              <span className="text-foreground font-semibold">protect before you connect.</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr] gap-12">
            {/* Sticky ToC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                  Contents
                </p>
                <ul className="space-y-2.5">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={`${import.meta.env.BASE_URL}nodus-shield-extension.zip`}
                  download="nodus-shield-extension.zip"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold h-10 px-5 border border-border hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" /> Get the extension
                </a>
              </div>
            </aside>

            {/* Body */}
            <div className="space-y-14 max-w-3xl">
              <Section
                id="abstract"
                eyebrow="01"
                title="Abstract"
                icon={<FileText className="h-4 w-4" />}
              >
                <p>
                  Web3 users are asked to trust addresses, contracts, and websites with irreversible
                  consequences — a single malicious signature can drain an entire wallet. Nodus
                  Protocol is a security layer that sits between the user and the on-chain world. It
                  aggregates live threat intelligence, applies AI risk analysis, and fuses in
                  community-verified reports to produce a single verdict: <em>safe</em>,{" "}
                  <em>caution</em>, or <em>danger</em>.
                </p>
                <p>
                  Every verdict is built from real data — no mocked signals. Nodus is delivered as a
                  web application, a public API, and a downloadable browser extension (Nodus Shield)
                  that scans sites in real time before you connect your wallet.
                </p>
              </Section>

              <Section
                id="problem"
                eyebrow="02"
                title="The Problem"
                icon={<AlertTriangle className="h-4 w-4" />}
              >
                <p>
                  Billions are lost every year to wallet drainers, phishing sites, malicious token
                  approvals, and rug pulls. The core issue is not a lack of data — it is that threat
                  data is fragmented across many sources, is hard to interpret, and arrives too late
                  for the average user to act on.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Threat signals are scattered across scanners, explorers, and social feeds.</li>
                  <li>Raw detections are technical and not actionable for most users.</li>
                  <li>There is no incentive-aligned network verifying threats in real time.</li>
                  <li>Protection is reactive — users learn a site was malicious after being drained.</li>
                </ul>
              </Section>

              <Section
                id="architecture"
                eyebrow="03"
                title="Architecture"
                icon={<Network className="h-4 w-4" />}
              >
                <p>
                  Nodus is composed of four layers that turn raw intelligence into a protective
                  verdict at the point of decision.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 not-prose">
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <Radar className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-bold text-foreground mb-1">Intelligence layer</h3>
                    <p className="text-sm">
                      Live data pulled from multiple threat sources for any target you scan.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <Brain className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-bold text-foreground mb-1">AI analysis layer</h3>
                    <p className="text-sm">
                      An AI model fuses signals into one clear, plain-language verdict.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <Users className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-bold text-foreground mb-1">Community layer</h3>
                    <p className="text-sm">
                      Guardians submit wallet-signed reports that strengthen every verdict.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <ShieldCheck className="h-5 w-5 text-primary mb-2" />
                    <h3 className="font-bold text-foreground mb-1">Delivery layer</h3>
                    <p className="text-sm">
                      Web app, public API, and the Nodus Shield extension deliver protection.
                    </p>
                  </div>
                </div>
              </Section>

              <Section
                id="scanning"
                eyebrow="04"
                title="The Scan Engine"
                icon={<Radar className="h-4 w-4" />}
              >
                <p>
                  A scan takes any target — a website, wallet address, smart contract, token, or
                  social account — and queries multiple threat-intelligence sources plus the Nodus
                  community database. Each source returns a partial signal; Nodus normalizes them
                  into a single score from 0 to 100.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 not-prose">
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="font-bold text-foreground text-sm">Safe · 75–100</span>
                    </div>
                    <p className="text-sm">No threats detected across sources.</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-3 w-3 rounded-full bg-yellow-500" />
                      <span className="font-bold text-foreground text-sm">Caution · 45–74</span>
                    </div>
                    <p className="text-sm">Mixed signals — proceed carefully.</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="font-bold text-foreground text-sm">Danger · 0–44</span>
                    </div>
                    <p className="text-sm">Known or likely threat — do not connect.</p>
                  </div>
                </div>
              </Section>

              <Section
                id="guardians"
                eyebrow="05"
                title="Guardian Network"
                icon={<Users className="h-4 w-4" />}
              >
                <p>
                  Guardians are the human backbone of Nodus. Anyone with a Solana wallet can report a
                  threat. To prevent spam and prove identity, each report is cryptographically signed
                  with the reporter's wallet — a gas-less signature that never moves funds or grants
                  approvals. The backend verifies the signature, enforces a freshness window, and
                  blocks replays before accepting a report.
                </p>
                <p>
                  Verified contributions earn on-chain reputation that raises a Guardian's tier over
                  time, unlocking greater influence over the network:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="text-foreground font-semibold">Guardian</span> — the entry tier
                    for new contributors.
                  </li>
                  <li>
                    <span className="text-foreground font-semibold">Protector</span> — for
                    consistent, verified reporters.
                  </li>
                  <li>
                    <span className="text-foreground font-semibold">Sentinel</span> — the highest
                    tier, with the most weight in verification.
                  </li>
                </ul>
              </Section>

              <Section
                id="token"
                eyebrow="06"
                title="$NDS Token"
                icon={<Coins className="h-4 w-4" />}
              >
                <p>
                  The $NDS token aligns incentives across the network. It is designed to reward the
                  people who keep the community safe and to give stakeholders a voice in how the
                  protocol evolves.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="text-foreground font-semibold">Stake &amp; secure</span> — lock
                    NDS to help secure the network and earn protocol rewards.
                  </li>
                  <li>
                    <span className="text-foreground font-semibold">Earn yield</span> — tiered
                    rewards for long-term stakers.
                  </li>
                  <li>
                    <span className="text-foreground font-semibold">Governance</span> — stakers shape
                    protocol policy and funding through reputation-weighted voting.
                  </li>
                </ul>
                <p className="text-sm bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <span className="text-foreground font-semibold">Status:</span> $NDS is launching soon
                  on Pump.fun. Details in this section are a preview and may change ahead of launch.
                </p>
              </Section>

              <Section
                id="roadmap"
                eyebrow="07"
                title="Roadmap"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                <ol className="space-y-4 not-prose">
                  {[
                    { p: "Phase 1", t: "Security Foundation", d: "Multi-source scanning engine, AI analysis, and a real-time community threat feed.", s: "Completed" },
                    { p: "Phase 2", t: "Guardian Network", d: "On-chain reputation, leaderboards, and wallet-signed report verification.", s: "In Progress" },
                    { p: "Phase 3", t: "Proactive Protection", d: "A browser extension that scans sites and warns on risky actions before you connect.", s: "In Progress" },
                    { p: "Phase 4", t: "Decentralized Governance", d: "Guardians decide protocol policy and funding through reputation-based governance.", s: "Upcoming" },
                  ].map((r) => (
                    <li key={r.p} className="flex gap-4 rounded-2xl border border-border/70 bg-card p-5">
                      <div className="shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          {r.p}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{r.t}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-border font-bold uppercase tracking-wide text-muted-foreground">
                            {r.s}
                          </span>
                        </div>
                        <p className="text-sm">{r.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section
                id="disclaimer"
                eyebrow="08"
                title="Disclaimer"
                icon={<AlertTriangle className="h-4 w-4" />}
              >
                <p>
                  Nodus Protocol provides risk signals to help users make informed decisions. It does
                  not constitute financial advice, and a "safe" verdict is not a guarantee. Always do
                  your own research before signing transactions or connecting your wallet. Token
                  details are preliminary and subject to change.
                </p>
                <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border/70">
                  Whitepaper v1.0 · Last updated {new Date().getFullYear()}. Questions?{" "}
                  <Link href="/support" className="text-primary font-semibold">
                    Visit support
                  </Link>
                  .
                </p>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
