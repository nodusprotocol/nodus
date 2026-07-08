import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { WalletButton } from "./wallet-button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import logoMark from "@assets/gagaga_(77)_1783422691110.png";

const navItems = [
  { href: "/scan", label: "Scan" },
  { href: "/ai", label: "Nodus AI" },
  { href: "/threats", label: "Threats" },
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/staking", label: "Staking" },
  { href: "/whitepaper", label: "Whitepaper" },
];

const tickerItems = [
  "Real-time Web3 threat intelligence",
  "AI-powered scam pattern detection",
  "Powered by Nodus AI + Guardian network",
  "Protect before you connect",
  "VirusTotal & GoPlus data fused live",
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src={logoMark} alt="Nodus" className="h-7 w-7 object-contain" />
      <span className="font-black tracking-tight text-xl">nodus</span>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium tracking-tight transition-colors ${
                  location === item.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <WalletButton />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:bg-accent transition-colors"
                  aria-label="Open menu"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="mb-8 mt-2">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                          location === item.href ? "text-primary bg-accent" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Scrolling ticker */}
        <div className="border-t border-border/70 bg-foreground text-background overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
                {tickerItems.map((t, i) => (
                  <span key={i} className="flex items-center text-xs font-semibold uppercase tracking-wider py-2">
                    <span className="mx-6 text-primary">◆</span>
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-clip">{children}</main>

      <footer className="border-t border-border/70 bg-card mt-auto">
        <div className="container mx-auto px-4 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                The Web3 security layer for Solana. Scan websites, wallets, tokens, and smart
                contracts for threats before you connect — powered by Nodus AI and a decentralized
                Guardian network.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://t.me/nodusprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nodus Protocol on Telegram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M21.94 4.03a1.5 1.5 0 0 0-2.04-1.63L2.8 9.05c-1.32.52-1.23 2.42.13 2.82l4.35 1.27 1.63 5.2c.4 1.26 2 1.62 2.9.66l2.34-2.5 4.53 3.32c.9.66 2.18.17 2.4-.93l2.86-14.86ZM4.55 10.5 19.4 4.68l-2.62 13.6-4.87-3.57a1 1 0 0 0-1.32.12l-1.62 1.73.62-3.03 6.9-6.6a.5.5 0 0 0-.6-.79l-8.72 5.19-2.62-.83Z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/nodusprotocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Nodus Protocol on X"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Protocol
              </h4>
              <ul className="space-y-2.5 text-sm font-medium text-foreground/80">
                <li>Threat Intelligence</li>
                <li>Guardian Network</li>
                <li>Token Staking</li>
                <li>Governance</li>
                <li>
                  <Link
                    href="/support"
                    className="hover:text-primary transition-colors"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support#privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/70 pt-6">
            <span className="text-sm text-muted-foreground">
              Nodus Protocol &copy; {new Date().getFullYear()}
            </span>
            <span className="text-sm font-semibold">Protect Before You Connect.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
