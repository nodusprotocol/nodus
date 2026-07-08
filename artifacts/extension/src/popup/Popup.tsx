import { useEffect, useMemo, useState } from "react";
import { getSettings, normalizeBase } from "../shared/config";
import { badgeColor, buildSummary, verdictLabel } from "../shared/score";
import type { GetScanResponse, ScanResult, Settings } from "../shared/types";
import { submitReport, type ThreatType } from "./report";

interface State {
  loading: boolean;
  domain?: string;
  url?: string;
  tabId?: number;
  result?: ScanResult;
  error?: string;
  whitelisted?: boolean;
  disabled?: boolean;
}

const THREAT_TYPES: { value: ThreatType; label: string }[] = [
  { value: "phishing", label: "Phishing" },
  { value: "drainer", label: "Wallet drainer" },
  { value: "scam", label: "Scam" },
  { value: "rugpull", label: "Rugpull" },
  { value: "fake_token", label: "Fake token" },
  { value: "fake_social", label: "Fake account" },
  { value: "malicious_contract", label: "Malicious contract" },
  { value: "other", label: "Other" },
];

async function activeTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function getScan(url: string, force = false): Promise<GetScanResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_SCAN", url, force }, (resp) => {
      if (chrome.runtime.lastError || !resp) {
        resolve({ fetchedAt: Date.now(), error: "Background worker unavailable." });
        return;
      }
      resolve(resp as GetScanResponse);
    });
  });
}

