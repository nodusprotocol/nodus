import { Layout } from "@/components/layout";
import {
  LifeBuoy,
  Download,
  ShieldCheck,
  Puzzle,
  Bug,
  Mail,
  Lock,
  ChevronRight,
} from "lucide-react";

const INSTALL_STEPS = [
  {
    title: "Download & unzip",
    body: "Download the Nodus Shield package and extract the ZIP to a folder you can find again (e.g. nodus-shield).",
  },
  {
    title: "Open the Extensions page",
    body: "Go to chrome://extensions in Chrome (brave://extensions on Brave, edge://extensions on Edge).",
  },
  {
    title: "Enable Developer mode",
    body: "Turn on the Developer mode toggle in the top-right corner of the Extensions page.",
  },
  {
    title: "Load unpacked",
    body: "Click Load unpacked and select the extracted folder (the one containing manifest.json).",
  },
  {
    title: "Pin the shield",
    body: "Click the puzzle icon in the toolbar and pin Nodus Shield so the badge is always visible.",
  },
];

const FAQ = [
  {
    q: "The badge is grey / not scanning",
    a: "Badges only appear on normal http(s) sites. Chrome system pages (chrome://) and the extensions page cannot be scanned. Open a regular website and the badge will update automatically.",
  },
  {
    q: "Report Threat asks for a Phantom signature",
    a: "Reports grant Guardian reputation, so each one is cryptographically signed. Nodus Shield triggers a free, gas-less signature request in your Phantom wallet to prove your identity — no transaction and no fees. Phantom must be installed and the site must be a normal http(s) tab.",
  },
  {
    q: "How do I change the backend URL?",
    a: "Click the gear icon in the popup (or right-click the extension icon and choose Options) and update the Nodus backend URL. All scans and reports are sent there.",
  },
  {
    q: "Which browsers are supported?",
    a: "Any Chromium-based browser that supports Manifest V3 — Chrome, Brave, Edge, Arc, and Opera.",
  },
];

const PRIVACY = [
  "Nodus Shield sends the domain of the site you are visiting to the Nodus backend to compute a real-time security score. It does not collect page content, form inputs, keystrokes, or browsing history.",
  "Threat reports you submit include the target you are reporting, the threat type, an optional description, and your wallet's public address and signature. Your private keys never leave your wallet.",
  "Settings (backend URL, whitelist, protection toggle) are stored locally in your browser via chrome.storage and are never transmitted anywhere except to compute scans against your configured backend.",
  "Nodus Shield requests only the permissions it needs: reading the active tab's URL, storage for settings, and scripting to request a wallet signature when you submit a report. It does not use webRequest or intercept your network traffic.",
];

export default function Support() {
  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-grid bg-grid-fade -z-10 h-72" />
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.15em] mb-3">
              <LifeBuoy className="h-4 w-4" /> Support
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
              Nodus Shield — Help &amp; Support
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Everything you need to install, use, and troubleshoot the Nodus Shield browser
              extension. Protect before you connect.
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-14">
            <a
              href="https://chromewebstore.google.com/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary transition-colors"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Download className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Get the extension</span>
                <span className="block text-sm text-muted-foreground">
                  Install from the Chrome Web Store
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="mailto:support@nodusprotocol.com"
              className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5 hover:border-primary transition-colors"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Contact support</span>
                <span className="block text-sm text-muted-foreground">
                  support@nodusprotocol.com
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Install guide */}
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Puzzle className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">Installing the extension</h2>
            </div>
            <ol className="space-y-4">
              {INSTALL_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-border/70 bg-card p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Using it */}
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">Using Nodus Shield</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="font-bold text-sm">Green — Safe</span>
                </div>
                <p className="text-sm text-muted-foreground">Score 75–100. No threats detected.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="font-bold text-sm">Amber — Caution</span>
                </div>
                <p className="text-sm text-muted-foreground">Score 45–74. Proceed carefully.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="font-bold text-sm">Red — Danger</span>
                </div>
                <p className="text-sm text-muted-foreground">Score 0–44. Known or likely threat.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4">
              Click the shield icon to see the full score gauge, the risk breakdown per intelligence
              source, and a plain-language summary. Use <strong>Report threat</strong> to submit a
              signed report directly to the Nodus Guardian network.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Bug className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">Troubleshooting &amp; FAQ</h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-border/70 bg-card p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-bold list-none">
                    {item.q}
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-black tracking-tight">Privacy policy</h2>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4">
              {PRIVACY.map((p, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
              <p className="text-xs text-muted-foreground/70 pt-2 border-t border-border/70">
                Last updated {new Date().getFullYear()}. Questions about your data? Email{" "}
                <a className="text-primary font-semibold" href="mailto:support@nodusprotocol.com">
                  support@nodusprotocol.com
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
