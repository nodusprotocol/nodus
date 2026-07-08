# Nodus Shield — Chrome Extension

Real-time Web3 threat scanning for every site you visit. Nodus Shield checks the
site in your active tab against the Nodus Protocol backend, colors the toolbar
badge (green / yellow / red), shows a security score and risk breakdown in the
popup, and drops a warning banner on pages flagged as high-risk.

> **Protect before you connect.**

---

## Build the extension

From the project root:

```bash
pnpm --filter @workspace/extension build
```

This produces a ready-to-load folder at:

```
artifacts/extension/dist
```

## Load it into Chrome (Load unpacked)

1. Open **chrome://extensions** in Chrome (or Brave/Edge — any Chromium browser).
2. Turn on **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the **`artifacts/extension/dist`** folder.
5. Nodus Shield appears in your toolbar. Pin it for quick access.

Now browse normally. The badge updates per site:

| Badge color | Meaning        | Score  |
| ----------- | -------------- | ------ |
| 🟢 Green    | Safe           | 75–100 |
| 🟡 Amber    | Caution        | 45–74  |
| 🔴 Red      | Danger / phishing | 0–44 |

Click the icon to see the full score gauge, risk breakdown per intelligence
source, a plain-language summary, and a **Report threat** button.

### Reporting a threat

The **Report threat** button in the popup submits directly to the Nodus backend
(`POST {backend}/api/reports`). Because reports grant Guardian reputation, the
backend requires a cryptographic signature: clicking **Sign & submit** prompts a
free, gas-less signature request in your **Phantom** wallet on the current page.
Phantom must be installed and the site must be a normal `http(s)` tab.

## Settings

Right-click the icon → **Options** (or click ⚙ in the popup):

- **Real-time protection** — turn scanning on/off.
- **Nodus backend URL** — which API to scan against (see below).
- **Guardian wallet** — link your Solana/Phantom address to your Guardian profile.
- **Trusted whitelist** — sites that are never scanned or warned on.

## Pointing at your backend

The extension ships with a default backend URL. Scans only work while that URL is
reachable. Set it to your **deployed** Nodus URL for a permanent install:

1. Deploy the Nodus project (the API is served under `/api`).
2. Open the extension's **Options** page.
3. Put your deployed origin (e.g. `https://your-app.replit.app`) in
   **Nodus backend URL** and click out of the field to save.

The extension calls `POST {backend}/api/scan` for each site.

## A note on permissions

The extension requests `tabs`, `activeTab`, `storage`, and `scripting`, plus
`host_permissions` for all sites. It does **not** request `webRequest`: real-time
scanning is driven by `chrome.tabs.onUpdated`/`onActivated` (navigation events),
not by intercepting network requests, so `webRequest` is unnecessary. `scripting`
is used only to sign reports with Phantom in the active tab. This keeps the
extension to least-privilege.

## What's out of scope (by design)

- Publishing to the Chrome Web Store (needs a paid developer account + review).
- Firefox / Safari builds.
- Deep on-chain wallet-approval monitoring.

## Rebuilding after changes

Re-run the build and click the **refresh** icon on the Nodus Shield card in
`chrome://extensions`.
