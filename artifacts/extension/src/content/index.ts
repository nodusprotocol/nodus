import { normalizeBase } from "../shared/config";
import { buildSummary } from "../shared/score";
import type { ScanResult } from "../shared/types";

const BANNER_ID = "nodus-shield-banner";
const STYLE_ID = "nodus-shield-style";

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${BANNER_ID} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 18px;
      background: #dc2626;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.28);
      animation: nodus-slide-down 0.28s ease-out;
    }
    @keyframes nodus-slide-down {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }
    #${BANNER_ID} .nodus-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.18);
      font-weight: 900;
      flex: 0 0 auto;
    }
    #${BANNER_ID} .nodus-text { flex: 1 1 auto; min-width: 0; }
    #${BANNER_ID} .nodus-title { font-weight: 800; letter-spacing: -0.01em; }
    #${BANNER_ID} .nodus-sub { opacity: 0.92; font-size: 13px; margin-top: 2px; }
    #${BANNER_ID} a.nodus-link {
      color: #fff;
      text-decoration: underline;
      font-weight: 700;
    }
    #${BANNER_ID} .nodus-actions { display: flex; align-items: center; gap: 10px; flex: 0 0 auto; }
    #${BANNER_ID} .nodus-report {
      background: #fff;
      color: #dc2626;
      border: none;
      border-radius: 999px;
      padding: 7px 14px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
    }
    #${BANNER_ID} .nodus-dismiss {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 999px;
      width: 28px;
      height: 28px;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
    }
  `;
  document.documentElement.appendChild(style);
}

function showBanner(result: ScanResult, apiBase: string): void {
  if (document.getElementById(BANNER_ID)) return;
  injectStyles();

  const base = normalizeBase(apiBase);
  const domain = result.target;

  const banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.setAttribute("role", "alert");

  const mark = document.createElement("span");
  mark.className = "nodus-mark";
  mark.textContent = "!";

  const text = document.createElement("div");
  text.className = "nodus-text";
  const title = document.createElement("div");
  title.className = "nodus-title";
  title.textContent = `Nodus Shield: high risk detected (${result.score}/100)`;
  const sub = document.createElement("div");
  sub.className = "nodus-sub";
  sub.textContent = buildSummary(result);
  const link = document.createElement("a");
  link.className = "nodus-link";
  link.href = `${base}/scan`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View full report";
  sub.append(" ", link);
  text.append(title, sub);

  const actions = document.createElement("div");
  actions.className = "nodus-actions";

  const report = document.createElement("button");
  report.className = "nodus-report";
  report.textContent = "Report threat";
  report.addEventListener("click", () => {
    window.open(`${base}/report?target=${encodeURIComponent(domain)}`, "_blank", "noopener");
  });

  const dismiss = document.createElement("button");
  dismiss.className = "nodus-dismiss";
  dismiss.title = "Dismiss";
  dismiss.textContent = "×";
  dismiss.addEventListener("click", () => banner.remove());

  actions.append(report, dismiss);
  banner.append(mark, text, actions);
  document.documentElement.appendChild(banner);
}

// Ask the background worker whether this page is already flagged as dangerous.
chrome.runtime.sendMessage({ type: "CONTENT_READY" }, (resp) => {
  if (chrome.runtime.lastError || !resp) return;
  if (resp.warn && resp.result) showBanner(resp.result, resp.apiBase);
});

// React to live warnings pushed after an async scan completes.
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "NODUS_WARN" && msg.payload) {
    showBanner(msg.payload as ScanResult, msg.apiBase ?? "");
  }
});
