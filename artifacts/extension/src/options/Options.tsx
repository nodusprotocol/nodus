import { useEffect, useState } from "react";
import {
  DEFAULT_API_BASE,
  getSettings,
  normalizeBase,
  saveSettings,
} from "../shared/config";
import type { Settings } from "../shared/types";

export function Options() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void getSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  function update(patch: Partial<Settings>) {
    setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaved(false);
  }

  async function persist(patch: Partial<Settings>) {
    const next = await saveSettings(patch);
    setSettings(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function addDomain() {
    const host = cleanDomain(newDomain);
    if (!host || settings!.whitelist.includes(host)) {
      setNewDomain("");
      return;
    }
    void persist({ whitelist: [...settings!.whitelist, host] });
    setNewDomain("");
  }

  function removeDomain(host: string) {
    void persist({ whitelist: settings!.whitelist.filter((d) => d !== host) });
  }

  const walletValid = settings.walletAddress === "" || isSolanaAddress(settings.walletAddress);

  return (
    <div className="options">
      <div className="sheet">
        <header className="opt-head">
          <div className="brand">
            <img src="icons/icon48.png" alt="Nodus" />
            <div className="name">
              NODUS <span>SHIELD</span>
            </div>
          </div>
          <span className="tag">Settings</span>
        </header>

        <section className="card">
          <div className="row">
            <div>
              <div className="row-title">Real-time protection</div>
              <div className="row-sub">Scan every site you visit and color the toolbar badge.</div>
            </div>
            <button
              className={`toggle ${settings.protectionEnabled ? "on" : ""}`}
              role="switch"
              aria-checked={settings.protectionEnabled}
              onClick={() => persist({ protectionEnabled: !settings.protectionEnabled })}
            >
              <span className="knob" />
            </button>
          </div>
        </section>

        <section className="card">
          <label className="field-label" htmlFor="api">
            Nodus backend URL
          </label>
          <div className="row-sub mb">
            The Nodus API the extension scans against. Use your deployed URL in production.
          </div>
          <div className="inline">
            <input
              id="api"
              className="input"
              value={settings.apiBase}
              placeholder={DEFAULT_API_BASE}
              onChange={(e) => update({ apiBase: e.target.value })}
              onBlur={() => persist({ apiBase: normalizeBase(settings.apiBase) || DEFAULT_API_BASE })}
            />
            <button
              className="pill pill-ghost"
              onClick={() => persist({ apiBase: DEFAULT_API_BASE })}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="card">
          <label className="field-label" htmlFor="wallet">
            Guardian wallet (Solana)
          </label>
          <div className="row-sub mb">
            Optional. Link your Phantom wallet address to associate scans with your Guardian
            profile on Nodus.
          </div>
          <input
            id="wallet"
            className={`input ${!walletValid ? "invalid" : ""}`}
            value={settings.walletAddress}
            placeholder="e.g. 7xKX...9dQ2"
            onChange={(e) => update({ walletAddress: e.target.value.trim() })}
            onBlur={() => walletValid && persist({ walletAddress: settings.walletAddress })}
          />
          {!walletValid && <div className="err">That doesn't look like a Solana address.</div>}
        </section>

        <section className="card">
          <div className="field-label">Trusted whitelist</div>
          <div className="row-sub mb">
            Sites you trust. These are never scanned and never show a warning banner.
          </div>
          <div className="inline">
            <input
              className="input"
              value={newDomain}
              placeholder="example.com"
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDomain()}
            />
            <button className="pill pill-primary" onClick={addDomain}>
              Add
            </button>
          </div>
          {settings.whitelist.length > 0 ? (
            <ul className="chips">
              {settings.whitelist.map((host) => (
                <li key={host} className="wl-chip">
                  {host}
                  <button aria-label={`Remove ${host}`} onClick={() => removeDomain(host)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">No trusted sites yet.</div>
          )}
        </section>

        <footer className="opt-foot">
          <span className={`saved ${saved ? "show" : ""}`}>✓ Saved</span>
          <span className="muted">Protect before you connect.</span>
        </footer>
      </div>
    </div>
  );
}

function cleanDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    const withProto = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    return new URL(withProto).hostname;
  } catch {
    return trimmed.replace(/^www\./, "");
  }
}

function isSolanaAddress(value: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
}
