import React, { useState } from 'react';
import { 
  Shield, Network, Terminal, Activity, Database, Cpu, 
  ArrowRight, AlertTriangle, Search, ShieldCheck, ChevronDown, 
  ChevronUp, Lock, Zap, Box, Eye, CheckCircle2
} from 'lucide-react';

export function SentinelGrid() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-x-hidden">
      <style>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        .bg-fine-grid {
          background-size: 10px 10px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        .tabular-mono {
          font-variant-numeric: tabular-nums;
        }
      `}</style>

      {/* 1. Sticky Top Nav */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border border-white flex items-center justify-center">
              <span className="font-bold text-lg leading-none mb-0.5">n</span>
            </div>
            <span className="font-bold text-xl tracking-tighter hidden sm:block">nodus</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-sm font-mono text-gray-400">
            {['Scan', 'Nodus AI', 'Threats', 'Report', 'Dashboard', 'Staking'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors uppercase tracking-wider">
                {item}
              </a>
            ))}
          </div>
          <button className="border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-colors px-4 py-2 text-sm font-mono uppercase tracking-wider">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* 2. Hero */}
      <header className="relative min-h-[85vh] flex flex-col justify-center border-b border-white/10 overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/hero-network.png" 
            alt="Network Nodes" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
          <div className="absolute inset-0 bg-grid-pattern z-10 pointer-events-none mix-blend-overlay opacity-50"></div>
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-black/50 backdrop-blur-sm px-3 py-1.5 mb-8">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-300">Web3 Security Layer for Solana</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold uppercase tracking-tighter leading-[0.9] mb-8 max-w-5xl">
            Protect <br />
            <span className="text-transparent text-stroke-white [-webkit-text-stroke:1px_rgba(255,255,255,0.8)]">Before You</span> <br />
            Connect.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 font-light leading-relaxed">
            Scan websites, wallets, tokens, and smart contracts in seconds. 
            Powered by Nodus AI and a decentralized Guardian network that 
            detects threats before your wallet gets drained.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-black px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group">
              Start Scanning
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 bg-black/50 backdrop-blur-sm px-8 py-4 font-mono text-sm uppercase tracking-widest hover:border-white/60 transition-colors flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4" />
              Ask Nodus AI
            </button>
          </div>
        </div>
      </header>

      {/* 3. Stats Bar */}
      <section className="border-b border-white/10 bg-[#050505]">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10 max-w-[1440px] mx-auto">
          {[
            { label: 'Total Threats', value: '12,480' },
            { label: 'Community Reports', value: '3,210' },
            { label: 'Scams Detected', value: '5,940' },
            { label: 'Active Guardians', value: '890' },
          ].map((stat, i) => (
            <div key={i} className="p-6 md:p-8 flex flex-col justify-center">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                [ {stat.label} ]
              </span>
              <span className="text-3xl md:text-4xl font-mono tabular-mono font-bold tracking-tight">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features */}
      <section className="py-24 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-fine-grid opacity-30 pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-4">/// System Architecture</h2>
            <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Three pillars of protection</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <Database className="w-8 h-8" />,
                title: 'Multi-Source Scanning',
                desc: 'Checks URLs, wallets, and contracts against aggregate databases including VirusTotal and GoPlus simultaneously.'
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: 'Nodus AI Analysis',
                desc: 'Reads raw threat patterns and translates complex smart contract logic into plain-language recommendations.'
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: 'Guardian Network',
                desc: 'Decentralized community that reports and verifies threats in real-time. Earn on-chain reputation for keeping the ecosystem safe.'
              }
            ].map((feat, i) => (
              <div key={i} className="border border-white/10 bg-[#0a0a0a] p-8 hover:border-white/30 transition-colors group">
                <div className="mb-6 text-gray-400 group-hover:text-white transition-colors">{feat.icon}</div>
                <h4 className="text-xl font-bold uppercase tracking-tight mb-3">{feat.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed text-sm">{feat.desc}</p>
                <div className="mt-8 pt-4 border-t border-white/10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600">Module_{i+1} // Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-24 border-b border-white/10 bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div>
              <h2 className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-4">/// Operational Flow</h2>
              <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-12">How it works</h3>
              
              <div className="space-y-12">
                {[
                  { num: '01', title: 'Paste & Scan', desc: 'Input any Solana wallet address, token mint, smart contract, or dApp URL into the command line.' },
                  { num: '02', title: 'AI Analysis', desc: 'Nodus AI correlates data across 14+ security endpoints and cross-references community reports.' },
                  { num: '03', title: 'Decide Safely', desc: 'Get a definitive verdict before you sign a transaction or connect your wallet.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="font-mono text-xl font-bold text-gray-600">[{step.num}]</div>
                    <div>
                      <h4 className="text-lg font-bold uppercase tracking-tight mb-2">{step.title}</h4>
                      <p className="text-gray-400 text-sm font-light leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Scan Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-50"></div>
              <div className="relative border border-white/20 bg-[#050505] shadow-2xl overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a0a]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full border border-white/20"></div>
                    <div className="w-3 h-3 rounded-full border border-white/20"></div>
                    <div className="w-3 h-3 rounded-full border border-white/20"></div>
                  </div>
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Scan_Result.log</span>
                </div>
                
                <div className="p-6 font-mono text-sm">
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-gray-500 mb-1 text-xs uppercase">Target URL:</div>
                    <div className="text-white truncate">https://free-airdrop-sol.xyz</div>
                  </div>

                  <div className="flex items-center justify-between mb-8">
                    <div className="text-gray-500 text-xs uppercase">System Verdict:</div>
                    <div className="flex items-center gap-2 border border-red-500/50 bg-red-500/10 text-red-500 px-3 py-1 text-xs font-bold tracking-widest uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Danger
                    </div>
                  </div>

                  {/* Safety Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase">
                      <span>Safety Score</span>
                      <span className="text-red-500">12/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-red-500 w-[12%]"></div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">VirusTotal:</span>
                      <span className="text-red-400">8 detections</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">GoPlus:</span>
                      <span className="text-red-400">Malicious contract</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500">Community:</span>
                      <span className="text-white">14 reports</span>
                    </div>
                  </div>

                  <div className="bg-[#111] border border-white/10 p-4 relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="flex gap-3">
                      <Terminal className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-bold mb-1 block text-xs">Nodus AI:</span>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          "This site shows a classic airdrop-scam pattern that requests full approval of your wallet. Do not connect. Associated smart contract matches known drainer signatures."
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. About / Why Nodus */}
      <section className="py-24 border-b border-white/10 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full">
           <img src="/__mockup/images/hero-shield.png" className="w-full h-full object-cover opacity-10 mix-blend-screen" alt="Shield Wireframe" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl mb-16">
            <h2 className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-4">/// The Problem</h2>
            <p className="text-3xl md:text-4xl font-bold uppercase tracking-tight leading-tight">
              Billions are lost to Web3 scams every year. We are building the immune system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 mb-16 border-t border-white/10 pt-12">
            {[
              { title: 'Real Intelligence', desc: 'Aggregating data from top security providers.' },
              { title: 'Decentralized', desc: 'No single point of failure or censorship.' },
              { title: 'AI-Native', desc: 'Pattern recognition at scale, instantly.' },
              { title: 'Proactive', desc: 'Intercepting threats before execution.' }
            ].map((pt, i) => (
              <div key={i} className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-white shrink-0" />
                <div>
                  <h4 className="font-bold uppercase tracking-tight mb-1">{pt.title}</h4>
                  <p className="text-gray-400 text-sm font-light">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '4+', label: 'Threat Sources' },
              { val: '<3s', label: 'Avg Scan Time' },
              { val: '100%', label: 'Real Data' },
              { val: '24/7', label: 'Coverage' }
            ].map((metric, i) => (
              <div key={i} className="border border-white/10 bg-black p-6 flex flex-col items-center text-center justify-center">
                <span className="text-3xl font-mono font-bold mb-2 tabular-mono">{metric.val}</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Guardian Network CTA */}
      <section className="py-32 border-b border-white/10 text-center relative">
         <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto px-4 relative z-10">
            <Eye className="w-12 h-12 mx-auto mb-8 text-white/50" />
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">
              Protect the community.<br />Build your reputation.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-lg font-light">
              Join the Guardian Network. Report suspicious contracts, verify community claims, and earn standing in the most trusted security alliance on Solana.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
              {[
                { tier: 'Sentinel', range: '1000+ points', desc: 'Elite analysts with direct AI training impact.' },
                { tier: 'Protector', range: '500–999 points', desc: 'Verified reviewers with high vote weight.' },
                { tier: 'Guardian', range: '0–499 points', desc: 'Active community reporters.' }
              ].map((tier, i) => (
                <div key={i} className="border border-white/10 bg-[#050505] p-6 hover:bg-[#0a0a0a] transition-colors">
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-4">
                    Tier 0{i+1}
                  </div>
                  <h4 className="text-xl font-bold uppercase tracking-tight mb-1">{tier.tier}</h4>
                  <div className="font-mono text-xs text-white mb-4 tabular-mono">[{tier.range}]</div>
                  <p className="text-gray-400 text-sm">{tier.desc}</p>
                </div>
              ))}
            </div>

            <button className="bg-white text-black px-8 py-4 font-mono text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
              Start as a Guardian
              <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </section>

      {/* 8. Token/Staking */}
      <section className="py-24 border-b border-white/10 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('/__mockup/images/texture-grid.png')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none"></div>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <div className="inline-block border border-white/20 bg-black/50 px-3 py-1 font-mono text-xs uppercase tracking-widest text-gray-400 mb-6">
              Token Utility
            </div>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6">Powered by $NDS</h2>
            <p className="text-gray-400 mb-8 max-w-lg text-lg font-light leading-relaxed">
              Security you can stake on. The $NDS token aligns incentives across the network, powering the decentralized intelligence engine.
            </p>
            <ul className="space-y-4 font-mono text-sm mb-10">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white" /> Stake & Secure</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white" /> Earn Yield</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-white" /> Protocol Governance</li>
            </ul>
            <a href="#" className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-white hover:text-gray-400 transition-colors border-b border-white pb-1 hover:border-gray-400">
              Explore Staking <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="flex-1 w-full max-w-md">
             <div className="border border-white/10 bg-[#0a0a0a] p-8 relative">
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>
               
               <div className="text-center mb-8">
                 <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Current APY</div>
                 <div className="text-5xl font-mono font-bold tabular-mono">14.2%</div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex justify-between border-b border-white/10 pb-2 text-sm font-mono">
                   <span className="text-gray-500">Total Value Locked</span>
                   <span>$2.4M</span>
                 </div>
                 <div className="flex justify-between border-b border-white/10 pb-2 text-sm font-mono">
                   <span className="text-gray-500">Staked $NDS</span>
                   <span>14,500,000</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 9. Roadmap */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="mb-16">
             <h2 className="font-mono text-sm text-gray-500 uppercase tracking-widest mb-4">/// Protocol Evolution</h2>
             <h3 className="text-4xl font-bold uppercase tracking-tighter">Roadmap</h3>
          </div>
          
          <div className="grid md:grid-cols-4 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { phase: 'Phase 1', title: 'Security Foundation', status: 'Done', active: false },
              { phase: 'Phase 2', title: 'Guardian Network', status: 'Active', active: true },
              { phase: 'Phase 3', title: 'Proactive Protection', status: 'Upcoming', active: false },
              { phase: 'Phase 4', title: 'Decentralized Gov', status: 'Upcoming', active: false }
            ].map((item, i) => (
              <div key={i} className={`p-6 md:p-8 ${item.active ? 'bg-white/5' : 'bg-black'}`}>
                <div className="flex justify-between items-start mb-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-500">[{item.phase}]</span>
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${item.active ? 'border-white text-white' : item.status === 'Done' ? 'border-white/20 text-gray-400' : 'border-transparent text-gray-600'}`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold uppercase tracking-tight">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-24 border-b border-white/10 bg-[#050505]">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FaqItem 
              question="What can I scan?" 
              answer="You can scan Solana wallet addresses, token mints, smart contract addresses, and dApp URLs. Our system will analyze them against multiple threat databases."
            />
            <FaqItem 
              question="Where does the data come from?" 
              answer="Data is aggregated from industry-leading security providers like VirusTotal and GoPlus, combined with real-time heuristic analysis by Nodus AI and verified reports from our decentralized Guardian Network."
            />
            <FaqItem 
              question="Do I need to connect a wallet to scan?" 
              answer="No. Basic scanning is completely open and requires no wallet connection. We believe security should be accessible to everyone."
            />
            <FaqItem 
              question="Is submitting a report safe & free?" 
              answer="Yes. Submitting reports is free and does not require signing any transactions that could put your funds at risk. Your identity remains pseudonymous."
            />
            <FaqItem 
              question="How does reputation work?" 
              answer="Guardians earn on-chain reputation points for accurate reports and verifications. Higher reputation unlocks greater vote weight, exclusive discord roles, and potential token rewards."
            />
          </div>
        </div>
      </section>

      {/* 11. Final CTA & Footer */}
      <footer className="pt-24 pb-8 bg-black">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8">
              Don't connect blind.<br />
              <span className="text-transparent text-stroke-white [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">Scan first.</span>
            </h2>
            <button className="bg-white text-black px-10 py-5 font-mono text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              Start Scanning Now
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 mt-12 gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-white flex items-center justify-center">
                <span className="font-bold text-sm leading-none mb-[1px]">n</span>
              </div>
              <span className="font-bold text-lg tracking-tighter">nodus</span>
            </div>
            
            <div className="flex gap-6 text-sm font-mono text-gray-500 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            
            <div className="text-xs font-mono text-gray-600 uppercase">
              © {new Date().getFullYear()} Nodus Protocol.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 bg-black">
      <button 
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold uppercase tracking-tight pr-8">{question}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
      </button>
      {open && (
        <div className="p-6 pt-0 text-gray-400 font-light text-sm leading-relaxed border-t border-white/5 mt-2">
          <div className="pt-4">{answer}</div>
        </div>
      )}
    </div>
  );
}