export function Popup() {
  const [state, setState] = useState<State>({ loading: true });
  const [settings, setSettings] = useState<Settings | null>(null);
  const [rescanning, setRescanning] = useState(false);
  const [reporting, setReporting] = useState(false);

  async function load(force = false) {
    setSettings(await getSettings());

    const tab = await activeTab();
    if (!tab?.url) {
      setState({ loading: false, error: "No active tab." });
      return;
    }
    const resp = await getScan(tab.url, force);
    setState({
      loading: false,
      url: tab.url,
      tabId: tab.id,
      domain: resp.domain,
      result: resp.result,
      error: resp.error,
      whitelisted: resp.whitelisted,
      disabled: resp.disabled,
    });
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const webBase = useMemo(
    () => normalizeBase(settings?.apiBase ?? ""),
    [settings?.apiBase],
  );

  async function rescan() {
    if (!state.url) return;
    setRescanning(true);
    await load(true);
    setRescanning(false);
  }

  function openFullReport() {
    chrome.tabs.create({ url: `${webBase}/scan` });
  }

  function openSettings() {
    chrome.runtime.openOptionsPage();
  }

  return (
    <div className="popup">
      <header className="popup-head">
        <div className="brand">
          <img src="icons/icon48.png" alt="Nodus" />
          <div className="name">
            NODUS <span>SHIELD</span>
          </div>
        </div>
        <button className="icon-btn" title="Settings" onClick={openSettings} aria-label="Settings">
          ⚙
        </button>
      </header>

      {state.loading ? (
        <div className="state">
          <div className="spinner" />
          <p>Scanning current site…</p>
        </div>
      ) : state.error && !state.domain ? (
        <div className="state">
          <div className="glyph muted">◎</div>
          <p className="state-title">{state.error}</p>
          <p className="state-sub">Open a regular website (http/https) to run a scan.</p>
        </div>
      ) : state.disabled ? (
        <div className="state">
          <div className="glyph muted">‖</div>
          <p className="state-title">Protection is off</p>
          <p className="state-sub">
            Real-time scanning is disabled. Turn it back on to scan sites automatically.
          </p>
          <button className="pill pill-primary wide" onClick={openSettings}>
            Open settings
          </button>
        </div>
      ) : state.whitelisted ? (
        <div className="state">
          <div className="glyph safe">✓</div>
          <p className="state-title">{state.domain}</p>
          <p className="state-sub">This site is on your trusted whitelist. Scanning is skipped.</p>
          <button className="pill pill-ghost wide" onClick={openSettings}>
            Manage whitelist
          </button>
        </div>
      ) : state.error ? (
        <div className="state">
          <div className="glyph muted">!</div>
          <p className="state-title">Couldn't scan {state.domain}</p>
          <p className="state-sub">{state.error}</p>
          <button className="pill pill-primary wide" onClick={rescan} disabled={rescanning}>
            {rescanning ? "Retrying…" : "Try again"}
          </button>
        </div>
      ) : state.result && reporting ? (
        <ReportForm
          domain={state.domain ?? state.result.target}
          tabId={state.tabId}
          apiBase={webBase}
          onClose={() => setReporting(false)}
        />
      ) : state.result ? (
        <Result
          result={state.result}
          rescanning={rescanning}
          onRescan={rescan}
          onReport={() => setReporting(true)}
          onFull={openFullReport}
        />
      ) : null}

      <footer className="popup-foot">
        <span>Protect before you connect.</span>
      </footer>
    </div>
  );
}

function Result({
  result,
  rescanning,
  onRescan,
  onReport,
  onFull,
}: {
  result: ScanResult;
  rescanning: boolean;
  onRescan: () => void;
  onReport: () => void;
  onFull: () => void;
}) {
  const color = badgeColor(result.verdict);
  const circumference = 2 * Math.PI * 52;
  const dash = (result.score / 100) * circumference;

  return (
    <div className="result">
      <div className="domain">{result.target}</div>

      <div className="gauge-wrap">
        <svg viewBox="0 0 120 120" className="gauge">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#ececec" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="gauge-center">
          <div className="score" style={{ color }}>
            {result.score}
          </div>
          <div className="verdict" style={{ color }}>
            {verdictLabel(result.verdict)}
          </div>
        </div>
      </div>

      <p className="summary">{buildSummary(result)}</p>

      <div className="signals">
        {result.knownThreat && <span className="chip chip-danger">Known threat</span>}
        <span className={`chip ${result.communityReports > 0 ? "chip-warn" : "chip-neutral"}`}>
          {result.communityReports} community report{result.communityReports === 1 ? "" : "s"}
        </span>
      </div>

      <div className="breakdown">
        <div className="breakdown-title">Risk breakdown</div>
        {result.sources.map((s) => (
          <div className="source" key={s.source}>
            <div className="source-head">
              <span className="source-name">{s.source}</span>
              {s.available ? (
                <span className="source-score" style={{ color: badgeColor(scoreVerdict(s.score)) }}>
                  {s.score}
                </span>
              ) : (
                <span className="source-score na">N/A</span>
              )}
            </div>
            <div className="source-summary">{s.summary}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="pill pill-danger wide" onClick={onReport}>
          Report threat
        </button>
        <div className="actions-row">
          <button className="pill pill-ghost" onClick={onFull}>
            Full report
          </button>
          <button className="pill pill-ghost" onClick={onRescan} disabled={rescanning}>
            {rescanning ? "Rescanning…" : "Rescan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportForm({
  domain,
  tabId,
  apiBase,
  onClose,
}: {
  domain: string;
  tabId?: number;
  apiBase: string;
  onClose: () => void;
}) {
  const [threatType, setThreatType] = useState<ThreatType>("phishing");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    if (tabId == null) {
      setStatus("error");
      setError("Open the site in a normal tab to report it.");
      return;
    }
    if (!apiBase) {
      setStatus("error");
      setError("Backend URL is not set. Open settings and add the Nodus backend URL.");
      return;
    }
    setStatus("submitting");
    setError("");
    const outcome = await submitReport(tabId, {
      apiBase,
      target: domain,
      targetType: "website",
      threatType,
      description: description.trim() || undefined,
    });
    if (outcome.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(outcome.error ?? "Submission failed.");
    }
  }

  if (status === "done") {
    return (
      <div className="state">
        <div className="glyph safe">✓</div>
        <p className="state-title">Report submitted</p>
        <p className="state-sub">
          Thank you, Guardian. Your signed report for {domain} is being verified.
        </p>
        <button className="pill pill-primary wide" onClick={onClose}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="result">
      <div className="report-head">
        <button className="link-btn" onClick={onClose}>
          ‹ Back
        </button>
        <div className="report-title">Report threat</div>
      </div>
      <div className="domain">{domain}</div>

      <label className="rf-label" htmlFor="threat">
        Threat type
      </label>
      <select
        id="threat"
        className="rf-select"
        value={threatType}
        onChange={(e) => setThreatType(e.target.value as ThreatType)}
      >
        {THREAT_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <label className="rf-label" htmlFor="desc">
        Description <span className="opt">(optional)</span>
      </label>
      <textarea
        id="desc"
        className="rf-textarea"
        placeholder="Describe what happened…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <p className="rf-note">
        Submitting prompts a free (gas-less) signature in your Phantom wallet on this page to
        prove your Guardian identity.
      </p>

      {status === "error" && <p className="rf-error">{error}</p>}

      <div className="actions">
        <button
          className="pill pill-danger wide"
          onClick={submit}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Waiting for signature…" : "Sign & submit"}
        </button>
      </div>
    </div>
  );
}

function scoreVerdict(score: number): "safe" | "caution" | "danger" {
  if (score >= 75) return "safe";
  if (score >= 45) return "caution";
  return "danger";
}
