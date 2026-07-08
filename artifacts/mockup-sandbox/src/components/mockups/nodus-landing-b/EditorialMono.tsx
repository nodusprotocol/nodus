import React from 'react';
import { Shield, Search, Brain, Users, ArrowRight, Check, X, ShieldAlert, ChevronDown, Activity, ArrowUpRight } from 'lucide-react';
import './_group.css';

export function EditorialMono() {
  return (
    <div className="nodus-editorial-theme relative w-full overflow-x-hidden selection:bg-white selection:text-black">
      <div className="nodus-editorial-noise" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="font-display font-bold text-2xl tracking-tighter lowercase">n.</span>
            <span className="font-mono text-sm tracking-widest uppercase opacity-70">nodus</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-mono tracking-wide text-muted">
            <a href="#scan" className="hover:text-white transition-colors">Scan</a>
            <a href="#ai" className="hover:text-white transition-colors">Nodus AI</a>
            <a href="#threats" className="hover:text-white transition-colors">Threats</a>
            <a href="#report" className="hover:text-white transition-colors">Report</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#staking" className="hover:text-white transition-colors">Staking</a>
          </div>

          <div>
            <button className="btn-secondary">
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-12 border border-[#333] rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted">Web3 Security Layer for Solana</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display leading-[0.9] tracking-tight mb-8">
            Protect<br />
            <span className="italic text-muted font-light">Before You</span><br />
            Connect.
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted font-light leading-relaxed mb-12">
            Scan websites, wallets, tokens, and smart contracts in seconds. Powered by Nodus AI and a decentralized Guardian network that detects threats before your wallet gets drained.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
            <button className="btn-primary flex items-center gap-2">
              Start Scanning <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-sm font-mono uppercase tracking-widest text-muted hover:text-white transition-colors flex items-center gap-2 border-b border-transparent hover:border-white pb-1">
              Ask Nodus AI
            </button>
          </div>

          <div className="mt-24 w-full max-w-md mx-auto relative h-64 flex items-center justify-center opacity-80 mix-blend-screen">
            <img 
              src="/__mockup/images/hero-shield.png" 
              alt="Nodus Shield" 
              className="w-full h-full object-contain grayscale opacity-60"
            />
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-[#1a1a1a] py-8 overflow-hidden bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-x-16 gap-y-8 text-center md:text-left">
            <div>
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-2">Total Threats</div>
              <div className="font-display text-4xl">12,480</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-2">Community Reports</div>
              <div className="font-display text-4xl">3,210</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-2">Scams Detected</div>
              <div className="font-display text-4xl">5,940</div>
            </div>
            <div>
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-2">Active Guardians</div>
              <div className="font-display text-4xl">890</div>
            </div>
          </div>
        </section>

        {/* Features / Three Pillars */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-sm font-mono text-muted uppercase tracking-widest mb-4">Three Pillars of Protection</h2>
            <div className="h-[1px] w-full bg-[#1a1a1a]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="group">
              <Search className="w-8 h-8 mb-8 text-muted group-hover:text-white transition-colors" strokeWidth={1} />
              <h3 className="text-2xl font-display mb-4">Multi-Source Scanning</h3>
              <p className="text-muted font-light leading-relaxed">
                Checks URLs, wallets, and contracts against leading intelligence feeds including VirusTotal and GoPlus to cross-reference known malicious signatures instantly.
              </p>
            </div>
            <div className="group">
              <Brain className="w-8 h-8 mb-8 text-muted group-hover:text-white transition-colors" strokeWidth={1} />
              <h3 className="text-2xl font-display mb-4">Nodus AI Analysis</h3>
              <p className="text-muted font-light leading-relaxed">
                Deep-reads threat patterns and smart contract logic, outputting plain-language recommendations so you know exactly what risk you are taking.
              </p>
            </div>
            <div className="group">
              <Users className="w-8 h-8 mb-8 text-muted group-hover:text-white transition-colors" strokeWidth={1} />
              <h3 className="text-2xl font-display mb-4">Guardian Network</h3>
              <p className="text-muted font-light leading-relaxed">
                A decentralized community that reports and verifies new threats in real-time, earning on-chain reputation for protecting the ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works & Mock Scan */}
        <section className="py-32 bg-[#0a0a0a] border-y border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display mb-12">How it works.</h2>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <span className="font-mono text-xl text-muted">01</span>
                  <div>
                    <h4 className="text-xl font-display mb-2">Paste & Scan</h4>
                    <p className="text-muted font-light">Input any Solana contract address, token mint, or dApp URL.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="font-mono text-xl text-muted">02</span>
                  <div>
                    <h4 className="text-xl font-display mb-2">AI Analysis</h4>
                    <p className="text-muted font-light">Nodus cross-references databases and runs behavioral analysis.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <span className="font-mono text-xl text-muted">03</span>
                  <div>
                    <h4 className="text-xl font-display mb-2">Decide Safely</h4>
                    <p className="text-muted font-light">Review the human-readable verdict before you sign any transaction.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Card */}
            <div className="border border-[#1a1a1a] bg-black p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/__mockup/images/texture-grid.png')] opacity-20 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-8 border-b border-[#1a1a1a] pb-6">
                <div>
                  <div className="text-xs font-mono text-muted mb-2 uppercase">Target URL</div>
                  <div className="font-mono text-sm truncate max-w-[200px] sm:max-w-xs">https://free-airdrop-sol.xyz</div>
                </div>
                <div className="bg-[rgba(255,68,68,0.1)] border border-[#FF4444] text-[#FF4444] px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Danger
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-xs font-mono text-muted mb-2 uppercase">
                  <span>Safety Score</span>
                  <span className="text-[#FF4444]">12/100</span>
                </div>
                <div className="h-1 w-full bg-[#1a1a1a]">
                  <div className="h-full bg-[#FF4444] w-[12%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="border border-[#1a1a1a] p-4">
                  <div className="text-xs font-mono text-muted uppercase mb-1">VirusTotal</div>
                  <div className="text-white font-mono text-sm">8 detections</div>
                </div>
                <div className="border border-[#1a1a1a] p-4">
                  <div className="text-xs font-mono text-muted uppercase mb-1">Community</div>
                  <div className="text-white font-mono text-sm">14 reports</div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-white" />
                  <span className="font-mono text-xs uppercase tracking-widest text-white">Nodus AI Verdict</span>
                </div>
                <p className="text-sm font-mono text-muted leading-relaxed">
                  "This site shows a classic airdrop-scam pattern that requests full approval of your wallet. Do not connect."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Nodus */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h2 className="text-4xl md:text-6xl font-display leading-tight mb-8">
                Billions are lost to Web3 scams every year.
              </h2>
              <p className="text-xl text-muted font-light leading-relaxed mb-12">
                We believe security shouldn't be an afterthought. By combining artificial intelligence with decentralized human verification, we are building the ultimate defense layer for Solana.
              </p>
              
              <ul className="space-y-6">
                {['Real intelligence, no noise.', 'Decentralized verification.', 'AI-native from day one.', 'Proactive, not reactive.'].map((point, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg">
                    <Check className="w-5 h-5 text-white" />
                    <span className="font-light">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
              <div className="bg-black p-8 flex flex-col justify-center">
                <div className="font-display text-4xl mb-2">4+</div>
                <div className="text-sm font-mono text-muted uppercase tracking-widest">Threat Sources</div>
              </div>
              <div className="bg-black p-8 flex flex-col justify-center">
                <div className="font-display text-4xl mb-2">&lt;3s</div>
                <div className="text-sm font-mono text-muted uppercase tracking-widest">Avg Scan Time</div>
              </div>
              <div className="bg-black p-8 flex flex-col justify-center">
                <div className="font-display text-4xl mb-2">100%</div>
                <div className="text-sm font-mono text-muted uppercase tracking-widest">Real Data</div>
              </div>
              <div className="bg-black p-8 flex flex-col justify-center">
                <div className="font-display text-4xl mb-2">24/7</div>
                <div className="text-sm font-mono text-muted uppercase tracking-widest">Coverage</div>
              </div>
            </div>
          </div>
        </section>

        {/* Guardian Network CTA */}
        <section className="py-32 bg-white text-black text-center relative overflow-hidden">
          <div className="nodus-editorial-noise mix-blend-multiply opacity-10" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-6xl font-display mb-6">Protect the community,<br/>build your reputation.</h2>
            <p className="text-xl text-gray-600 font-light mb-16">Join the Guardian Network. Report threats, verify scans, and earn standing.</p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16 font-mono text-sm uppercase tracking-widest">
              <div className="flex flex-col items-center">
                <span className="font-bold text-black mb-1">Sentinel</span>
                <span className="text-gray-500">1000+ pts</span>
              </div>
              <div className="hidden md:block w-8 h-[1px] bg-gray-300" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-black mb-1">Protector</span>
                <span className="text-gray-500">500–999 pts</span>
              </div>
              <div className="hidden md:block w-8 h-[1px] bg-gray-300" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-black mb-1">Guardian</span>
                <span className="text-gray-500">0–499 pts</span>
              </div>
            </div>

            <button className="bg-black text-white px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors">
              Start as a Guardian
            </button>
          </div>
        </section>

        {/* Token / Staking */}
        <section className="py-32 px-6 max-w-7xl mx-auto border-b border-[#1a1a1a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative aspect-square max-w-md w-full mx-auto border border-[#1a1a1a] flex items-center justify-center bg-[url('/__mockup/images/hero-network.png')] bg-cover bg-center">
               <div className="absolute inset-0 bg-black/80" />
               <div className="relative z-10 text-center">
                 <div className="font-display text-8xl mb-4 text-white">N</div>
                 <div className="font-mono text-xs uppercase tracking-widest text-muted">$NDS</div>
               </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="text-sm font-mono text-muted uppercase tracking-widest mb-6">Powered by $NDS</div>
              <h2 className="text-4xl md:text-5xl font-display mb-8">Security you can stake on.</h2>
              <ul className="space-y-6 mb-12">
                <li className="border-b border-[#1a1a1a] pb-6">
                  <div className="font-mono text-white mb-2">01. Stake & Secure</div>
                  <p className="text-muted font-light text-sm">Lock your tokens to back your security reports and establish trust.</p>
                </li>
                <li className="border-b border-[#1a1a1a] pb-6">
                  <div className="font-mono text-white mb-2">02. Earn Yield</div>
                  <p className="text-muted font-light text-sm">Receive protocol emissions for active participation and accurate reporting.</p>
                </li>
                <li className="border-b border-[#1a1a1a] pb-6">
                  <div className="font-mono text-white mb-2">03. Governance</div>
                  <p className="text-muted font-light text-sm">Vote on protocol upgrades, new threat feeds, and parameter changes.</p>
                </li>
              </ul>
              <a href="#explore-staking" className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-white border-b border-white pb-1 hover:text-muted hover:border-muted transition-colors">
                Explore Staking <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display mb-20 text-center">The Path Forward.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border-t border-white pt-6">
              <div className="text-xs font-mono text-white uppercase tracking-widest mb-4 flex items-center justify-between">
                <span>Phase 1</span>
                <span className="text-muted">Done</span>
              </div>
              <h4 className="font-display text-xl mb-2">Security Foundation</h4>
              <p className="text-sm text-muted font-light">Core scanning engine, VirusTotal integration, basic AI analysis.</p>
            </div>
            
            <div className="border-t border-white pt-6">
              <div className="text-xs font-mono text-white uppercase tracking-widest mb-4 flex items-center justify-between">
                <span>Phase 2</span>
                <span className="text-white flex items-center gap-2"><span className="w-2 h-2 bg-white rounded-full animate-pulse"/> Active</span>
              </div>
              <h4 className="font-display text-xl mb-2">Guardian Network</h4>
              <p className="text-sm text-muted font-light">Community reporting, reputation scoring, decentralized verification.</p>
            </div>

            <div className="border-t border-[#333] pt-6">
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-4 flex items-center justify-between">
                <span>Phase 3</span>
                <span>Upcoming</span>
              </div>
              <h4 className="font-display text-xl mb-2 text-muted">Proactive Protection</h4>
              <p className="text-sm text-[#555] font-light">Wallet extensions, transaction simulation, auto-blocking.</p>
            </div>

            <div className="border-t border-[#333] pt-6">
              <div className="text-xs font-mono text-muted uppercase tracking-widest mb-4 flex items-center justify-between">
                <span>Phase 4</span>
                <span>Upcoming</span>
              </div>
              <h4 className="font-display text-xl mb-2 text-muted">Decentralized Gov</h4>
              <p className="text-sm text-[#555] font-light">Full protocol handover to the DAO via $NDS token.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32 bg-[#0a0a0a] border-t border-[#1a1a1a]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display mb-16 text-center">Frequently Asked</h2>
            
            <div className="space-y-0 border-y border-[#1a1a1a]">
              {[
                { q: "What can I scan?", a: "You can scan any Solana contract address, token mint, wallet address, or dApp URL. Our engine analyzes the input across multiple threat intelligence feeds." },
                { q: "Where does data come from?", a: "We aggregate data from industry-leading APIs like VirusTotal and GoPlus, supplemented by our own AI behavioral analysis and real-time reports from the Guardian Network." },
                { q: "Do I need a wallet?", a: "You don't need a wallet to run basic scans. However, connecting a wallet is required to submit reports, earn reputation, and participate as a Guardian." },
                { q: "Is submitting a report safe & free?", a: "Yes, reporting is free. It only requires a gasless signature to verify your identity and link the report to your on-chain reputation profile." },
                { q: "How does reputation work?", a: "Guardians earn points when their reports are verified by others and the AI. High reputation grants higher tiers, which increases the weight of your future reports." }
              ].map((faq, i) => (
                <details key={i} className="group border-b border-[#1a1a1a] last:border-0">
                  <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                    <span className="font-mono text-sm">{faq.q}</span>
                    <span className="transition group-open:rotate-180">
                      <ChevronDown className="w-4 h-4 text-muted" />
                    </span>
                  </summary>
                  <div className="pb-6 text-muted font-light text-sm leading-relaxed pr-12">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA & Footer */}
        <footer className="pt-32 pb-12 px-6 max-w-7xl mx-auto text-center border-t border-[#1a1a1a]">
          <h2 className="text-5xl md:text-7xl font-display mb-8">
            Don't connect blind.<br />
            <span className="italic text-muted">Scan first.</span>
          </h2>
          
          <div className="mb-32">
            <button className="btn-primary">
              Start Scanning Now
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-2 text-white mb-6 md:mb-0">
              <span className="font-display font-bold text-xl tracking-tighter lowercase">n.</span>
              <span className="font-mono text-xs tracking-widest uppercase opacity-70">nodus protocol</span>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono tracking-widest uppercase text-muted">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
