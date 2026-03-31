// ECSPY Background Service Worker v2.4.1
// Handles extension lifecycle, messaging, and data caching

const ECSPY_VERSION = '2.4.1';
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// On install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      credits: 100,
      plan: 'free',
      installedAt: Date.now(),
      version: ECSPY_VERSION
    });
    // Open welcome page
    chrome.tabs.create({ url: 'https://ecspy.net/welcome?source=extension' });
  }

  if (details.reason === 'update') {
    chrome.storage.local.set({ version: ECSPY_VERSION });
  }
});

// Listen for messages from popup / content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {

    case 'GET_TAB_URL':
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ url: tabs[0]?.url || '' });
      });
      return true; // async

    case 'DETECT_PLATFORM':
      detectPlatform(message.url).then(sendResponse);
      return true;

    case 'GET_STORE_DATA':
      getStoreData(message.url).then(sendResponse);
      return true;

    case 'USE_CREDIT':
      useCredit(message.cost, message.action).then(sendResponse);
      return true;

    case 'GET_CREDITS':
      chrome.storage.local.get(['credits', 'plan'], sendResponse);
      return true;

    case 'OPEN_DASHBOARD':
      chrome.tabs.create({ url: 'https://ecspy.net/dashboard' });
      sendResponse({ success: true });
      break;
  }
});

// Platform detection
async function detectPlatform(url) {
  try {
    const domain = new URL(url).hostname;

    // Shopify detection
    if (domain.includes('myshopify.com')) {
      return { platform: 'shopify', domain, confidence: 'high' };
    }

    // Check cache first
    const cached = await getCache(`platform_${domain}`);
    if (cached) return cached;

    // Simulate detection logic
    const result = {
      platform: domain.includes('woo') || domain.includes('shop') ? 'woocommerce' : 'unknown',
      domain,
      confidence: 'medium'
    };

    await setCache(`platform_${domain}`, result);
    return result;

  } catch (e) {
    return { platform: 'unknown', error: e.message };
  }
}

// Store data fetcher (demo/simulation)
async function getStoreData(url) {
  try {
    const domain = new URL(url).hostname;
    const cached = await getCache(`store_${domain}`);
    if (cached) return cached;

    // In production: call ECSPY API
    // const res = await fetch(`https://api.ecspy.net/v2/analyze?url=${encodeURIComponent(url)}`);
    // const data = await res.json();

    // Demo data
    const data = {
      domain,
      platform: domain.includes('myshopify') ? 'shopify' : 'woocommerce',
      revenue: Math.floor(Math.random() * 100000) + 10000,
      traffic: Math.floor(Math.random() * 200000) + 20000,
      products: Math.floor(Math.random() * 300) + 20,
      apps: Math.floor(Math.random() * 15) + 3,
      theme: 'Dawn',
      convRate: (Math.random() * 3 + 1).toFixed(1),
      timestamp: Date.now()
    };

    await setCache(`store_${domain}`, data);
    return data;

  } catch (e) {
    return { error: e.message };
  }
}

// Credit management
async function useCredit(cost, action) {
  return new Promise((resolve) => {
    chrome.storage.local.get(['credits'], (result) => {
      const current = result.credits || 0;
      if (current < cost) {
        resolve({ success: false, reason: 'insufficient_credits', credits: current });
        return;
      }
      const newCredits = current - cost;
      chrome.storage.local.set({ credits: newCredits }, () => {
        // Log action
        logAction(action, cost);
        resolve({ success: true, credits: newCredits, used: cost });
      });
    });
  });
}

function logAction(action, cost) {
  chrome.storage.local.get(['actionLog'], (result) => {
    const log = result.actionLog || [];
    log.unshift({ action, cost, timestamp: Date.now() });
    if (log.length > 50) log.splice(50);
    chrome.storage.local.set({ actionLog: log });
  });
}

// Cache helpers
async function getCache(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key, `${key}_ttl`], (result) => {
      const ttl = result[`${key}_ttl`];
      if (ttl && Date.now() > ttl) {
        chrome.storage.local.remove([key, `${key}_ttl`]);
        resolve(null);
      } else {
        resolve(result[key] || null);
      }
    });
  });
}

async function setCache(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      [key]: value,
      [`${key}_ttl`]: Date.now() + CACHE_TTL
    }, resolve);
  });
}

// Context menu
chrome.contextMenus?.create({
  id: 'ecspy-analyze',
  title: 'Analyze this store with ECSPY',
  contexts: ['page', 'link']
});

chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ecspy-analyze') {
    chrome.action.openPopup();
  }
});
