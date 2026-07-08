import { scanTarget } from "../shared/api";
import { CACHE_TTL_MS, getSettings } from "../shared/config";
import { badgeColor } from "../shared/score";
import type { CachedScan, GetScanResponse, RuntimeMessage } from "../shared/types";

function domainOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.hostname;
  } catch {
    return null;
  }
}

const cacheKey = (domain: string) => `scan:${domain}`;

async function getCached(domain: string): Promise<CachedScan | null> {
  const key = cacheKey(domain);
  const stored = await chrome.storage.local.get(key);
  const cached = stored[key] as CachedScan | undefined;
  if (!cached || cached.error || !cached.result) return null;
  if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
  return cached;
}

async function scanAndCache(domain: string): Promise<CachedScan> {
  try {
    const result = await scanTarget(domain, "website");
    const cached: CachedScan = { result, fetchedAt: Date.now() };
    await chrome.storage.local.set({ [cacheKey(domain)]: cached });
    return cached;
  } catch (err) {
    // Never persist errors — a transient network failure should not poison the
    // cache for 5 minutes.
    return {
      fetchedAt: Date.now(),
      error: err instanceof Error ? err.message : "Scan failed.",
    };
  }
}

async function clearBadge(tabId: number): Promise<void> {
  await chrome.action.setBadgeText({ tabId, text: "" });
}

async function updateBadge(tabId: number, cached: CachedScan): Promise<void> {
  if (cached.error || !cached.result) {
    await chrome.action.setBadgeText({ tabId, text: "!" });
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#6b7280" });
    return;
  }
  const { verdict, score } = cached.result;
  await chrome.action.setBadgeText({ tabId, text: String(score) });
  await chrome.action.setBadgeBackgroundColor({ tabId, color: badgeColor(verdict) });
  if (chrome.action.setBadgeTextColor) {
    await chrome.action.setBadgeTextColor({ tabId, color: "#ffffff" });
  }
}

async function processTab(tabId: number, url: string | undefined): Promise<void> {
  const settings = await getSettings();
  const domain = domainOf(url);

  if (!settings.protectionEnabled || !domain || settings.whitelist.includes(domain)) {
    await clearBadge(tabId);
    return;
  }

  let cached = await getCached(domain);
  if (!cached) cached = await scanAndCache(domain);
  await updateBadge(tabId, cached);

  if (cached.result && cached.result.verdict === "danger") {
    chrome.tabs
      .sendMessage(tabId, {
        type: "NODUS_WARN",
        payload: cached.result,
        apiBase: settings.apiBase,
      })
      .catch(() => {
        // content script may not be ready on this page; ignore.
      });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    void processTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    await processTab(tabId, tab.url);
  } catch {
    // tab may have closed; ignore.
  }
});

chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, sender, sendResponse) => {
    if (message.type === "GET_SCAN") {
      void (async () => {
        const domain = domainOf(message.url);
        if (!domain) {
          sendResponse({
            fetchedAt: Date.now(),
            error: "This page can't be scanned.",
          } satisfies GetScanResponse);
          return;
        }
        const settings = await getSettings();
        if (!settings.protectionEnabled) {
          sendResponse({ fetchedAt: Date.now(), disabled: true, domain });
          return;
        }
        if (settings.whitelist.includes(domain)) {
          sendResponse({ fetchedAt: Date.now(), whitelisted: true, domain });
          return;
        }
        let cached = await getCached(domain);
        if (!cached || message.force) cached = await scanAndCache(domain);
        sendResponse({ ...cached, domain });
      })();
      return true; // async response
    }

    if (message.type === "CONTENT_READY") {
      void (async () => {
        const domain = domainOf(sender.tab?.url);
        const settings = await getSettings();
        if (!domain || !settings.protectionEnabled || settings.whitelist.includes(domain)) {
          sendResponse({ warn: false });
          return;
        }
        const cached = await getCached(domain);
        if (cached?.result && cached.result.verdict === "danger") {
          sendResponse({ warn: true, result: cached.result, apiBase: settings.apiBase });
        } else {
          sendResponse({ warn: false });
        }
      })();
      return true; // async response
    }

    return undefined;
  },
);
