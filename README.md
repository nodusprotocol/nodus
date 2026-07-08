<div align="center">

# Nodus Protocol

**Protect Before You Connect.**

The Web3 security layer for Solana — real-time threat scanning, AI risk analysis, and a community-driven Guardian Network that stops scams before your wallet gets drained.

<br/>

[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Chrome Extension](https://img.shields.io/badge/Nodus_Shield-Browser_Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](#nodus-shield-browser-extension)
[![Status](https://img.shields.io/badge/Status-Live-22C55E?style=for-the-badge)](#)

[![Telegram](https://img.shields.io/badge/Telegram-@nodusprotocol-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/nodusprotocol)
[![X](https://img.shields.io/badge/X-@nodusprotocol-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/nodusprotocol)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Nodus Shield — Browser Extension](#nodus-shield--browser-extension)
  - [Installation](#installation)
  - [Using the Extension](#using-the-extension)
  - [Troubleshooting](#troubleshooting)
- [Using the Web Platform](#using-the-web-platform)
- [$NDS Token](#nds-token)
- [Architecture](#architecture)
- [Privacy & Security](#privacy--security)
- [Roadmap](#roadmap)
- [Community](#community)
- [Disclaimer](#disclaimer)

---

## Overview

Billions are lost every year to wallet drainers, phishing sites, malicious token approvals, and rug pulls. The problem is not a lack of threat data — it is that the data is fragmented, technical, and arrives too late.

Nodus Protocol sits between the user and the on-chain world. It aggregates live threat intelligence from multiple sources, applies AI analysis, and fuses in community-verified reports to produce one clear verdict for any website, wallet, token, or smart contract:

| Verdict | Score | Meaning |
| :--- | :---: | :--- |
| Safe | 75 – 100 | No threats detected across sources |
| Caution | 45 – 74 | Mixed signals — proceed carefully |
| Danger | 0 – 44 | Known or likely threat — do not connect |

Every verdict is built from real, live data — no mocked signals.

---

## Core Features

### Multi-Source Scan Engine
Scan any target — website URL, wallet address, smart contract, token, or social account. Nodus queries multiple threat-intelligence sources (including VirusTotal and GoPlus) plus its own community threat database, then normalizes everything into a single 0–100 risk score.

### Nodus AI
An AI analysis layer that reads complex threat patterns and translates raw detections into plain-language recommendations anyone can understand — not just security researchers.

### Guardian Network
A decentralized community of threat reporters. Every report is cryptographically signed with the reporter's Solana wallet — a gas-less signature that never moves funds or grants approvals. The backend verifies the signature, enforces a freshness window, and blocks replays before accepting a report.

Guardians earn on-chain reputation across three tiers:

| Tier | Role |
| :--- | :--- |
| Guardian | Entry tier for new contributors |
| Protector | Consistent, verified reporters |
| Sentinel | Highest tier with the most verification weight |

### Live Threat Feed
A real-time, community-driven feed of verified threats across the Solana ecosystem.

---

## Nodus Shield — Browser Extension

Nodus Shield brings protection to the point of decision: your browser.

- Scans the site you are visiting in real time, before you connect your wallet
- Shows a clear safe / caution / danger verdict on the extension icon
- Lets you report threats directly from the page, signed with your wallet (Phantom supported)
- No remote code, no fund movement, no approvals — signatures are used for identity only

### Installation

Nodus Shield is available as a direct download while the Chrome Web Store listing is under review. It works on Chrome, Brave, and Edge (any Chromium-based browser).

**Step 1 — Download and extract**

Download `nodus-shield-extension.zip` from the **Download Extension** button on the website, then extract the ZIP to a folder you can find again (for example, a folder named `nodus-shield`). Do not delete this folder after installing — the browser loads the extension from it.

**Step 2 — Open the Extensions page**

| Browser | Address |
| :--- | :--- |
| Chrome | `chrome://extensions` |
| Brave | `brave://extensions` |
| Edge | `edge://extensions` |

Type the address into the address bar and press Enter.

**Step 3 — Enable Developer mode**

Turn on the **Developer mode** toggle in the top-right corner of the Extensions page.

**Step 4 — Load the extension**

Click **Load unpacked** and select the extracted folder — the one that contains `manifest.json`.

**Step 5 — Pin the shield**

Click the puzzle icon in the browser toolbar and pin **Nodus Shield** so the security badge is always visible.

### Using the Extension

1. Browse normally — Nodus Shield scans each site you visit automatically.
2. Watch the badge on the extension icon: it reflects the current site's verdict (safe / caution / danger).
3. Click the icon to open the popup with the full risk breakdown and score.
4. Found a scam? Use **Report Threat** in the popup — connect Phantom, sign the gas-less message, and your report joins the Guardian Network.

### Troubleshooting

| Issue | Solution |
| :--- | :--- |
| Badge is grey / not scanning | Badges only appear on normal `http(s)` websites. Browser system pages (`chrome://`, the extensions page, new-tab page) cannot be scanned. Open a regular website and the badge updates automatically. |
| Extension disappeared after restart | The extension folder was moved or deleted. Keep the extracted folder in place, or re-install following the steps above. |
| Cannot sign a report | Signing requires the Phantom extension and must happen on a normal website tab — open the site in a regular tab and try again. |
| "Load unpacked" is missing | Developer mode is off. Enable the toggle in the top-right corner of the Extensions page. |

---

## Using the Web Platform

| Page | What you can do |
| :--- | :--- |
| **Scan** | Check any website, wallet address, smart contract, token, or social account and get an instant 0–100 risk score. |
| **Nodus AI** | Ask questions and get plain-language explanations of complex threat patterns. |
| **Threats** | Browse the live feed of community-verified threats across the ecosystem. |
| **Report** | Submit a threat report signed with your Solana wallet — gas-less, funds never move. |
| **Dashboard** | Track your Guardian reputation, tier, and contribution history. |
| **Staking** | Stake $NDS to secure the network and earn rewards. |
| **Whitepaper** | Read the full protocol design, tokenomics, and roadmap. |

---

## $NDS Token

The $NDS token aligns incentives across the network:

- **Stake and secure** — lock NDS to help secure the network and earn protocol rewards
- **Earn yield** — tiered rewards for long-term stakers
- **Governance** — reputation-weighted voting on protocol policy and funding

> $NDS is launching soon on Pump.fun. Token details are a preview and may change ahead of launch.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Delivery Layer                      │
│        Web App  ·  Public API  ·  Nodus Shield          │
├─────────────────────────────────────────────────────────┤
│                    AI Analysis Layer                    │
│     Signal fusion → single plain-language verdict       │
├─────────────────────────────────────────────────────────┤
│     Intelligence Layer          Community Layer         │
│  VirusTotal · GoPlus · more   Wallet-signed reports     │
└─────────────────────────────────────────────────────────┘
```

| Component | Stack |
| :--- | :--- |
| Web application | React, TypeScript, Vite, Tailwind CSS |
| API server | Node.js, TypeScript, PostgreSQL |
| Browser extension | Chrome Manifest V3, TypeScript |
| Chain | Solana (wallet signature verification, on-chain reputation) |

---

## Privacy & Security

- **Wallet signatures are identity only.** Reports are signed with a gas-less message — no transactions, no fund movement, no token approvals, ever.
- **Replay protection.** Every signed report carries a freshness window and is verified server-side; bare wallet addresses are never trusted.
- **Minimal data.** The extension sends only the URL needed for a security scan — page content is never collected.
- **No remote code.** Everything the extension executes ships inside the package.

---

## Roadmap

| Phase | Milestone | Status |
| :---: | :--- | :--- |
| 1 | Security Foundation — multi-source scan engine, AI analysis, live threat feed | Completed |
| 2 | Guardian Network — on-chain reputation, leaderboards, signed report verification | In Progress |
| 3 | Proactive Protection — Nodus Shield browser extension | In Progress |
| 4 | Decentralized Governance — reputation-based protocol governance | Upcoming |

---

## Community

| Channel | Link |
| :--- | :--- |
| Telegram | [t.me/nodusprotocol](https://t.me/nodusprotocol) |
| X (Twitter) | [x.com/nodusprotocol](https://x.com/nodusprotocol) |

---

## Disclaimer

Nodus Protocol provides risk signals to help users make informed decisions. It does not constitute financial advice, and a "safe" verdict is not a guarantee. Always do your own research before signing transactions or connecting your wallet. Token details are preliminary and subject to change.

<div align="center">

**Nodus Protocol — Protect Before You Connect.**

</div>
