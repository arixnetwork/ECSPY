// ECSPY Content Script v2.4.1
// Injected into every page — detects Shopify/WooCommerce and reports to popup

(function() {
  'use strict';

  const ECSPY = {
    platform: null,
    meta: {},

    // Detect what platform this page is running
    detect() {
      this.platform = this.detectPlatform();
      this.meta = this.extractMeta();

      // Report to background
      chrome.runtime.sendMessage({
        type: 'PAGE_DATA',
        data: {
          url: window.location.href,
          platform: this.platform,
          meta: this.meta,
          title: document.title,
          timestamp: Date.now()
        }
      });
    },

    detectPlatform() {
      // Shopify detection signals
      const shopifySignals = [
        () => window.Shopify !== undefined,
        () => document.querySelector('meta[name="shopify-checkout-api-token"]') !== null,
        () => document.querySelector('link[rel="canonical"]')?.href?.includes('myshopify.com'),
        () => !!document.querySelector('[data-shopify]'),
        () => !!document.querySelector('script[src*="shopify"]'),
        () => window.location.hostname.includes('myshopify.com')
      ];

      if (shopifySignals.some(fn => { try { return fn(); } catch(e) { return false; } })) {
        return 'shopify';
      }

      // WooCommerce detection signals
      const wooSignals = [
        () => !!document.querySelector('.woocommerce'),
        () => !!document.querySelector('body.woocommerce-page'),
        () => !!document.querySelector('[class*="woocommerce"]'),
        () => !!document.querySelector('script[src*="woocommerce"]'),
        () => !!window.wc_add_to_cart_params,
        () => !!window.woocommerce_params
      ];

      if (wooSignals.some(fn => { try { return fn(); } catch(e) { return false; } })) {
        return 'woocommerce';
      }

      // Generic WordPress
      const wpSignals = [
        () => !!document.querySelector('meta[name="generator"][content*="WordPress"]'),
        () => !!document.querySelector('link[rel="https://api.w.org/"]'),
        () => !!window.wp
      ];

      if (wpSignals.some(fn => { try { return fn(); } catch(e) { return false; } })) {
        return 'wordpress';
      }

      return null;
    },

    extractMeta() {
      const meta = {};

      // Basic SEO meta
      meta.title = document.title;
      meta.description = document.querySelector('meta[name="description"]')?.content || '';
      meta.keywords = document.querySelector('meta[name="keywords"]')?.content || '';
      meta.canonical = document.querySelector('link[rel="canonical"]')?.href || '';
      meta.lang = document.documentElement.lang || '';

      // Open Graph
      meta.ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
      meta.ogDescription = document.querySelector('meta[property="og:description"]')?.content || '';
      meta.ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
      meta.ogType = document.querySelector('meta[property="og:type"]')?.content || '';

      // Shopify specific
      if (this.platform === 'shopify') {
        meta.shopifyTheme = window.Shopify?.theme?.name || '';
        meta.shopifyThemeId = window.Shopify?.theme?.id || '';
        meta.currency = window.Shopify?.currency?.active || '';
        meta.shopName = window.Shopify?.shop || '';
        meta.checkoutToken = document.querySelector('meta[name="shopify-checkout-api-token"]')?.content || '';
      }

      // WooCommerce specific
      if (this.platform === 'woocommerce') {
        meta.wcVersion = document.querySelector('meta[name="generator"]')?.content?.match(/WooCommerce ([\d.]+)/)?.[1] || '';
        meta.wpVersion = document.querySelector('meta[name="generator"]')?.content?.match(/WordPress ([\d.]+)/)?.[1] || '';
        meta.currency = window.woocommerce_params?.currency || '';
      }

      // Apps / pixels detection
      meta.apps = this.detectApps();

      return meta;
    },

    detectApps() {
      const apps = [];
      const checks = [
        { name: 'Klaviyo', check: () => !!window._learnq || !!document.querySelector('script[src*="klaviyo"]') },
        { name: 'Facebook Pixel', check: () => !!window.fbq },
        { name: 'Google Analytics', check: () => !!window.gtag || !!window.ga },
        { name: 'TikTok Pixel', check: () => !!window.ttq },
        { name: 'Yotpo', check: () => !!window.yotpo || !!document.querySelector('script[src*="yotpo"]') },
        { name: 'Loox', check: () => !!document.querySelector('script[src*="loox"]') },
        { name: 'Judge.me', check: () => !!document.querySelector('script[src*="judgeme"]') },
        { name: 'ReConvert', check: () => !!document.querySelector('script[src*="reconvert"]') },
        { name: 'Lucky Orange', check: () => !!window.__lo_site_id },
        { name: 'Hotjar', check: () => !!window.hj },
        { name: 'Intercom', check: () => !!window.Intercom },
        { name: 'Crisp', check: () => !!window.$crisp },
        { name: 'Smile.io', check: () => !!document.querySelector('script[src*="smile.io"]') },
        { name: 'Omnisend', check: () => !!window.Omnisend },
        { name: 'Stripe', check: () => !!window.Stripe },
        { name: 'PayPal', check: () => !!window.paypal },
        { name: 'Elementor', check: () => !!document.querySelector('.elementor') },
        { name: 'WP Rocket', check: () => !!document.querySelector('script[src*="wp-rocket"]') }
      ];

      checks.forEach(({ name, check }) => {
        try { if (check()) apps.push(name); } catch(e) {}
      });

      return apps;
    },

    // Inject floating launcher button
    injectLauncher() {
      if (document.getElementById('ecspy-launcher')) return;

      chrome.storage.local.get(['showLauncher'], (result) => {
        if (result.showLauncher === false) return;

        const btn = document.createElement('div');
        btn.id = 'ecspy-launcher';
        btn.innerHTML = `
          <div style="
            position:fixed;bottom:20px;right:20px;z-index:2147483647;
            width:48px;height:48px;border-radius:12px;
            background:#f07820;cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 4px 20px rgba(240,120,32,.5);
            transition:transform .2s,box-shadow .2s;
            font-family:sans-serif;
          " title="Analyze with ECSPY" onmouseover="this.style.transform='scale(1.1)';this.style.boxShadow='0 6px 28px rgba(240,120,32,.7)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 4px 20px rgba(240,120,32,.5)'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        `;
        btn.onclick = () => chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
        document.body.appendChild(btn);
      });
    }
  };

  // Run detection when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ECSPY.detect();
      ECSPY.injectLauncher();
    });
  } else {
    ECSPY.detect();
    ECSPY.injectLauncher();
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_PAGE_META') {
      sendResponse({
        platform: ECSPY.platform,
        meta: ECSPY.meta,
        url: window.location.href,
        title: document.title
      });
    }
    if (message.type === 'EXTRACT_PRODUCTS') {
      sendResponse(extractProducts());
    }
  });

  function extractProducts() {
    const products = [];
    // Shopify products JSON endpoint
    if (ECSPY.platform === 'shopify') {
      return { note: 'Fetch /products.json for full catalog', shopify: true };
    }
    return products;
  }

})();
